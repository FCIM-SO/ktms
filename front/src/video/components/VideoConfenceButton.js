import React from 'react'
import "../CSS/VideoConference.css"
function VideoConfenceButton({img1,img2,onClick,state}) {
  return (
    <div className='video-conference-button'>
        <a className='video-conference-button-inner' onClick={()=>onClick()} >
            <img src={state ? img1 : img2} className='video-conference-img'/>
        </a>

    </div>
  )
}

export default VideoConfenceButton