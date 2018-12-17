import React from 'react'

export default function Post({id, text, date}) {
  return (
    <li id={id} className="post-item">
        {text}
        <p className="post-date">{date}</p>
    </li>
  )
}
