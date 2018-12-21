import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import { connect } from 'react-redux'
import io from 'socket.io-client'
import uuid from 'uuid'
import moment from 'moment'
import SendIcon from '@material-ui/icons/Send'

import { sendMessageRequested } from 'redux/modules/messages'
import Dialog from '../Dialog/Dialog'

const socket = io('/')

class DialogContainer extends Component {
  static propTypes = {
    children: PropTypes.instanceOf(Array).isRequired,
    interlocutorId: PropTypes.string.isRequired,
    sendMessageRequested: PropTypes.func.isRequired,
    userData: ImmutablePropTypes.contains(
      ImmutablePropTypes.contains({
        id: PropTypes.number,
        email: PropTypes.string,
        password: PropTypes.string,
        name: PropTypes.string,
        surname: PropTypes.string,
        gender: PropTypes.string,
        birth: PropTypes.string,
        avatar: PropTypes.string
      }).isRequired
    ).isRequired
  }

  state = {
    message: '',
    obj: {} 
  }

  componentDidMount() {
    socket.on(
      this.props.userData.get('id'),
      ({ type, receiver_id, sender_id, text, sender_name, sender_surname, date }) => {
        console.log(type)
        if (this.dialogContainerEl !== null) {
          const dialogContainerId = this.dialogContainerEl.id

          if (dialogContainerId === sender_id || dialogContainerId === receiver_id) {
            const elem = (
              <Dialog
                key={uuid.v4()}
                text={text}
                sender_id={sender_id}
                receiver_id={receiver_id}
                sender_name={sender_name}
                sender_surname={sender_surname}
                date={date}
              />
            )
             
            this.setState(prevState => {
              return prevState.obj[dialogContainerId] ? 
                { obj: { ...prevState.obj, [dialogContainerId]: [...prevState.obj[dialogContainerId], elem] } } :
                { obj: { ...prevState.obj, [dialogContainerId]: [elem] } }
            })
          }
        }
      }
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.interlocutorId !== this.props.interlocutorId) {
      this.setState({obj: {}, notFriend: false})
    }
    if (this.state.obj !== prevState.obj) {
      this.dialogContainerEl.scrollTop = this.dialogContainerEl.scrollHeight
    }
  }

  writeMessage = e => {
    this.setState({ message: e.target.innerText })
  }

  sendMessage = () => {
    const { interlocutorId, sendMessageRequested, friends } = this.props
    const { id, name, surname, avatar } = this.props.userData.toJS()
    const { message } = this.state
    const currentDate = moment().format('YYYY-MM-DD HH:mm:ss')

    this.setState({ message: '' })

    if (!friends.toJS().find(user => user.id === interlocutorId)) {
      this.setState({ notFriend: 'This user is not your friend' })
      return
    }
    sendMessageRequested(interlocutorId, id, name, surname, avatar, currentDate, message)
  }

  render() {
    const { children, interlocutorId, classes } = this.props
    const { obj, notFriend } = this.state

    return (
      <div
        className="dialog-container"
        id={interlocutorId}
        ref={elem => { this.dialogContainerEl = elem }}
      >
        {children}
        {obj[interlocutorId]}
        {notFriend && <p className="dialog-message" style={{ fontWeight: 'bold', color: '#b22c35' }}>{notFriend}</p>}
        <div className="message-bar">
          <button
            type="button"
            className="btn-submit-message"
            style={{ cursor: 'pointer' }}
            onClick={e => {
              this.sendMessage()
              this.textBox.innerText = ''
            }}
          >
            <SendIcon color="primary" className="sendIcon"/* {classes.sendIcon} */ />
          </button>
          <div
            role="textbox"
            ref={elem => { this.textBox = elem }}
            tabIndex={0}
            onKeyDown={e => {
              if (e.keyCode === 13) {
                e.preventDefault()
                this.sendMessage()
                this.textBox.innerText = ''
              }
            }}
            contentEditable
            style={{
              padding: '15px',
              width: '100%',
              textAlign: 'left',
              outline: 'none'
            }}
            onInput={e => this.writeMessage(e)}
          />
        </div>
      </div>
    )
  }
}



const mapStateToProps = state => ({
  userData: state.getIn(['global', 'userData']),
  friends: state.get('friends')
})

export default connect(
  mapStateToProps,
  {
    sendMessageRequested
  }
)(DialogContainer)
