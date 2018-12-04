import React, { Component } from 'react'
import { connect } from 'react-redux'
import openSocket from 'socket.io-client'

import './Notifications.css'
import { acceptFriendshipRequested, rejectFriendshipRequested, getUserNotificationsRequested } from 'redux/modules/messages'

const socket = openSocket('http://192.168.1.100:8000')

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
                <div className="avatar" style={{...avatarBg, width: 60, height: 60 }} />
                {text}
                <button type="button" onClick={() => acceptFriendshipRequested(sender_id, userId)}>Accept</button>
                <button type="button" onClick={() => rejectFriendshipRequested(sender_id, userId)}>Reject</button>
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
                <div className="avatar" style={{...avatarBg, width: 60, height: 60 }} />
                {item.text}
                <button type="button" onClick={() => acceptFriendshipRequested(item.action_user_id, userId)}>Accept</button>
                <button type="button" onClick={() => rejectFriendshipRequested(item.action_user_id, userId)}>Reject</button>
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
