import Http from 'utils/Http'

const headers = {
  'Access-Control-Request-Headers': '*',
  'Content-Type': 'application/json'
}

export const getUserRequest = name => new Http().get(`users/${name}`)

export const getUsersRequest = (id, start, end) => new Http().get(`users/all/${id}/${start}/${end}`)

export const getLastUserRequest = id => new Http().post('users/last', { headers, body: JSON.stringify({ id }) })

export const getFriendsRequest = id => new Http().get(`users/${id}/friends`)

export const deleteFriendRequest = (friendId, userId) => new Http().delete(`users/${userId}/friends/${friendId}`)

export const registerUserRequest = userData => new Http().post('register', { headers, body: JSON.stringify({ ...userData }) })

export const signInUserRequest = (email, password) => new Http().post('signIn', { headers, body: JSON.stringify({ email, password }) })

export const getUserMsgsRequest = id => new Http().get(`users/${id}/messages`)

export const getUserNotificationsRequest = id => new Http().get(`users/${id}/notifications`)

export const postFriendshipRequest = (receiver_id, id, avatar, text) => new Http().post('notifications/friendship/send', {
  headers,
  body: JSON.stringify({
    id,
    receiver_id,
    avatar,
    text
  })
})

export const acceptFriendshipRequest = (sender_id, receiver_id) => new Http().post('notifications/friendship/accept', {
  headers,
  body: JSON.stringify({
    receiver_id,
    sender_id
  })
})

export const rejectFriendshipRequest = (sender_id, receiver_id) => new Http().delete('notifications/friendship/reject', {
  headers,
  body: JSON.stringify({
    receiver_id,
    sender_id
  })
})

export const sendMsgRequest = (receiver_id, id, name, surname, avatar, date, message) => new Http().post(`users/${receiver_id}/messages`, {
  headers,
  body: JSON.stringify({
    receiver_id,
    sender_id: id,
    sender_name: name,
    sender_surname: surname,
    sender_avatar: avatar,
    date,
    text: message
  })
})

export const getPostsRequest = author => new Http().get(`posts/all/${author}`)

export const getPostRequest = post_id => new Http().get(`posts/${post_id}`, { headers, body: JSON.stringify({}) })

export const addPostRequest = (author, date, text) => new Http().post('posts', { headers, body: JSON.stringify({author, date, text}) })

export const deletePostRequest = post_id => new Http().delete(`posts/${post_id}`)

export const editPostRequest = (post_id, date, text) => new Http().put(`posts/${post_id}`, { headers, body: JSON.stringify({ post_id, date, text }) })

export const changeSettingsRequest = userData => new Http().put('settings', { headers, body: JSON.stringify({ ...userData }) })

export const uploadAvatarRequest = formData => new Http().post('settings/avatar', { body: formData })
