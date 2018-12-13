import React, { Component, Fragment } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { Switch, Route } from 'react-router'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import moment from 'moment'
import { List } from 'immutable'
import { connect } from 'react-redux'
import uuid from 'uuid'
import Button from '@material-ui/core/Button'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import TextField from '@material-ui/core/TextField'
// import Icon from '@material-ui/icons/Icon'
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import SearchIcon from '@material-ui/icons/Search';
import DeleteIcon from '@material-ui/icons/Delete'
import SendIcon from '@material-ui/icons/Send'
import { withStyles } from '@material-ui/core/styles'

import { getUsersRequested, getLastUserRequested } from 'redux/modules/users'
import { fetchUserRequested } from 'redux/modules/global'
import { openModal } from 'redux/modules/modals'
import { sendMessageRequested } from 'redux/modules/messages'
import { sendFriendshipRequested, getFriendsRequested, removeFriendRequested } from 'redux/modules/friends'

import './Friends.css'
import Person from './components/Person/Person'

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  flexContainer: {
    minHeight: 'inherit'
  },
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
    overflow: 'initial',
    minHeight: 65,
  },
  tabsIndicator: {
    backgroundColor: '#34495E',
    height: 4,
  },
  tabRoot: {
    minHeight: 65,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.03)',
    },
    marginTop: 20,
    marginRight: 20,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: 20,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'rgba(0, 0, 0, 0.20)',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    width: '100%'
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
    width: 18,
    height: 18,
  }
})

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
    value: 0,
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.searchResult !== prevState.searchResult) {
      return {
        searchResult: nextProps.searchResult,
      }
    }
    return null
  }

  componentDidUpdate(prevProps) {
    const { userData, getUsersRequested, users } = this.props

    if(prevProps.users.equals(this.props.users)) {
     if (!users.size) {
        getUsersRequested(userData.get('id'), users.size, 4)
      }
    }
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

  handleChange = (event, value) => {
    this.setState({ value })
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
      history,
      classes
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
            <Button
              type="button"
              className="button"
              variant="contained"
              onClick={() => openModal(sendMessageRequested.bind(null, user.id, id, name, surname, avatar, moment().format('YYYY-MM-DD HH:mm:ss')
              ), true, 'Send')}
            >
              Message
              <SendIcon color="primary" className={classes.rightIcon} />
            </Button>
            <Button 
              type="button"
              className="button"
              variant="contained"
              onClick={() => openModal(removeFriendRequested.bind(null, user.id, id))}
            >
              Remove
              <DeleteIcon color="secondary" className={classes.rightIcon} /> 
            </Button>
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
            <Button 
              type="button"
              className="button"
              variant="contained"
              onClick={() => openModal(sendFriendshipRequested.bind(null, id, user.id, avatar, `${name} ${surname} wants to be your friend`))}
            >
              Add to friends
            </Button> 
          ) : <h2 className="your-friend">Your friend</h2>}
        </Person>
      )
    })

    if (this.props.location.pathname.split('/').pop() === 'friends') {
      return <Redirect to={`${match.url}/comrades`} />
    }

    return (
      <Fragment>
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator, flexContainer: classes.flexContainer }}
            >
              <Tab label="Friends" className={classes.tabRoot}
                onClick={() => {
                  history.push(`${match.url}/comrades`)
                  localStorage.setItem('searchUser', '')
                  fetchUserRequested(localStorage.getItem('searchUser'))
                }} />
              <Tab label="People" className={classes.tabRoot}
                onClick={() => {
                  history.push(`${match.url}/users`)
                  localStorage.setItem('searchUser', '')
                  fetchUserRequested(localStorage.getItem('searchUser'))
                }} />
            </Tabs>
        <Switch>
          <Route path={`${match.url}/comrades`}
            render={() => (
              <Fragment>
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                  className="search-input"
                    id="friends-search"
                    placeholder="Search…"
                    defaultValue={localStorage.getItem('searchUser')}
                    onChange={(e) => {
                      localStorage.setItem('searchUser', e.target.value.trim());
                      fetchUserRequested(localStorage.getItem('searchUser'))
                    }}
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
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
                <div className={classes.search}>
                  <div className={classes.searchIcon}>
                    <SearchIcon />
                  </div>
                  <InputBase
                  id="users-search"
                    placeholder="Search…"
                    defaultValue={localStorage.getItem('searchUser')}
                    className="search-input"
                    onChange={(e) => {
                      localStorage.setItem('searchUser', e.target.value.trim())
                      fetchUserRequested(localStorage.getItem('searchUser'))
                    }}
                    classes={{
                      root: classes.inputRoot,
                      input: classes.inputInput,
                    }}
                  />
                </div>
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

const customizedFriends = withStyles(styles)(Friends)

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
)(customizedFriends)
