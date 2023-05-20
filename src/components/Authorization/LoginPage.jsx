import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import './Authorization.style.scss'

export default function LoginPage({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function onUsernameChange(e) {
    setUsername(e.target.value);
  }

  function onPasswordChange(e) {
    setPassword(e.target.value);
  }

  async function login() {
    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password,
        })
      });
      const resData = await response.json();
      if (resData.access_token) {
        localStorage.setItem('token', resData.access_token);
        localStorage.setItem('userid', resData.userid);
        setIsLoggedIn(true)
        navigate('/');
      } else {
        setError(resData)
      }
    }
    catch (err) {
      setError(err)
    }
  }

  return (
    <div className='auth-page'>
      <div className="auth-page-wrapper">
        <header className="auth-header">
          <h2>Account Login</h2>
        </header>
        <form>
          <div className="form-row">
            <input id="userName" type="text" required value={username} onChange={onUsernameChange} />
            <span>Username</span>
          </div>
          <div className="form-row">
            <input id="password" type="password" required value={password} onChange={onPasswordChange} />
            <span>Password</span>
          </div>
          {error && <div className="form-row" id="error">{error}</div>}
          <div className="form-row">If you don`t have account &nbsp;<Link to='/registration' className="login-btn">register</Link></div>
          <div className="form-row">
            <button id="loginBtn" type="button" onClick={login}>Login to your Account!</button>
          </div>
        </form>
      </div>
    </div>
  )
}
