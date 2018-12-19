import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import uuid from 'uuid'
import { withStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'

import { connect } from 'react-redux'
import { deletePostRequested, editPostRequested } from 'redux/modules/posts'
import { openModal } from 'redux/modules/modals'

const styles = {
  card: {
    minWidth: 275,
    marginBottom: 40,
    boxShadow: '0 2px 6px #cecece',
    position: 'relative'
  },
  button: {
    color: '#6d94be'
  }
};

function Post({ id, text, date, editPostRequested, deletePostRequested, openModal, classes }) {
  return (
    <Card id={id} className={classes.card}>
      <CardContent>
          <p className="post-text">{text}</p>
          <span className="post-date">{date}</span>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          className={classes.button}
          onClick={() => openModal(editPostRequested.bind(null, id, moment().format('YYYY-MM-DD HH:mm:ss')
            ), true, 'Send')}>
          Edit
        </Button>
        <Button
          size="small"
          className={classes.button}
          onClick={() => deletePostRequested(id)}>
          Remove
        </Button>
      </CardActions>
    </Card>
  )
}

Post.propTypes = {
  classes: PropTypes.object.isRequired,
};

const customizedPost = withStyles(styles)(Post);

/* const mapStateToProps = state => {
  return {
    userData: state.getIn(['global', 'userData']),
    posts: state.get('posts')
  }
} */

export default connect(
  null,
  {
    deletePostRequested,
    editPostRequested,
    openModal: (func, customModal, btnText) => openModal({
      id: uuid.v4(),
      btnText,
      customModal,
      onConfirm: (arg) => func(arg)
    })
  }
)(customizedPost)
