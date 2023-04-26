import React from 'react'
import "./Button.style.scss"

export default function Button({onClick,text,isMobile=false}) {
  return (
    <button className={`${isMobile ? "edit-button-mobile":"edit-button"} button`} id="edit-personal-data" onClick={onClick} >
       {text}
      </button>
  )
}
