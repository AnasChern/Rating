import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

export default function Header({isLoggedIn, setIsLoggedIn,userRating,setUserRating}) {

    function logout () {
        localStorage.removeItem('token')
        localStorage.removeItem('userid')
        setIsLoggedIn(false)
        setUserRating(null)

    }
  return (
    <nav className="navbar">

    <div className="navbar-inner">
        <div className="my-rating">
        <h3 className="logo"> <Link className="nav-btn" to="/">SRating</Link></h3>
        {
            isLoggedIn && userRating && <h4 className="logo"> My Rating: {userRating}</h4>
        }
        </div>
    
        <div className="btn-container">
           {!isLoggedIn && <Link className="nav-btn" to="/login" id="loginBtn">Log in</Link>}
          {!isLoggedIn &&  <Link className="nav-btn" to="/registration" id="registerBtn">Sign up</Link>}
           {isLoggedIn && <Link className="nav-btn" to="/login" id="logoutBtn" onClick={logout}>Log out</Link>}
            {isLoggedIn && <Link className="nav-btn" to="/profile" id="userAccount"><svg width="1.5rem" height="1.5rem" xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 448 512"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" /></svg></Link>}
        </div>
    </div>
    </nav>
  )
}
