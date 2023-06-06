import React from 'react'
import { isUserEvent, SERVER_URL } from '../App'
import Avatar from 'react-avatar'
import { UncontrolledTooltip } from 'reactstrap';
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket';

export default function Users() {
  const { lastJsonMessage } = useWebSocket(SERVER_URL, {
    share: true,
    filter: isUserEvent
  });
  const users = Object.values(lastJsonMessage?.data.users || {});
  return users.map(user => (
    <div key={user.username.split(" ").join("")}>
      <span id={user.username.split(" ").join("")} className="userInfo">
        <Avatar name={user.username} size={40} round="20px"/>
      </span>
      <UncontrolledTooltip placement="top" target={user.username.split(" ").join("")}>
        {user.username}
      </UncontrolledTooltip>
    </div>
  ));
}


