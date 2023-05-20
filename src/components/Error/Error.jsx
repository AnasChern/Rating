import React from 'react'

export default function Error({visible, text}) {
  return visible && <div>{text}</div>
}
