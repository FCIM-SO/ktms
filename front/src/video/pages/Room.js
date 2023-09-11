import React, { useContext, useState,useRef } from "react";
import { useParams } from "react-router";
import useWebRTC, { LOCAL_VIDEO } from "../hooks/useWebRTC";
import { AuthContext } from "../..";
import { observer } from "mobx-react-lite";
import "../CSS/VideoConference.css";
import VideoConfenceButton from "../components/VideoConfenceButton";
import micOn from "../CSS/img/mic-enable.svg";
import micOff from "../CSS/img/mic-disable.svg";
import webCamOn from '../CSS/img/webcam-on.svg'
import webCamOff from '../CSS/img/webcam-off.svg'
import screenShareOn from '../CSS/img/screenshare-on.svg'
import screenShareOff from '../CSS/img/screenshare-off.svg'
function layout(clientsNumber = 1) {
  const pairs = Array.from({ length: clientsNumber }).reduce(
    (acc, next, index, arr) => {
      if (index % 2 === 0) {
        acc.push(arr.slice(index, index + 2));
      }

      return acc;
    },
    []
  );

  const rowsNumber = pairs.length;
  const height = `${100 / rowsNumber}%`;

  return pairs
    .map((row, index, arr) => {
      if (index === arr.length - 1 && row.length === 1) {
        return [
          {
            width: "100%",
            height,
          },
        ];
      }

      return row.map(() => ({
        width: "50%",
        height,
      }));
    })
    .flat();
}


function Room() {
  const [microphone, setMicrophone] = useState(true);
  const [webcam, setWebCam] = useState(true);
  const [screenShare, setScreenShare] = useState(false);
  const { store } = useContext(AuthContext);
  const { id: roomID } = useParams();
  const { clients, provideMediaRef, LocalVideo, clientsNames,startShareScreen } =
    useWebRTC(roomID);

    console.log(LocalVideo);
  const handleWebCam = () =>{
    
    const videoTrack = LocalVideo.current.getTracks().find(track => track.kind === 'video');
    if(videoTrack.enabled){
      videoTrack.enabled = false;
      setWebCam(false)
   
    }
    else{
      videoTrack.enabled = true;
      setWebCam(true);
    }
  }
  const handleScreenShare = () => {
    if (!screenShare) {
    } else {
      // Stop screen sharing and revert to webcam
      const videoTrack = LocalVideo.current.getTracks().find(track => track.kind === 'video');
      if (videoTrack) {
        videoTrack.enabled = true;
        setWebCam(true);
        setScreenShare(false);
      }
    }
  };
  const handleMicrophone = () =>{
    
    const audioTrack = LocalVideo.current.getTracks().find(track => track.kind === 'audio');
    if(audioTrack.enabled){
      audioTrack.enabled = false;
      setMicrophone(false)
   
    }
    else{
      audioTrack.enabled = true;
      setMicrophone(true);
    }
  }

  const shareRef = useRef(null);
  const beginShare = ()=>{
    navigator.mediaDevices.getDisplayMedia().then((feed)=>{
      shareRef.current.srcObject = feed;
    });
    
  }
  console.log(clientsNames);
  console.log("RoomId", roomID);
  console.log("Clients", clients);
  const videoLayout = layout(clients.length);
  function getNameForClient(clientID) {
    let name = "";
    clientsNames.some((element) => {
      if (element.peerKey === clientID) {
        name =
          element.userInfo.person.firstName +
          " " +
          element.userInfo.person.lastName;
      }
    });
    return name;
  }
  console.log(clients,"ClientsFromRoom.js")
  return (
    <div className="video-conference-room">
      <div className="user-blocks">
        {clients.map((clientID) => {
          return (
            <div key={clientID} className="user-block">
              <video
                className="video-camera"
                ref={(instance) => {
                  provideMediaRef(clientID, instance);
                }}
                autoPlay
                playsInline
                muted={clientID === LOCAL_VIDEO}
              />
              <div className="video-user-info">
                {clientID === LOCAL_VIDEO
                  ? store.user.person.firstName +
                    " " +
                    store.user.person.lastName
                  : getNameForClient(clientID)}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{width:300,height:500}}>
      </div>


      <div className="bottom-control">
        <div className="bottom-control-buttons">
          <VideoConfenceButton
            onClick={handleMicrophone}
            state={microphone}
            img1={micOn}
            img2={micOff}
          />
            <VideoConfenceButton
            onClick={handleWebCam}
            state={webcam}
            img1={webCamOn}
            img2={webCamOff}
          />
            <VideoConfenceButton
            onClick={handleScreenShare}
            state ={screenShare}
            img1={screenShareOn}
            img2={screenShareOff}
          />
        </div>
      </div>
    </div>
  );
}

export default observer(Room);
