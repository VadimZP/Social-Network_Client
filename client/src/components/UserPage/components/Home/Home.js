import React from 'react'
import PropTypes from 'prop-types'
import TextField from '@material-ui/core/TextField'
import { withStyles } from '@material-ui/core/styles'

import './Home.css'
import { connect } from 'react-redux'

const styles = theme => ({
  textField: {
    width: '100%',
    marginBottom: 20,
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
});

const Home = ({ location, userData, classes }) => {
  const anotherProfile = location.state
  const {
    name,
    surname,
    birth,
    gender,
    country,
    avatar
  } = anotherProfile || userData.toJS()
  
  const avatarBg = avatar[0] === '#' ? { backgroundColor: avatar } : { backgroundImage: `url(${avatar})` }
  return (
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
{/*       <ul className="info">
        <li className="age">

          <p>
            <span>Birthday: </span>
            {`${birth}`}
          </p>
        </li>
        <li className="gender">
          <p>
            <span>Gender: </span>
            {`${gender}`}
          </p>
        </li>
        <li className="location">
          <span>Location: </span>
          {`${country}`}
        </li>
      </ul> */}
    </header>
  )
}

const customizedHome = withStyles(styles)(Home)

const mapStateToProps = state => {
  return { userData: state.getIn(['global', 'userData']) }
}

export default connect(mapStateToProps)(customizedHome)
