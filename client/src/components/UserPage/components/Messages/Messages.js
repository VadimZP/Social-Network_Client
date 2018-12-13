import React, { Component, Fragment } from 'react'
import { NavLink, Redirect } from 'react-router-dom'
import { Switch, Route } from 'react-router'
import { connect } from 'react-redux'
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
import PropTypes from 'prop-types'

import { getUserMsgsRequested } from 'redux/modules/messages'
import { getUsersRequested } from 'redux/modules/users'
import './Messages.css'
import Conversations from './components/Conversations/Conversations'
import Notifications from './components/Notifications/Notifications'

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
    overflow: 'initial'
  },
  tabsIndicator: {
    backgroundColor: '#34495E',
    height: 4,
  },
})

class Messages extends Component {
  state = {
    dialogContent: [],
    value: 0,
  }

  componentDidMount() {
    const { userData, getUserMsgsRequested } = this.props
    getUserMsgsRequested(userData.get('id'))
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.conversations !== prevState.conversations) {
      const avatars = {}
      
      nextProps.friendsAvatars.forEach(item => {
        avatars[item.get('id')] = item.get('avatar')
      })

      let conversationsList = nextProps.conversations.toJS()
      const obj = {}

      for (let i = 0; i < conversationsList.length;) {
        const id = conversationsList[0].sender_id === nextProps.userData.get('id') ? conversationsList[0].receiver_id : conversationsList[0].sender_id

        obj[id] = conversationsList.filter(el => el.sender_id === id || el.receiver_id === id)
        conversationsList = conversationsList.filter(el => el.sender_id !== id && el.receiver_id !== id)
      }

      return {
        avatars,
        fullMessageHistory: obj
      }
    }
    return null
  }

  getDialogWithId = id => {
    this.setState(previousState => ({
      dialogContent: previousState.fullMessageHistory[id],
      interlocutorId: id
    }))
  }

  handleChange = (event, value) => {
    this.setState({ value })
  }

  render() {
    const { match, location, history, classes } = this.props

    const {
      fullMessageHistory,
      dialogContent,
      avatars,
      interlocutorId
    } = this.state

    let keys
    let opts
    let msgs

    if (fullMessageHistory) {
      keys = Object.keys(fullMessageHistory)
      opts = Object.keys(fullMessageHistory).map(
        key => fullMessageHistory[key]
      )
    }

    if (location.pathname.split('/').pop() === 'messages') {
      return <Redirect to={`${match.url}/conversations`} />
    }

    return (
      <Fragment>
          <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
            >
              <Tab label="Conversations"
                onClick={() => {
                  history.push(`${match.url}/conversations`)
                  this.props.onClick
                }} />
              <Tab label="Notifications"
                onClick={() => {
                  history.push(`${match.url}/notifications`)
                  this.props.onClick
                }} />
            </Tabs>
        <div className="flex-container">
          <Switch>
            <Route path={`${match.url}/notifications`} component={Notifications} />
            <Route
              path={`${match.url}/conversations`}
              render={() => (
                <Conversations
                  dialogContent={dialogContent}
                  interlocutorId={interlocutorId}
                  msgs={msgs}
                  getDialogWithId={this.getDialogWithId}
                  userId={this.props.userData.get('id')}
                  avatars={avatars}
                  opts={opts}
                  keys={keys}
                />
              )}
            />
          </Switch>
        </div>
      </Fragment>
    )
  }
}

const customizedMessages = withStyles(styles)(Messages)

const mapStateToProps = state => ({
  userData: state.getIn(['global', 'userData']),
  conversations: state.getIn(['messages', 'conversations']),
  friendsAvatars: state.get('friends')
})

export default connect(
  mapStateToProps,
  {
    getUserMsgsRequested,
    getUsersRequested
  }
)(customizedMessages)
