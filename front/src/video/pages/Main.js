import React, { useEffect, useState,useRef } from 'react'
import {useNavigate} from 'react-router-dom'
import {v4} from 'uuid'
import {io} from 'socket.io-client'
const ACTIONS = {
    JOIN:"join",
    LEAVE:"leave",
    SHARE_ROOMS: 'share-rooms',
    ADD_PEER:'add-peer',
    REMOVE_PEER:'remove-peer',
    RELAY_SDP:'relay-sdp',
    RELAY_ICE:'relay-ice',
    ICE_CANDIDATE:'ice-candidate',
    SESSION_DESCRIPTION:'session-description'
}
const options = {
    "force new connection":true,
    reconnectionAttempts:"20",
    timeout:1000,
    transport:["websocket"]
}
const socket = io('http://192.168.100.4:3001/',options);

console.log(socket);


function Main() {
    const history = useNavigate();
    const [rooms,updateRooms] = useState([]);
    const rootNode = useRef()
    useEffect(() => {
        console.log('usseEffetc')
        socket.on(ACTIONS.SHARE_ROOMS, ({rooms = []} = {}) => {
          updateRooms(rooms);
        });
      }, [rooms]);
  return (
    <div>Main
        <h1>Avalaible</h1>
        <ul>
        {rooms.map(roomID => (
          <li key={roomID}>
            {roomID}
            <button onClick={() => {
              history(`/main/room/${roomID}`);
            }}>JOIN ROOM</button>
          </li>
        ))}
        </ul>
            <button
            onClick={
                ()=> history(`/main/room/${v4()}`)
            }
            >CREATE</button>
    </div>
  )
}

export default Main