import React, {useRef} from 'react';
import PropTypes from "prop-types";
import {StoreContext} from "contexts";

import ReactPlayer from "react-player";
import uTracker from 'unomi-analytics';

const VideoPlayer = (props)=>{
    const { state } = React.useContext(StoreContext);
    const {quiz} = state;

    const player = useRef(null);
    // async function collectEvent({status}){
    const collectEvent = ({status}) => {
        console.log("collectEvent start uTracker: ",uTracker);
        //if tracker is not initialized the track event is not send
        uTracker.track("video",{
            id:quiz.id,
            type:quiz.type,
            game4Quiz:{
                id:quiz.id,
                type:quiz.type
            },
            game4Warmup:{
                id:props.warmupID
            },
            game4Video:{
                duration: player.current.getDuration(),
                currentTime: player.current.getCurrentTime(),
                status: status
            }
        });
    };

    // const onReadyHandler = () => {
    //     console.log("onReady seekTo 4.2s")
    //     player.current.seekTo(4.2,"seconds");
    // }
    const onStartHandler = () => {
        console.log("onStart seekTo 4.2s")
        // player.current.seekTo(4.2,"seconds");
    }

    const onPlayHandler = () => {
        collectEvent({status:"started"});
        console.log("onPlay called");
    };
    const onEndedHandler = () => {
        collectEvent({status:"end"});
    };
    const onPauseHandler = () => {
        collectEvent({status:"pause"});
    };
    return (
        <div className='player-wrapper'>
            <ReactPlayer
                ref={player}
                className='react-player'
                url={props.videoURL}
                controls
                width='100%'
                height='100%'
                // onReady={onReadyHandler}
                onStart={onStartHandler}
                // onProgress={(object)=> console.log("onProgress : ",object)}
                onPlay={onPlayHandler}
                // onSeek={(seconds)=> console.log("onSeek : ",seconds)}
                // onDuration={(seconds)=> console.log("onDuration :",seconds)}
                onPause={onPauseHandler}
                onEnded={onEndedHandler}
            />
        </div>
    )
}

VideoPlayer.propTypes={
    videoURL:PropTypes.string.isRequired,
    warmupID:PropTypes.string.isRequired
}

export default VideoPlayer;