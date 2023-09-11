const path = require('path');
const {version,validate} = require('uuid');
const express = require('express');
const { userInfo } = require('os');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server,{
    cors: {
        origin: "http://localhost:3000",
        credentials: true
      }
});
const PORT = process.env.PORT || 3001;

const ACTIONS = {
    JOIN:"join",
    LEAVE:"leave",
    SHARE_ROOMS: 'share-rooms',
    ADD_PEER:'add-peer',
    REMOVE_PEER:'remove-peer',
    RELAY_SDP:'relay-sdp',
    RELAY_ICE:'relay-ice',
    ICE_CANDIDATE:'ice-candidate',
    SESSION_DESCRIPTION:'session-description',
    SHARE_SCREEN: "share-screen",
}

var usersAll = [];

function getClientRooms(){
    const {rooms} = io.sockets.adapter;
    return Array.from(rooms.keys()).filter(roomID=>validate(roomID) && version(roomID)===4);
    
}

function shareRoomsInfo(){
    io.emit(ACTIONS.SHARE_ROOMS,{
        rooms:getClientRooms()
    })
}
var removeByAttr = function(arr, attr, value){
    var i = arr.length;
    while(i--){
       if( arr[i] 
           && arr[i].hasOwnProperty(attr) 
           && (arguments.length > 2 && arr[i][attr] === value ) ){ 

           arr.splice(i,1);

       }
    }
    return arr;
}
io.on('connection',socket=>{
    console.log('Socket connected')
    shareRoomsInfo();
    socket.on(ACTIONS.JOIN,config =>{
        const {room:roomID} = config;
        const{rooms:joinedRooms} = socket;
        if(Array.from(joinedRooms).includes(roomID)){
            return console.warn(`Already in ${roomID}`)
        }

        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);
        console.log("Clients In Room",clients);
        clients.forEach(clientID=>{
            io.to(clientID).emit(ACTIONS.ADD_PEER,{
                peerID:socket.id,
                createOffer:false,
            });
            socket.emit(ACTIONS.ADD_PEER,{
                peerID:clientID,
                createOffer:true,
            
            });
        });
        socket.userInfo = config.userInfo;
        socket.join(roomID);
        const cl = io.sockets.adapter.rooms.get(roomID);
        cl.forEach(client =>{
            if(client === socket.id){
                usersAll.push({roomId:roomID,userInfo:config.userInfo,peerKey:client})
            }
        })
        const clientInRoomAll = usersAll.filter(
            function(el){
                return el.roomId === roomID;
            }
        )
        io.sockets.in(roomID).emit("users-in-room",clientInRoomAll)
        shareRoomsInfo();
    });

    function leaveRoom(){
        const {rooms} = socket;
       Array.from(rooms)
       .forEach(roomID=>{
        console.log(roomID)
        console.log(io.sockets.adapter.rooms)
        const clients = Array.from(io.sockets.adapter.rooms.get(roomID) || []);

        clients.forEach(clientID=>{
            io.to(clientID).emit(ACTIONS.REMOVE_PEER,{
                peerID:socket.id
            });
            socket.emit(ACTIONS.REMOVE_PEER,{
                peerID:clientID,
            });
        });

        socket.leave(roomID);
        removeByAttr(usersAll,"peerKey",socket.id);
       });
       shareRoomsInfo();
    }

    socket.on(ACTIONS.LEAVE,leaveRoom);
    socket.on('disconnecting',leaveRoom);
    socket.on(ACTIONS.RELAY_SDP,({peerID,sessionDescription})=>{
        io.to(peerID).emit(ACTIONS.SESSION_DESCRIPTION,{
            peerID:socket.id,
            sessionDescription,
            });
    });
    
    socket.on(ACTIONS.RELAY_ICE,({peerID,iceCandidate})=>{
        io.to(peerID).emit(ACTIONS.ICE_CANDIDATE,{
            peerID:socket.id,
            iceCandidate
        });

    });
    
});

server.listen(PORT,()=>{
    console.log('Server started')
})