import { combineReducers } from 'redux-immutable'

import global from './global'
import users from './users'
import friends from './friends'
import messages from './messages'
import posts from './posts'
import modals from './modals'

const rootReducer = combineReducers({
  global,
  users,
  friends,
  messages,
  posts,
  modals
})

export default rootReducer
