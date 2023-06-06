import React, { useState } from 'react'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';
import { SERVER_URL } from '../App';

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  useWebSocket(SERVER_URL, {
    share: true,
    filter: () => false
  });
  function logInUser() {
    if(!username.trim()) {
      return;
    }
    onLogin && onLogin(username);
  }

  return (
    <div className="account">
      <div className="account-wrapper">
        <div className="account-card">
          <div className="account-profile">
            <p className="account-name">Hello!</p>
            <p className="account-sub">Write your name to join document editing</p>
          </div>
          <input name="username" onInput={(e) => setUsername(e.target.value)} className="form-control" />
          <button
            type="button"
            onClick={() => logInUser()}
            className="btn btn-primary account-btn">Join</button>
        </div>
      </div>
    </div>
  );
}
