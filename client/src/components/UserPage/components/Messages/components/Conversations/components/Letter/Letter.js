import React from 'react'
import ListItem from '@material-ui/core/ListItem';

export default function Letter({ letter, ...props }) {
  const {
    text,
    sender_name,
    sender_surname,
    date
  } = letter

  const {
    msgId,
    getDialogWithId,
    interlocutorAvatar
  } = props

  let msgText =
    text.length - text.slice(0, 20).length ? 
      (msgText = `${text.slice(0, 20)}...`) :
      (msgText = text)
      
  const avatarBg = interlocutorAvatar && interlocutorAvatar[0] === '#' ?
    { backgroundColor: interlocutorAvatar } :
    { backgroundImage: `url(${interlocutorAvatar})` }

  return (
    <li
      className="letter"
      id={msgId}
      onKeyDown={e => e.keyCode === 13 && getDialogWithId(e.currentTarget.id)}
      onClick={e => getDialogWithId(e.currentTarget.id)}
      role="menuitem"
      tabIndex={0}
    >
      <ListItem className="listItem" style={{ padding: '15px 20px', borderRadius: 8 }} button>
        <div
          className="avatar"
          style={avatarBg}
        />
        <span className="letter-date">{date}</span>
        <p className="letter-text">
          <span className="user">
            {`${sender_name} ${sender_surname}:`}
          </span>
          {` ${msgText}`}
        </p>
      </ListItem>
    </li>
  )
}
