import React, { Component, Fragment } from 'react'
import { Redirect } from 'react-router-dom'
import { Switch, Route } from 'react-router'
import { connect } from 'react-redux'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Badge from '@material-ui/core/Badge'
import { withStyles } from '@material-ui/core/styles'

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
  }
})

class Messages extends Component {
  state = {
    dialogContent: [],
    value: 0,
    unreadNotification: +localStorage.getItem('notificationCounter') || 0
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
      interlocutorId,
      unreadNotification
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
              classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator, flexContainer: classes.flexContainer }}
            >
              <Tab label="Conversations" className={classes.tabRoot}
                onClick={() => {
                  history.push(`${match.url}/conversations`)
                  this.props.onClick
                }} />
                {/* {(unreadNotification !== 0) &&  <Badge badgeContent={unreadNotification} style={{ position: 'absolute', fontSize: 12, left: 17, }} color="secondary" />} */}
              <Tab 
                icon={(unreadNotification !== 0) &&  <Badge badgeContent={unreadNotification} style={{ position: 'absolute', fontSize: 12, left: 17, }} color="secondary" />} 
                label="Notifications"
                className={classes.tabRoot}
                onClick={() => {
                  this.props.onClick()
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
