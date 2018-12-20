import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Input from '@material-ui/core/Input'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import './RegisterForm.css'
import Utils from 'utils/Utils'
import * as Countries from 'iso-3166-1-alpha-2'
import { userRegistrationRequested } from 'redux/modules/global'
import RegisterResult from './components/RegisterResult/RegisterResult'

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
  cssRadio: {
    color: '#34495E',
    '&$checked': {
      color: '#34495E',
    },
  }
})

class RegisterForm extends Component {
  static propTypes = {
    registrationRequestWasMade: PropTypes.bool,
    userRegistrationRequested: PropTypes.func.isRequired,
  }

  state = {
    userData: {
      email: '',
      password: '',
      name: '',
      surname: '',
      gender: 'male',
      birth: {
        day: 1,
        month: 'January',
        year: new Date().getFullYear()
      },
      country: 'Afghanistan',
      avatar: `#${Math.random().toString(16).slice(2, 8)}`
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.registerSuccess !== prevState.registerSuccess || nextProps.registrationRequestWasMade !== prevState.registrationRequestWasMade) {
      return {
        registerSuccess: nextProps.registerSuccess,
        isLoading: nextProps.registrationRequestWasMade
      }
    }
    return { isLoading: false }
  }

  emailChange = e => {
    e.persist()
    this.setState(prevState => ({
      userData: { ...prevState.userData, email: e.target.value.trim() }
    }))
  }

  passwordChange = e => {
    e.persist()
    this.setState(prevState => ({
      userData: { ...prevState.userData, password: e.target.value.replace(/[^A-Za-z0-9]+/g, '').trim() }
    }))
  }

  nameChange = e => {
    let name = e.target.value
    if (e.target.value) {
      name = e.target.value[0].toUpperCase() +
      e.target.value.slice(1).toLowerCase()
    }
    e.persist()
    this.setState(prevState => ({
      userData: {
        ...prevState.userData,
        name: name.replace(/[^A-Za-z]+/g, '').trim()
      }
    }))
  }

  surnameChange = e => {
    let surname = e.target.value
    if (e.target.value) {
      surname = e.target.value[0].toUpperCase() +
      e.target.value.slice(1).toLowerCase()
    }
    e.persist()
    this.setState(prevState => ({
      userData: { ...prevState.userData, surname: surname.replace(/[^A-Za-z]+/g, '').trim() }
    }))
  }

  genderChange = e => {
    e.persist()
    this.setState(prevState => ({
      userData: { ...prevState.userData, gender: e.target.value }
    }))
  }

  birthChange = (arg, e) => {
    e.persist()
    this.setState(prevState => ({
      userData: {
        ...prevState.userData,
        birth: { ...prevState.userData.birth, [arg]: e.target.value }
      }
    }))
  }

  countryChange = e => {
    e.persist()
    const country = Utils.getCountries().find(item => item.alpha2Code === e.target.value)
    this.setState(prevState => ({
      userData: { ...prevState.userData, country: country.name }
    }))
  }


  registerUser = () => {
    const { userRegistrationRequested } = this.props

    this.setState({ isLoading: true, registrationRequest: true })
    userRegistrationRequested(this.state.userData)
  }

  render() {
    let isDisabled = false

    const { classes } = this.props

    const {
      email,
      password,
      name,
      surname,
      gender,
      country
    } = this.state.userData

    const {
      emailErr,
      passErr,
      registrationRequest,
      registerSuccess,
      isLoading
    } = this.state

    if (!email ||
      (!password || password.length < 6) ||
      (!name || name.length < 2) ||
      (!surname || surname.length < 2)
    ) {
      isDisabled = true
    }
    if (emailErr) {
      isDisabled = true
    }

    return (
      <Fragment>
        <form className="form-register">
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
          <TextField
                label="Name"
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
                value={name}
                onChange={this.nameChange}
                margin="normal"
              />
          <TextField
              label="Surname"
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
              value={surname}
              onChange={this.surnameChange}
              margin="normal"
            />
          <div className="gender-radio-wrapper">
          <span class="gender-pseudo-label">Gender</span>
          <FormControlLabel
                value="male"
                style={{ margin: 0 }}
                control={
                  <Radio
                    name="gender"
                    checked={gender === 'male' && true}
                    onChange={this.genderChange}
                    color="default"
                    classes={{
                      root: classes.cssRadio,
                    }}
                  />
                }
                label="Male"
                labelPlacement="start"
              />
              <FormControlLabel
                value="female"
                control={
                <Radio 
                  name="gender"
                  color="default"
                  checked={gender === 'female' && true}
                  onChange={this.genderChange} 
                  classes={{
                    root: classes.cssRadio,
                  }}
                />}
                label="Female"
                labelPlacement="start"
              />
              </div>
              <div className="birth-select-wrapper">
                <span class="birth-pseudo-label">Birth</span>
                <Select
                  name="day"
                  value={this.state.userData.birth.day}
                  style={{ width: 'calc(33.3% - 20px)', marginRight: 20 }}
                  onChange={this.birthChange.bind(this, 'day')}
                  input={<Input classes={{
                    focused: classes.cssFocused,
                    underline: classes.cssUnderline,
                  }} />}
                >
                  {Utils.getDays().map(d => (
                    <MenuItem value={d}>{d}</MenuItem>
                  ))}
                </Select>
                <Select
                  name="month"
                  value={this.state.userData.birth.month}
                  style={{ width: 'calc(33.3% - 20px)', marginRight: 20 }}
                  onChange={this.birthChange.bind(this, 'month')}
                  input={<Input classes={{
                    focused: classes.cssFocused,
                    underline: classes.cssUnderline,
                  }} />}
                >
                  {Utils.getMonths().map(m => (
                    <MenuItem value={m}>{m}</MenuItem>
                  ))}
                </Select>
                <Select
                name="years"
                value={this.state.userData.birth.year}
                style={{width: 'calc(33.3% - 20px)', marginLeft: 20}}
                onChange={this.birthChange.bind(this, 'year')}
                input={<Input classes={{
                  focused: classes.cssFocused,
                  underline: classes.cssUnderline,
                }} />}
              >
                  {Utils.getYears().map(y => (
                    <MenuItem value={y}>{y}</MenuItem>
                  ))}
                </Select>
                </div>
                <div className="location-select-wrapper">
                <span class="location-pseudo-label">Location</span>
                <Select
                  name="countries"
                  className={classes.select}
                  value={Countries.getCode(country)}
                  onChange={this.countryChange}
                  input={<Input classes={{
                    focused: classes.cssFocused,
                    underline: classes.cssUnderline,
                  }} />}
                >
                  {Utils.getCountries().map(item => (
                    <MenuItem value={item.alpha2Code}>{item.name}</MenuItem>
                  ))}
                </Select>
                </div>
          <Button
            variant="contained"
            type="button"
            style={{ width: 150, margin: 'auto' }}
            onClick={this.registerUser}
            disabled={isDisabled}
          >
            Register
          </Button>
        </form>
        {registrationRequest && (
          <RegisterResult registerSuccess={registerSuccess} isLoading={isLoading} />
        )}
      </Fragment>
    )
  }
}

RegisterForm.defaultProps = {
  registrationRequestWasMade: false
}

const customizedRegisterForm = withStyles(styles)(RegisterForm)

const mapStateAppToProps = state => ({
  registrationRequestWasMade: state.getIn(['global', 'registrationRequestWasMade']),
  registerSuccess: state.getIn(['global', 'registerSuccess'])
})

export default withRouter(
  connect(
    mapStateAppToProps,
    {
      userRegistrationRequested
    }
  )(customizedRegisterForm)
)
