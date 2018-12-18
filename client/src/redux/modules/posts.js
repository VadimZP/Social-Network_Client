import { fromJS } from 'immutable'
import { call, put } from 'redux-saga/effects'
import io from 'socket.io-client'

import {
  getPostsRequest,
  getPostRequest,
  addPostRequest,
  deletePostRequest,
  editPostRequest
} from 'utils/api'

// const socket = io('/')

// Actions
export const types = {
  GET_POSTS_REQUESTED: 'social-network/posts/GET_POSTS_REQUESTED',
  GET_POSTS_SUCCEED: 'social-network/posts/GET_POSTS_SUCCEED',
  GET_POSTS_FAILED: 'social-network/posts/GET_POSTS_FAILED',
  GET_POST_REQUESTED: 'social-network/posts/GET_POST_REQUESTED',
  GET_POST_SUCCEED: 'social-network/posts/GET_POST_SUCCEED',
  GET_POST_FAILED: 'social-network/posts/GET_POST_FAILED',
  ADD_POST_REQUESTED: 'social-network/posts/ADD_POST_REQUESTED',
  ADD_POST_SUCCEED: 'social-network/posts/ADD_POST_SUCCEED',
  ADD_POST_FAILED: 'social-network/posts/ADD_POST_FAILED',
  DELETE_POST_REQUESTED: 'social-network/posts/DELETE_POST_REQUESTED',
  DELETE_POST_SUCCEED: 'social-network/posts/DELETE_POST_SUCCEED',
  DELETE_POST_FAILED: 'social-network/posts/DELETE_POST_FAILED',
  EDIT_POST_REQUESTED: 'social-network/posts/EDIT_POST_REQUESTED',
  EDIT_POST_SUCCEED: 'social-network/posts/EDIT_POST_SUCCEED',
  EDIT_POST_FAILED: 'social-network/posts/EDIT_POST_FAILED'
}

// Action Creators
export function getPostsRequested(author) {
  return { type: types.GET_POSTS_REQUESTED, author }
}

export function getPostsSucceed(posts) {
  return { type: types.GET_POSTS_SUCCEED, posts }
}

export function getPostsFailed() {
  return { type: types.GET_POSTS_FAILED }
}

export function getPostRequested(post_id) {
  return { type: types.GET_POST_REQUESTED, post_id }
}

export function getPostSucceed(post) {
  return { type: types.GET_POST_SUCCEED, post }
}

export function getPostFailed() {
  return { type: types.GET_POST_FAILED }
}

export function addPostRequested(author, date, text) {
  return { type: types.ADD_POST_REQUESTED, author, date, text }
}

export function addPostSucceed(post) {
  return { type: types.ADD_POST_SUCCEED, post }
}

export function addPostFailed() {
  return { type: types.ADD_POST_FAILED }
}

export function deletePostRequested(post_id) {
  return { type: types.DELETE_POST_REQUESTED, post_id }
}

export function deletePostSucceed(post_id) {
  return { type: types.DELETE_POST_SUCCEED, post_id }
}

export function deletePostFailed() {
  return { type: types.DELETE_POST_FAILED }
}

export function editPostRequested(post_id, date, text) {
  return { type: types.EDIT_POST_REQUESTED, post_id, date, text }
}

export function editPostSucceed(post_id, text) {
  return { type: types.EDIT_POST_SUCCEED, post_id, text }
}

export function editPostFailed() {
  return { type: types.EDIT_POST_FAILED }
}

const initialState = fromJS([])

export default function posts(state = initialState, action) {
  switch (action.type) {
    case types.GET_POSTS_REQUESTED:
      return state
    case types.GET_POSTS_SUCCEED:
      return fromJS([...action.posts])
    case types.GET_POSTS_FAILED:
      return state
    case types.GET_POST_REQUESTED:
      return state
    case types.GET_POST_SUCCEED:
      return fromJS([...action.post])
    case types.GET_POST_FAILED:
      return state
    case types.ADD_POST_REQUESTED:
      return state
    case types.ADD_POST_SUCCEED:
      return state.unshift(fromJS(action.post))
    case types.ADD_POST_FAILED:
      return state
    case types.DELETE_POST_REQUESTED:
      return state
    case types.DELETE_POST_SUCCEED:
      return state.filter(item => item.get('id') != action.post_id)
    case types.DELETE_POST_FAILED:
      return state
    case types.EDIT_POST_REQUESTED:
      return state
    case types.EDIT_POST_SUCCEED:
      const postIndex = state.findIndex(item => item.get('id') == action.post_id)
      console.log(action)
      return state.setIn([postIndex, 'text'], action.text);
    case types.EDIT_POST_FAILED:
      return state
    default:
      return state
  }
}

export function* fetchPosts(action) {
  try {
    const result = yield call(getPostsRequest, action.author)

    const posts = yield result.json()

    yield put(getPostsSucceed(posts))
  } catch (error) {
    yield put(getPostsFailed())
  }
}

export function* fetchPost(action) {
  try {
    const result = yield call(getPostRequest, action.post_id)

    const post = yield result.json()

    yield put(getPostSucceed(post))
  } catch (error) {
    yield put(getPostFailed())
  }
}

export function* sendPost(action) {
  try {
    const result = yield call(addPostRequest, action.author, action.date, action.text)

    const post = yield result.json()

    yield put(addPostSucceed(post))
  } catch (error) {
    yield put(addPostFailed())
  }
}

export function* deletePost(action) {
  try {
    const result = yield call(deletePostRequest, action.post_id)

    const post = yield result.json()

    yield put(deletePostSucceed(post))
  } catch (error) {
    yield put(deletePostFailed())
  }
}

export function* editPost(action) {
  try {
    const result = yield call(editPostRequest, action.post_id, action.date, action.text)

    const post = yield result.json()

    yield put(editPostSucceed(action.post_id, action.text))
  } catch (error) {
    yield put(editPostFailed())
  }
}
