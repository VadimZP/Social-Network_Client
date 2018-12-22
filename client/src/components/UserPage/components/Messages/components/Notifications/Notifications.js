import React, { Component } from 'react'
import { connect } from 'react-redux'
import io from 'socket.io-client'
import uuid from 'uuid'
import Button from '@material-ui/core/Button'

import './Notifications.css'
import { acceptFriendshipRequested, rejectFriendshipRequested, getUserNotificationsRequested } from 'redux/modules/messages'

const socket = io('/')

class Notifications extends Component {
  state = {
    newNotifications: []
  }

  componentDidMount() {
    const { getUserNotificationsRequested, acceptFriendshipRequested, rejectFriendshipRequested, userId } = this.props

    getUserNotificationsRequested(userId)
    socket.on(
      userId,
      ({receiver_id, sender_id, avatar, text }) => {
        if (this.notificationsContainerEl !== null) {
          const notificationsContainerId = this.notificationsContainerEl.id

          const avatarBg = avatar && avatar[0] === '#' ?
            { backgroundColor: avatar } :
            { backgroundImage: `url(${avatar})` }

          if (notificationsContainerId === receiver_id) {
            const elem = (
              <li key={sender_id}>
                <div className="wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="avatar" style={{ ...avatarBg, width: 60, height: 60 }} />
                  {text}
                </div>
                <div className="button-wrapper">
                  <Button id={uuid.v4()} variant="contained" type="button" onClick={(e) => {
                    acceptFriendshipRequested(sender_id, userId)
                    this.setState(prevState => {
                      return { newNotifications: prevState.newNotifications.filter(item => item.id !== e.target.id) }
                    })
                  }}>Accept</Button>
                  <Button id={uuid.v4()} variant="contained" type="button" onClick={(e) => {
                    rejectFriendshipRequested(sender_id, userId)
                    console.log(e.currentTarget)
                    this.setState(prevState => {
                      return { newNotifications: prevState.newNotifications.filter(item => item.id !== e.target.id) }
                    })
                  }}>Reject</Button>
                </div>
              </li>
            )
            this.setState(prevState => {
              return { newNotifications: [ ...prevState.newNotifications, elem ] }
            })
          }
        }
      }
    )
  }

  render() {
    const { notifications, acceptFriendshipRequested, rejectFriendshipRequested, userId } = this.props

    return (
      <div className="notification-container" id={userId} ref={elem => (this.notificationsContainerEl = elem)}>
        <ul className="notifications">
          {notifications.toJS().map((item, i) => {

            const avatar = item.action_user_avatar
            const avatarBg = avatar[0] === '#' ?
              { backgroundColor: avatar } :
              { backgroundImage: `url(${avatar})` }

            return (
              <li key={item.sender_id}>
                <div className="wrapper" style={{ display: 'flex', alignItems: 'center' }}>
                  <div className="avatar" style={{...avatarBg, width: 60, height: 60 }} />
                  {item.text}
                </div>
                <div className="button-wrapper">
                  <Button variant="contained" type="button" onClick={() => acceptFriendshipRequested(item.action_user_id, userId)}>Accept</Button>
                  <Button variant="contained" type="button" onClick={() => rejectFriendshipRequested(item.action_user_id, userId)}>Reject</Button>
                </div>
              </li>
            )
          })}
          {this.state.newNotifications}
        </ul>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  notifications: state.getIn(['messages', 'notifications']),
  userId: state.getIn(['global', 'userData', 'id'])
})

export default connect(
  mapStateToProps,
  {
    acceptFriendshipRequested,
    rejectFriendshipRequested,
    getUserNotificationsRequested
  }
)(Notifications)
