import React, { Fragment, Component } from 'react'
import PropTypes from 'prop-types'
import { fromJS } from 'immutable'
import moment from 'moment'
import uuid from 'uuid'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CreateIcon from '@material-ui/icons/Create';
import { withStyles } from '@material-ui/core/styles'

import './Home.css'
import { getPostsRequested, getPostRequested, addPostRequested } from 'redux/modules/posts'
import { openModal } from 'redux/modules/modals'
import { connect } from 'react-redux'
import Post from './components/Post'

const styles = theme => ({
  textField: {
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    border: '1px solid #e8e8e8',
    marginBottom: 20,
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  cssLabel: {
    '&$cssFocused': {
      color: '#34495E',
    },
  },
  cssFocused: {},
  cssUnderline: {
    '&:before': {
      borderBottomColor: '#cdcdcd',
    },
    '&:after': {
      borderBottomColor: '#34495E',
    },
  },
  createIcon: {
    color: '#6D94BE'
  }
});

class Home extends Component {

  componentDidUpdate(prevProps, prevState) {
    const { userData, getPostsRequested } = this.props

    if(this.props.location.state !== prevProps.location.state) {
      getPostsRequested(userData.get('id'))
    }
  }

  componentDidMount() {
    const { userData, getPostsRequested, location } = this.props

    const anotherProfile = location.state

    const { id } = anotherProfile || userData.toJS()

    getPostsRequested(id)
  }

  render() {
    const { posts, userData, location, classes, openModal, addPostRequested } = this.props

    const anotherProfile = location.state

    const {
      id,
      name,
      surname,
      birth,
      gender,
      country,
      avatar
    } = anotherProfile || userData.toJS()

    const avatarBg = avatar[0] === '#' ? { backgroundColor: avatar } : { backgroundImage: `url(${avatar})` }

    return (
      <div className="flex-container">
        <header className="profile-header">
          <div className="avatar" style={avatarBg} />
          <div className="name-surname">
            {`${name} ${surname}`}
          </div>
          <TextField
            id="standard-read-only-input"
            label="Birth"
            defaultValue={birth}
            className={classes.textField}
            margin="normal"
            InputLabelProps={{
              classes: {
                root: classes.cssLabel,
                focused: classes.cssFocused,
              },
            }}
            InputProps={{
              readOnly: true,
              classes: {
                focused: classes.cssFocused,
                underline: classes.cssUnderline,
              },
            }}
          />
          <TextField
            id="standard-read-only-input"
            label="Gender"
            defaultValue={gender}
            className={classes.textField}
            margin="normal"
            InputLabelProps={{
              classes: {
                root: classes.cssLabel,
                focused: classes.cssFocused,
              },
            }}
            InputProps={{
              readOnly: true,
              classes: {
                focused: classes.cssFocused,
                underline: classes.cssUnderline,
              },
            }}
          />
          <TextField
            id="standard-read-only-input"
            label="Country"
            defaultValue={country}
            className={classes.textField}
            margin="normal"
            InputLabelProps={{
              classes: {
                root: classes.cssLabel,
                focused: classes.cssFocused,
              },
            }}
            InputProps={{
              readOnly: true,
              classes: {
                focused: classes.cssFocused,
                underline: classes.cssUnderline,
              },
            }}
          />
        </header>
        <section id="posts">
          {this.props.location.pathname.indexOf('profile-of') !== -1 || (
            <Button
              type="button"
              className={classes.button}
              onClick={() => openModal(addPostRequested.bind(null, id, moment().format('YYYY-MM-DD HH:mm:ss')
              ), true, 'Send')}
            >
              Write a post...
              <CreateIcon color="primary" className={classes.createIcon} />
            </Button>
        )}
          <ul className="post-list">
            {posts.toJS().map(item => {
              return <Post key={uuid.v4()} id={item.id} text={item.text} date={item.date} location={this.props.location} />
            })}
          </ul>
        </section>
      </div>
    )
  }
}

const customizedHome = withStyles(styles)(Home)

const mapStateToProps = state => {
  return {
    userData: state.getIn(['global', 'userData']),
    posts: state.get('posts')
  }
}

export default connect(
  mapStateToProps,
  {
    getPostsRequested,
    getPostRequested,
    addPostRequested,
    openModal: (func, customModal, btnText) => openModal({
      id: uuid.v4(),
      btnText,
      customModal,
      onConfirm: (arg) => func(arg)
    })
  }
)(customizedHome)
