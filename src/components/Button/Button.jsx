import React from 'react'
import "./Button.style.scss"

export default function Button({onClick,text,disabled,isMobile=false, testid}) {
  return (
    <button data-testid={testid} disabled={disabled} className={`${isMobile ? "edit-button-mobile":"edit-button"} button`} id="edit-personal-data" onClick={onClick} >
       {text}
      </button>
  )
}
