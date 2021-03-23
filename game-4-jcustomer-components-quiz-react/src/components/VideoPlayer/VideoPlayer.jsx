import React, {useRef} from 'react';
import PropTypes from "prop-types";
import {StoreContext} from "contexts";

import ReactPlayer from "react-player";
import {syncVideoStatus} from "misc/tracker";

const VideoPlayer = (props)=>{
    const {ownerID,videoURL} = props;
    const { state } = React.useContext(StoreContext);
    const {quiz} = state;

    const player = useRef(null);

    const handleVideoStatus = ({status}) => {
        syncVideoStatus({
            content:{
                id:quiz.id,
                type:quiz.type
            },
            parent:ownerID,
            player,
            status
        })
    }

    // const onReadyHandler = () => {
    //     console.log("onReady seekTo 4.2s")
    //     player.current.seekTo(4.2,"seconds");
    // }
    const onStartHandler = () => {
        // player.current.seekTo(4.2,"seconds");
    }
    const onPlayHandler = () => handleVideoStatus({status:"started"});
    const onEndedHandler = () => handleVideoStatus({status:"end"});
    const onPauseHandler = () => handleVideoStatus({status:"pause"});

    return (
        <div className='player-wrapper'>
            <ReactPlayer
                ref={player}
                className='react-player'
                url={videoURL}
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
    ownerID:PropTypes.string.isRequired
}

export default VideoPlayer;