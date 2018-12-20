import React, { Component } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router'
import { connect } from 'react-redux'
import io from 'socket.io-client'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Badge from '@material-ui/core/Badge'

import { getFriendsRequested } from 'redux/modules/friends'
import { getUserNotificationsRequested } from 'redux/modules/messages'

import './UserPage.css'

import Home from './components/Home/Home'
import Settings from './components/Settings/Settings'
import Friends from './components/Friends/Friends'
import Messages from './components/Messages/Messages'

const socket = io('/')

class UserPage extends Component {
  state = {
    unreadMessage: +localStorage.getItem('messageCounter') || 0,
    unreadNotification: +localStorage.getItem('notificationCounter') || 0
  }

  componentDidMount() {
    const { userId, getUserNotificationsRequested, getFriendsRequested } = this.props

    getUserNotificationsRequested(userId)
    getFriendsRequested(userId)

    socket.on(
      userId,
      ({ type, receiver_id }) => {
        if (userId === receiver_id && type === 'message' && this.props.location.pathname.split('/').pop() !== 'conversations') {
          this.setState(prevState => ({ unreadMessage: prevState.unreadMessage + 1 }), () => {
            localStorage.setItem('messageCounter', this.state.unreadMessage)
          })
        }
        if (userId === receiver_id && type === 'notification' && this.props.location.pathname.split('/').pop() !== 'notifications') {
          this.setState(prevState => ({ unreadNotification: prevState.unreadNotification + 1 }), () => {
            localStorage.setItem('notificationCounter', this.state.unreadNotification)
          })
        }
      }
    )
  }

  logOut = () => {
    localStorage.clear()
    window.location.reload()
  }

  render() {
    const { location, match } = this.props
    const { unreadMessage, unreadNotification } = this.state

    if (location.pathname === match.url) {
      return <Redirect to={`${match.url}/home`} />
    }

    return (
      <div className="page-wrapper">
        <aside className="navigation">
          <ul>
            <NavLink className="nav-link" activeClassName="active-link" to={`${match.url}/home`}>
              <ListItem className="listItem" style={{borderTopLeftRadius: 5}} button>
                <div className="the-icons span3">
                  <i className="fontello-icon icon-home" />
                </div>
                <ListItemText className="list-item-text" primary="Home" />
              </ListItem>
            </NavLink>
            <NavLink className="nav-link" activeClassName="active-link" to={`${match.url}/messages`} onClick={() => this.setState({ unreadMessage: 0 }, () => localStorage.setItem('messageCounter', 0))}>
              <ListItem className="listItem" button>
                <div className="the-icons span3">
                  <i className="fontello-icon icon-mail-alt" />
                  {(unreadMessage !== 0 || unreadNotification !== 0) && <Badge badgeContent={unreadMessage + unreadNotification} style={{ position: 'absolute', fontSize: 12, left: 17, }} color="secondary" />}
                </div>
                <ListItemText className="list-item-text" primary="Messages" />
              </ListItem>
            </NavLink>
            <NavLink className="nav-link" activeClassName="active-link" to={`${match.url}/friends`}>
              <ListItem className="listItem" button>
                <div className="the-icons span3">
                  <i className="fontello-icon icon-users" />
                </div>
                <ListItemText className="list-item-text" primary="Friends" />
              </ListItem>
            </NavLink>
            <NavLink className="nav-link" activeClassName="active-link"  to={`${match.url}/settings`} activeClassName="active-link">
               <ListItem className="listItem" button>
               <div className="the-icons span3">
                <i className="fontello-icon icon-cog" />
              </div>
                <ListItemText className="list-item-text" primary="Settings" />
              </ListItem>
            </NavLink>
          </ul>
          <ListItem button className="btn-submit-logout" onClick={this.logOut}>
            <div className="the-icons span3">
              <i className="fontello-icon icon-logout" />
            </div>
            <ListItemText className="list-item-text" primary="Log out" />
          </ListItem>
        </aside>
        <div className="content-container" onScroll={this.handleScroll}>
          <Switch>
            <Route path={`${match.url}/home`} component={Home} />
            <Route path={`${match.url}/friends`} component={Friends} />
            <Route path={`${match.url}/settings`} component={Settings} />
            <Route
              path={`${match.url}/messages`}
              render={routeProps => <Messages onClick={() => this.setState({ unreadNotification: 0 }, () => localStorage.setItem('notificationCounter', 0))} {...routeProps} />}
            />
            <Route
              path={`${match.url}/profile-of-:email`}
              render={routeProps => <Home {...routeProps} />}
            />
          </Switch>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    userId: state.getIn(['global', 'userData', 'id']),
    notifications: state.getIn(['messages', 'notifications']),
    conversations: state.getIn(['messages', 'conversations'])
  }
}

export default connect(
  mapStateToProps,
  {
    getUserNotificationsRequested,
    getFriendsRequested
  }
)(UserPage)
