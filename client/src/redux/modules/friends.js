import { fromJS } from 'immutable'
import { call, put } from 'redux-saga/effects'
import io from 'socket.io-client'

import { getFriendsRequest, postFriendshipRequest, deleteFriendRequest } from 'utils/api'

const socket = io('/')

// Actions
export const types = {
  GET_FRIENDS_REQUESTED: 'social-network/friends/GET_FRIENDS_REQUESTED',
  GET_FRIENDS_SUCCEED: 'social-network/friends/GET_FRIENDS_SUCCEED',
  GET_FRIENDS_FAILED: 'social-network/friends/GET_FRIENDS_FAILED',
  SEND_FRIENDSHIP_REQUESTED: 'social-network/friends/SEND_FRIENDSHIP_REQUESTED',
  SEND_FRIENDSHIP_SUCCEED: 'social-network/friends/SEND_FRIENDSHIP_SUCCEED',
  SEND_FRIENDSHIP_FAILED: 'social-network/friends/SEND_FRIENDSHIP_FAILED',
  REMOVE_FRIEND_REQUESTED: 'social-network/friends/REMOVE_FRIEND_REQUESTED',
  REMOVE_FRIEND_SUCCEED: 'social-network/friends/REMOVE_FRIEND_SUCCEED',
  REMOVE_FRIEND_FAILED: 'social-network/friends/REMOVE_FRIEND_FAILED'
}

// Action Creators
export function getFriendsRequested(id) {
  return { type: types.GET_FRIENDS_REQUESTED, id }
}

export function getFriendsSucceed(friends) {
  return { type: types.GET_FRIENDS_SUCCEED, friends }
}

export function getFriendsFailed() {
  return { type: types.GET_FRIENDS_FAILED }
}

export function sendFriendshipRequested( sender_id, receiver_id, avatar, text) {
  socket.emit('appendNotification', { sender_id, receiver_id, avatar, text })
  return { type: types.SEND_FRIENDSHIP_REQUESTED, sender_id, receiver_id, avatar, text }
}

export function sendFriendshipSucceed() {
  return { type: types.SEND_FRIENDSHIP_SUCCEED }
}

export function sendFriendshipFailed() {
  return { type: types.SEND_FRIENDSHIP_FAILED }
}

export function removeFriendRequested(friendId, userId) {
  return { type: types.REMOVE_FRIEND_REQUESTED, friendId, userId }
}

export function removeFriendSucceed(friendId) {
  return { type: types.REMOVE_FRIEND_SUCCEED, friendId }
}

export function removeFriendFailed() {
  return { type: types.REMOVE_FRIEND_FAILED }
}

const initialState = fromJS([])

export default function friends(state = initialState, action) {
  switch (action.type) {
    case types.GET_FRIENDS_REQUESTED:
      return state
    case types.GET_FRIENDS_SUCCEED:
      return fromJS([...action.friends])
    case types.GET_FRIENDS_FAILED:
      return state
    case types.SEND_FRIENDSHIP_REQUESTED:
      return state
    case types.SEND_FRIENDSHIP_SUCCEED:
      return state
    case types.SEND_FRIENDSHIP_FAILED:
      return state
    case types.REMOVE_FRIEND_REQUESTED:
      return state
    case types.REMOVE_FRIEND_SUCCEED:
      return state.filter(item => item.get('id') != action.friendId)
    case types.REMOVE_FRIEND_FAILED:
      return state
    default:
      return state
  }
}

// Sagas
export function* fetchFriends(action) {
  try {
    const result = yield call(getFriendsRequest, action.id)
    const friends = yield result.json()

    yield put(getFriendsSucceed(friends))
  } catch (error) {
    yield put(getFriendsFailed())
  }
}

export function* postFriendship(action) {
  try {
    const result = yield call(postFriendshipRequest, action.receiver_id, action.sender_id, action.avatar, action.text)

    yield put(sendFriendshipSucceed())
  } catch (error) {
    yield put(sendFriendshipFailed())
  }
}

export function* deleteFriend(action) {
  try {
    const result = yield call(deleteFriendRequest, action.friendId, action.userId)
    const response = yield result.json()

    yield put(removeFriendSucceed(action.friendId))
  } catch (error) {
    yield put(removeFriendFailed())
  }
}
