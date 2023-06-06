import React from 'react'
import Chat from './Chat';
import Users from './Users';

export default function MainPage() {
  return (
    <div className="main-content">
      <div className="document-holder">
        <div className="currentusers">
          <Users />
        </div>
      </div>
      <div>
        <Chat />
      </div>
    </div >
  );
}