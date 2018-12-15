import React, { Component } from 'react'
import Input from '@material-ui/core/Input'
import TextField from '@material-ui/core/TextField'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Radio from '@material-ui/core/Radio'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'

import './Settings.css'
import Utils from 'utils/Utils'
import * as Countries from 'iso-3166-1-alpha-2'
import { changeSettingsRequested, uploadAvatarRequested } from 'redux/modules/global'


const styles = theme => ({
  textField: {
    width: '100%',
    marginBottom: 20,
  },
  select: {
    width: '100%',
    marginBottom: 60
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

class Settings extends Component {
  state = {
    userData: {
      id: this.props.userData.get('id'),
      email: this.props.userData.get('email'),
      password: '',
      name: this.props.userData.get('name'),
      surname: this.props.userData.get('surname'),
      gender: this.props.userData.get('gender'),
      country: this.props.userData.get('country'),
      birth: {
        day: this.props.userData.get('birth').split(' ')[0],
        month: this.props.userData.get('birth').split(' ')[1],
        year: this.props.userData.get('birth').split(' ')[2]
      }
    }
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

  uploadAvatar = e => {
    const { uploadAvatarRequested } = this.props
    const { id } = this.state.userData
    const data = new FormData()

    data.append('userId', id)
    data.append('file', e.target.files[0])

    uploadAvatarRequested(data)
  }

  importAvatar = () => {
    document.getElementById('selectedFile').click()
  }

  submitSettingsChanges = () => {
    const { password } = this.state.userData
    const { changeSettingsRequested } = this.props

    if (password) {
      if (password.length < 6) {
        this.setState({ passErr: true })
        return
      }

      this.setState({ passErr: false })
    }
    changeSettingsRequested(this.state.userData)
  }

  render() {
    let isDisabled = false

    const {
      name,
      surname,
      password,
      email,
      gender,
      birth,
      country
    } = this.state.userData

    const {
      emailErr,
      passErr
    } = this.state

    const { classes } = this.props

    if (!email ||
      (!name || name.length < 2) ||
      (!surname || surname.length < 2)
    ) {
      isDisabled = true
    }
    if (emailErr || passErr) {
      isDisabled = true
    }

    const avatar = this.props.userData.get('avatar')
    const avatarBg = avatar[0] === '#' ? { backgroundColor: avatar } : { backgroundImage: `url(${avatar})` }
    return (
      <div className="settings">
        <div
          className="avatar"
          style={avatarBg}
        >
          <div className="change-avatar">
            <input
              type="file"
              id="selectedFile"
              onChange={this.uploadAvatar}
              style={{ display: 'none' }}
            />
            <button type="button" onClick={this.importAvatar} />
          </div>
        </div>
        <div className="user-data">
          <div className="column item-1">
              <TextField
                id="standard-name"
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
              id="standard-name"
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
            {emailErr && <p style={{ color: 'red', fontSize: 13, paddingTop: 5 }}>Empty or incorrect input</p>}
            <TextField
              id="inputEmail"
              type="email"
              label="Email"
              autoComplete="new-password"
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
            {passErr && <p style={{ color: 'red', fontSize: 13, paddingTop: 5 }}>Empty or too short input</p>}
            <TextField
              id="inputPassword"
              label="Password"
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
                if (!password.length) {
                  this.setState({ passErr: false })
                  return
                }
                this.setState({ passErr: false })
              }}
              margin="normal"
            />
          </div>
          <div className="column item-2">
            <div className="select-wrapper">
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
              <div className="birth-select-wrapper">
                <span class="birth-pseudo-label">Birth</span>
                <Select
                  name="day"
                  value={birth.day}
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
                  value={birth.month}
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
                value={birth.year}
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
            </div>
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
          </div>
        </div>
        <Button
          type="button"
          variant="contained"
          className="btn-submit-settings"
          style={isDisabled ? { background: '#f1f1f1' } : {}}
          onClick={this.submitSettingsChanges}
          disabled={isDisabled}
        >
          Save changes
        </Button>
      </div>
    )
  }
}

const customizedSettings = withStyles(styles)(Settings)

const mapStateToProps = state => ({
  userData: state.getIn(['global', 'userData'])
})

export default connect(
  mapStateToProps,
  {
    changeSettingsRequested,
    uploadAvatarRequested
  }
)(customizedSettings)
