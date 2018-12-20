import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { withStyles } from '@material-ui/core/styles'

import './SignInForm.css'
import { userSignInRequested } from 'redux/modules/global'

const styles = theme => ({
  textField: {
    width: '100%',
  },
  select: {
    width: '100%',
    marginBottom: 40
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
})

class SignInForm extends Component {
  static propTypes = {
    isLogged: PropTypes.bool,
    userSignInRequested: PropTypes.func.isRequired
  }

  state = {
    email: '',
    password: '',
    emailErr: false,
    passErr: false
  }

  emailChange = (e) => this.setState({ email: e.target.value.trim() })

  passwordChange = (e) => this.setState({ password: e.target.value.replace(/[^A-Za-z0-9]+/g, '').trim() })

  signIn = () => {
    const { email, password } = this.state
    const { userSignInRequested } = this.props

    userSignInRequested(email, password)
  }

  render() {
    let isDisabled = false

    const {
      email,
      password,
      emailErr,
      passErr
    } = this.state

    const { isLogged, classes } = this.props

    if (!email || (!password || password.length < 6)) {
      isDisabled = true
    }
    if (emailErr) {
      isDisabled = true
    }

    return (
      <form className="form-sign-in">
        <TextField
              error={emailErr}
              label={emailErr ? "Empty or incorrect email" : "Email"}
              type="email"
              autoComplete="new-password"
              style={{marginTop: 0}}
              className={classes.textField}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel,
                  focused: classes.cssFocused,
                },
              }}
              InputProps={{
                classes: {
                  focused: classes.cssFocused,
                  underline: classes.cssUnderline,
                },
              }}
              value={email}
              onChange={this.emailChange}
              onBlur={() => {
                const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
                if (!email || !email.match(emailFormat)) {
                  this.setState({ emailErr: true })
                  return
                }
                this.setState({ emailErr: false })
              }}
              margin="normal"
            />
          <TextField
              error={passErr}
              label={passErr ? "Empty or too short password" : "Password"}
              className={classes.textField}
              InputLabelProps={{
                classes: {
                  root: classes.cssLabel,
                  focused: classes.cssFocused,
                },
              }}
              InputProps={{
                classes: {
                  focused: classes.cssFocused,
                  underline: classes.cssUnderline,
                },
              }}
              type="password"
              onChange={this.passwordChange}
              onBlur={() => {
                if (password.length < 6) {
                  this.setState({ passErr: true })
                  return
                }
                this.setState({ passErr: false })
              }}
              margin="normal"
            />
        <Button
          variant="contained"
          type="button"
          style={{ width: 150, margin: '40px auto 0' }}
          onClick={this.signIn}
          disabled={isDisabled}
        >
          Sign In
        </Button>
        {isLogged === false && <h2 style={{ textAlign: 'center', marginTop: 50 }}>Incorrect username or password.</h2>}
      </form>
    )
  }
}

SignInForm.defaultProps = {
  isLogged: null
}

const customizedSignInForm = withStyles(styles)(SignInForm)

const mapStateAppToProps = state => ({
  isLogged: state.getIn(['global', 'isLogged'])
})

export default withRouter(
  connect(
    mapStateAppToProps,
    {
      userSignInRequested
    }
  )(customizedSignInForm)
)
