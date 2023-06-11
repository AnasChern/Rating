import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import './Authorization.style.scss'

const initialFormState = {
  firstname: '',
  lastName: '',
  username: '',
  phone: '',
  password: '',
  email: '',
  role: 'student'
}

export default function RegistrationPage() {
  const [formState, setFormState] = useState(initialFormState);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function onInputChange(field, e) {
    setFormState({ ...formState, [field]: e.target.value });
  }

  async function register() {
    try {
      const response = await fetch('http://127.0.0.1:5000/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formState)
      });

      const resData = await response.json();

      if (response.status === 200) {
        navigate('/login');
      } else {
        setError(resData.Response)
      }
    }
    catch (err) {
      setError("Internal Server Error")
    }
  }
  return (
    <div className='auth-page'>
      <div className="auth-page-wrapper">
        <header className="auth-header">
          <h2>Account Registration</h2>
        </header>
        <form>
          <div className="form-row">
            <input data-testid='first-name-input' type="text" required id="firstname" value={formState.firstname} onChange={(e) => onInputChange('firstname', e)} />
            <span>First name</span>

          </div>
          <div className="form-row">
            <input data-testid='last-name-input' type="text" required id="lastName" value={formState.lastName} onChange={(e) => onInputChange('lastName', e)} />
            <span>Last name</span>
          </div>
          <div className="form-row">
            <input data-testid='user-name-input' type="text" required id="userName" value={formState.username} onChange={(e) => onInputChange('username', e)} />
            <span>Username</span>
          </div>
          <div className="form-row">
            <input data-testid='email-input' type="email" required id="email" value={formState.email} onChange={(e) => onInputChange('email', e)} />
            <span>Email</span>
          </div>
          <div className="form-row">
            <input data-testid='tel-input' type="tel" required pattern="^[0-9]*$" id="phone" value={formState.phone} onChange={(e) => onInputChange('phone', e)} />
            <span>Phone</span>
          </div>
          <div className="form-row">
            <input type="text" readOnly defaultValue="STUDENT" />
            <span>Role</span>
          </div>
          <div className="form-row">
            <input data-testid='password-input' type="password" required id="password" value={formState.password} onChange={(e) => onInputChange('password', e)} />
            <span>Password</span>
          </div>
          {error && <div className="form-row" id="error">{error}</div>}
          <div className="form-row">If you already have account &nbsp;<Link data-testid='login-link' to="/login" className="login-btn">login</Link></div>
          <div className="form-row">
            <button type="button" id="registerBtn" onClick={register}>Register</button>
          </div>
        </form>
      </div>

    </div>
  )
}
