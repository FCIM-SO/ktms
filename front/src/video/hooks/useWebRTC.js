import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import freeice from "freeice"
import useStateWithCallback from "./useStateWithCallback";
const ACTIONS = {
  JOIN: "join",
  LEAVE: "leave",
  SHARE_ROOMS: "share-rooms",
  ADD_PEER: "add-peer",
  REMOVE_PEER: "remove-peer",
  RELAY_SDP: "relay-sdp",
  RELAY_ICE: "relay-ice",
  ICE_CANDIDATE: "ice-candidate",
  SESSION_DESCRIPTION: "session-description",
};

export const LOCAL_VIDEO = "LOCAL_VIDEO";


export default function useWebRTC(roomID) {
  const [clients, updateClients] = useStateWithCallback([]);
  const [clientsNames, updateClientsNames] = useState([]);
  const {user:store} = useSelector((state)=>state);

  const options = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 1000,
    transport: ["websocket"],
    userInfo: store.user,
  };
  const socket = io("http://192.168.100.4:3001/", options);
  const LocalVideo = useRef(null);
  const LocalStram = useRef(null);
  const addNewClient = useCallback(
    (newClient, cb) => {
      updateClients((list) => {
        if (!list.includes(newClient)) {
          return [...list, newClient];
        }

        return list;
      }, cb);
    },
    [clients, updateClients]
  );

  const peerConnections = useRef({});
  const localMediaStream = useRef(null);
  const peerMediaElements = useRef({
    [LOCAL_VIDEO]: null,
  });

  useEffect(() => {
    async function handleNewPeer({ peerID, createOffer, userInfo }) {
      console.log("preeeeecdddfdscsd",peerConnections)
      console.log("preeeeecdcsdscxv14312313d",peerMediaElements)
      console.log("preeeeed",peerID)
      if (peerID in peerConnections.current) {
      }
      peerConnections.current[peerID] = new RTCPeerConnection({
        iceServers: freeice(),
      });
      peerConnections.current[peerID].onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit(ACTIONS.RELAY_ICE, {
            peerID,
            iceCandidate: event.candidate,
          });
        }
      };
      

      let trackNumber = 0;
      peerConnections.current[peerID].ontrack = ({
        streams: [remoteStream],
      }) => {
        trackNumber++;

        addNewClient(peerID, () => {
          peerMediaElements.current[peerID].srcObject = remoteStream;
        });
      };
      if (
        localMediaStream.current !== null &&
        localMediaStream.current !== undefined
      ) {
        localMediaStream.current.getTracks().forEach((track) => {

          peerConnections.current[peerID].addTrack(
            track,
            localMediaStream.current
          );
        });

      }
      else {

      }

      if (createOffer) {
        // Create and send the offer including screen stream
        const offer = await peerConnections.current[peerID].createOffer();
    
        await peerConnections.current[peerID].setLocalDescription(offer);
    
        socket.emit(ACTIONS.RELAY_SDP, {
          peerID,
          sessionDescription: offer,
        });
      }
    }

    socket.on(ACTIONS.ADD_PEER, handleNewPeer);
  }, []);

  useEffect(() => {
    async function setRemoteMedia({
      peerID,
      sessionDescription: remoteDescription,
    }) {
      await peerConnections.current[peerID].setRemoteDescription(
        new RTCSessionDescription(remoteDescription)
      );
      console.log("set Remote Media", peerID, remoteDescription);
      if (remoteDescription.type === "offer") {
        const answer = await peerConnections.current[peerID].createAnswer();

        await peerConnections.current[peerID].setLocalDescription(answer);
        console.log("Set Description Rekay SDP", peerID, answer);
        socket.emit(ACTIONS.RELAY_SDP, {
          peerID,
          sessionDescription: answer,
        });
      }
    }

    socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia);
  }, []);
  useEffect(() => {
    async function setClientsNamesFromSocket(clientsAll) {
      console.log("Client ALl INFO", clientsAll);
      await updateClientsNames(clientsAll);
    }

    socket.on("users-in-room", setClientsNamesFromSocket);
  }, [clients]);
  useEffect(() => {
    socket.on(ACTIONS.ICE_CANDIDATE, ({ peerID, iceCandidate }) => {
      console.log("ICE CANDIDATe", peerID, iceCandidate);
      peerConnections.current[peerID].addIceCandidate(
        new RTCIceCandidate(iceCandidate)
      );
    });
  }, []);

  useEffect(() => {
    const handleRemovePeer = ({ peerID }) => {
      if (peerConnections.current[peerID]) {
        peerConnections.current[peerID].close();
      }

      delete peerConnections.current[peerID];
      delete peerMediaElements.current[peerID];

      updateClients((list) => list.filter((c) => c !== peerID));
    };

    socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
  }, []);

  useEffect(() => {
    async function startCapture() {
      try {
        localMediaStream.current = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: {
            width: 1280,
            height: 720,
          },
        });
      }
      catch (e) {
        console.log(e)

      }
      if (
        localMediaStream.current !== null &&
        localMediaStream.current !== undefined
      ) {
        addNewClient(LOCAL_VIDEO, () => {
          const localVideoElement = peerMediaElements.current[LOCAL_VIDEO];
          if (localVideoElement) {
            localVideoElement.volume = 0;
            localVideoElement.srcObject = localMediaStream.current;
            LocalVideo.current = localMediaStream.current;
            console.log(LocalVideo.current);
          }
          const userInfo = {
            login:"login",
            person:{
                firstName:"firstName",
                lastName:"lastName",
              }
          } 
          console.log("Add", userInfo.target);
        });
      }
    }
    startCapture().then(() =>
      socket.emit(ACTIONS.JOIN, {
        room: roomID,
        userInfo: store.user,
      })
    );
    return () => {
      if (
        localMediaStream.current !== null &&
        localMediaStream.current !== undefined
      ) {
        localMediaStream.current.getTracks().forEach((track) => track.stop());
        socket.emit(ACTIONS.LEAVE);
      }
    };
  }, [roomID]);
  

  
  
  const provideMediaRef = useCallback((id, node) => {
    peerMediaElements.current[id] = node;
  });
  return { clients, provideMediaRef, clientsNames, LocalVideo };
}
