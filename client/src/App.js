import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import './App.css';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';

export const SERVER_URL = 'ws://127.0.0.1:5000';

export function isUserEvent(message) {
  let evt = JSON.parse(message.data);
  return evt.type === 'userevent';
}

export function isMessageOrUserEvent(message) {
  let evt = JSON.parse(message.data);
  return evt.type === 'messagesend' || evt.type === 'userevent';
 }

function App() {
  const [username, setUsername] = useState('');
  const { sendJsonMessage, readyState } = useWebSocket(SERVER_URL, {
    onOpen: () => {
      console.log('WebSocket connection established.');
    },
    share: true,
    filter: () => false,
    retryOnError: true,
    shouldReconnect: () => true
  });

  useEffect(() => {
    if(username && readyState === ReadyState.OPEN) {
      sendJsonMessage({
        username,
        type: 'userevent'
      });
    }
  }, [username, sendJsonMessage, readyState]);

  return (
    <>
      <div className="container-fluid">
        {username ? <MainPage/>
            : <LoginPage onLogin={setUsername}/> }
      </div>
    </>
  );
}

export default App;
