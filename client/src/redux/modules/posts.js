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

const socket = io('/')

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
  return { type: types.GET_REQUESTED, author }
}

export function getPostsSucceed(posts) {
  return { type: types.GET_SUCCEED, posts }
}

export function getPostsFailed() {
  return { type: types.GET_FAILED }
}

export function getPostRequested(id) {
  return { type: types.GET_POST_REQUESTED, id }
}

export function getPostSucceed(messages) {
  return { type: types.GET_POST_SUCCEED, messages }
}

export function getPostFailed() {
  return { type: types.GET_POST_FAILED }
}

export function addPostRequested(id) {
  return { type: types.ADD_POST_REQUESTED, id }
}

export function addPostSucceed(messages) {
  return { type: types.ADD_POST_SUCCEED, messages }
}

export function addPostFailed() {
  return { type: types.ADD_POST_FAILED }
}

export function deletePostRequested(id) {
  return { type: types.DELETE_POST_REQUESTED, id }
}

export function deletePostSucceed(messages) {
  return { type: types.DELETE_POST_SUCCEED, messages }
}

export function deletePostFailed() {
  return { type: types.DELETE_POST_FAILED }
}

export function editPostRequested(id) {
  return { type: types.EDIT_POST_REQUESTED, id }
}

export function editPostSucceed(messages) {
  return { type: types.EDIT_POST_SUCCEED, messages }
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
      return state
    case types.GET_POSTS_FAILED:
      return state
    case types.GET_POST_REQUESTED:
      return state
    case types.GET_POST_SUCCEED:
      return state
    case types.GET_POST_FAILED:
      return state
    case types.ADD_POST_REQUESTED:
      return state
    case types.ADD_POST_SUCCEED:
      return state
    case types.ADD_POST_FAILED:
      return state
    case types.DELETE_POST_REQUESTED:
      return state
    case types.DELETE_POST_SUCCEED:
      return state
    case types.DELETE_POST_FAILED:
      return state
    case types.EDIT_POST_REQUESTED:
      return state
    case types.EDIT_POST_SUCCEED:
      return state
    case types.EDIT_POST_FAILED:
      return state
    default:
      return state
  }
}

export function* fetchPosts(action) {
  try {
    const result = yield call(getPostsRequest)

    const posts = yield result.json()

    yield put(getPostsRequested(posts))
  } catch (error) {
    yield put(getPostsFailed())
  }
}

export function* fetchPost(action) {
  try {
    const result = yield call(getPostRequest)

    const post = yield result.json()

    yield put(getPostRequest(post))
  } catch (error) {
    yield put(getPostFailed())
  }
}

export function* sendPost(action) {
  try {
    const result = yield call(addPostRequest)

    const post = yield result.json()

    yield put(addPostRequested(post))
  } catch (error) {
    yield put(addPostFailed())
  }
}

export function* deletePost(action) {
  try {
    const result = yield call(deletePostRequest)

    const post = yield result.json()

    yield put(deletePostRequested(post))
  } catch (error) {
    yield put(deletePostFailed())
  }
}

export function* editPost(action) {
  try {
    const result = yield call(editPostRequest)

    const post = yield result.json()

    yield put(editPostRequested(post))
  } catch (error) {
    yield put(editPostFailed())
  }
}
