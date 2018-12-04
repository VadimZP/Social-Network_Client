import React, { Component, Fragment } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { Switch, Route } from 'react-router'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import moment from 'moment'
import { List } from 'immutable'
import { connect } from 'react-redux'
import uuid from 'uuid'

import { getUsersRequested, getLastUserRequested } from 'redux/modules/users'
import { fetchUserRequested } from 'redux/modules/global'
import { openModal } from 'redux/modules/modals'
import { sendMessageRequested } from 'redux/modules/messages'
import { sendFriendshipRequested, getFriendsRequested, removeFriendRequested } from 'redux/modules/friends'

import './Friends.css'
import Person from './components/Person/Person'

class Friends extends Component {
  static propTypes = {
    getUsersRequested: PropTypes.func.isRequired,
    getLastUserRequested: PropTypes.func.isRequired,
    fetchUserRequested: PropTypes.func.isRequired,
    sendMessageRequested: PropTypes.func.isRequired,
    sendFriendshipRequested: PropTypes.func.isRequired,
    removeFriendRequested: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    friends: ImmutablePropTypes.listOf(ImmutablePropTypes.map).isRequired,
    users: ImmutablePropTypes.listOf(ImmutablePropTypes.map).isRequired,
    idOfLastUserInDB: PropTypes.string,
    userId: PropTypes.string.isRequired,
    searchResult: ImmutablePropTypes.listOf(ImmutablePropTypes.map),
    userData: ImmutablePropTypes.contains({
      id: ImmutablePropTypes.string,
      email: ImmutablePropTypes.string,
      password: ImmutablePropTypes.string,
      name: ImmutablePropTypes.string,
      surname: ImmutablePropTypes.string,
      gender: ImmutablePropTypes.string,
      birth: ImmutablePropTypes.string,
      avatar: ImmutablePropTypes.string
    }).isRequired
  }

  state = {
    componentBody: 'friends',
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.searchResult !== prevState.searchResult) {
      return {
        searchResult: nextProps.searchResult,
      }
    }
    return null
  }

  componentDidMount() {
    const {
      userData,
      getUsersRequested,
      getLastUserRequested,
      getFriendsRequested,
      users
    } = this.props

    getLastUserRequested(userData.get('id'))
    getFriendsRequested(userData.get('id'))

    if (!users.size) {
      getUsersRequested(userData.get('id'), 0, 4)
    }
  }

  handleScroll = e => {
    const { users, idOfLastUserInDB } = this.props

    const usersListElem = document.querySelector('.users-list')
    const lastUserInCurrentlyDisplayed = users && users.toJS().pop().id

    if (usersListElem && lastUserInCurrentlyDisplayed !== idOfLastUserInDB) {
      const { userId, getUsersRequested } = this.props

      const from = users.size
      const amount = 4

      if (e.target.getBoundingClientRect().bottom ===
        document.querySelector('.users-list').lastChild.getBoundingClientRect().bottom
      ) {
        getUsersRequested(userId, from, amount)
      }
    }
  }

  render() {
    const {
      match,
      fetchUserRequested,
      users,
      sendFriendshipRequested,
      friends,
      openModal,
      removeFriendRequested,
      sendMessageRequested,
    } = this.props

    const {
      id,
      name,
      surname,
      avatar
    } = this.props.userData.toJS()

    const { searchResult } = this.state

    let friendsList
    const friendsArr = searchResult.size ? searchResult : friends

    friendsList = friendsArr.toJS().map(user => {
      if (friends.toJS().find(friend => friend.id === user.id)) {
        return (
          <Person user={user} key={user.id}>
            <button
              type="button"
              className="button"
              onClick={() => openModal(sendMessageRequested.bind(null, user.id, id, name, surname, avatar, moment().format('YYYY-MM-DD HH:mm:ss')
              ), true, 'Send')}
            >
              Send a message
            </button>
            <button
              type="button"
              className="button"
              onClick={() => openModal(removeFriendRequested.bind(null, user.id, id))}
            >
              Remove from friends
            </button>
          </Person>
        )
      }
    })

    let usersList
    const usersArr = searchResult.size ? searchResult : users
    usersList = usersArr.toJS().map(user => {
      return (
        <Person user={user} key={user.id}>
          {!friends.toJS().find(friend => friend.id === user.id) ? (
            <button
              type="button"
              className="button"
              onClick={() => openModal(sendFriendshipRequested.bind(null, id, user.id, avatar, `${name} ${surname} wants to be your friend`))}
            >
              Add to your friends
            </button>
          ) : <h2 className="your-friend">Your friend</h2>}
        </Person>
      )
    })

    if (this.props.location.pathname.split('/').pop() === 'friends') {
      return <Redirect to={`${match.url}/comrades`} />
    }

    return (
      <Fragment>
        <nav className="navbar">
          <ul>
            <NavLink
              className="nav-link"
              to={`${match.url}/comrades`}
              onClick={() => {
                localStorage.setItem('searchUser', '')
                fetchUserRequested(localStorage.getItem('searchUser'))
              }}
            >
              Friends
            </NavLink>
            <NavLink
              className="nav-link"
              to={`${match.url}/users`}
              onClick={() => {
                localStorage.setItem('searchUser', '')
                fetchUserRequested(localStorage.getItem('searchUser'))
              }}
            >
             All Users
            </NavLink>
          </ul>
        </nav>
        <Switch>
          <Route path={`${match.url}/comrades`}
            render={() => (
              <Fragment>
                <div className="input-wrapper">
                  <input
                    type="search"
                    className="search-input"
                    id="friends-search"
                    placeholder="Find a friend"
                    defaultValue={localStorage.getItem('searchUser')}
                    onChange={(e) => {
                      localStorage.setItem('searchUser', e.target.value.trim());
                      fetchUserRequested(localStorage.getItem('searchUser'))
                    }}
                  />
                </div>
                <ul className="friends-list">{friendsList}</ul>
              </Fragment>
            )}
          />
          <Route
            path={`${match.url}/users`}
            render={() => (
              <Fragment>
                <input
                  type="search"
                  className="search-input"
                  id="users-search"
                  placeholder="Find a user"
                  defaultValue={localStorage.getItem('searchUser')}
                  onChange={(e) => {
                    localStorage.setItem('searchUser', e.target.value.trim())
                    fetchUserRequested(localStorage.getItem('searchUser'))
                  }}
                />
                <ul className="users-list" onScroll={this.handleScroll}>{usersList}</ul>
              </Fragment>
            )}
          />
        </Switch>
      </Fragment>
    )
  }
}

Friends.defaultProps = {
  searchResult: List(),
  idOfLastUserInDB: ''
}

const mapStateToProps = state => ({
  userData: state.getIn(['global', 'userData']),
  users: state.getIn(['users', 'listOfAll']),
  lastUser: state.getIn(['users', 'last']),
  searchResult: state.getIn(['global', 'searchResult']),
  friends: state.get('friends'),
  userId: state.getIn(['global', 'userData', 'id']),
  idOfLastUserInDB: state.getIn(['users', 'last', 'id'])
})

export default connect(
  mapStateToProps,
  {
    getUsersRequested,
    getLastUserRequested,
    fetchUserRequested,
    sendMessageRequested,
    sendFriendshipRequested,
    removeFriendRequested,
    getFriendsRequested,
    openModal: (func, customModal, btnText) => openModal({
      id: uuid.v4(),
      btnText,
      customModal,
      onConfirm: (arg) => func(arg)
    })
  }
)(Friends)
