import React, {useContext, useRef} from 'react';
import PropTypes from "prop-types";
import {JContext} from "contexts";

import ReactPlayer from "react-player";
import uTracker from 'unomi-analytics';

const VideoPlayer = ({videoURL,chapterId})=>{
    // const {content,jCustomer} =  useContext(JContext);
    const {content} =  useContext(JContext);
    // console.log("content : ",content);
    // console.log("__jCustomer : ",window.__jCustomer);
    // const {sessionId} = useContext(CXSContextJs);

    // console.log("sessionId_Videoplayer : ",sessionId);
    // const [progress,handleProgress] = useState();


    const player = useRef(null);
    // async function collectEvent({status}){
    function collectEvent({status}){
        // console.log("collectEvent start uTracker: ",uTracker);
        //if tracker is not initialized the track event is not send
        uTracker.track("video",{
            id:content.id,
            type:content.type,
            elesson:{//lesson is already map to string by Elastic so we cannot reuse this name
                id:content.id,
                type:content.type
            },
            chapter:{
                id:chapterId
            },
            video:{
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

        // console.log("sessionId_onPlayHandler : ",sessionId);
        // console.log("chapterId_onPlayHandler : ",chapterId);
        // //send event
        // // source -> lesson -> properties :lessonid,chapterid
        // // target -> video -> videoid,duration,currentTime
        // UNOMI.post("/eventcollector",{
        //     "sessionId" : sessionId,
        //     "events": [{
        //         "eventType": "view",
        //         "scope": window.__jahia__.jcustomer.scope,
        //         "source": {
        //             "itemId": window.__jahia__.content.id,
        //             "itemType": window.__jahia__.content.type,
        //             "scope": window.__jahia__.jcustomer.scope,
        //             "properties": {
        //                 "chapterInfo":chapterId
        //             }
        //         },
        //         "target": {
        //             "itemId": "/",
        //             "itemType": "elearning:video",
        //             "properties": {
        //                 "videoInfo": {
        //                     "duration": player.current.getDuration(),
        //                     "currentTime": player.current.getCurrentTime(),
        //                     "status": "started"
        //                 }
        //             },
        //             "scope": window.__jahia__.jcustomer.scope
        //         }
        //     }]
        // }).then(response=>{
        //     console.log("ok ! ",response);
        // }).catch(e=>{
        //     console.error("oups ! ",e);
        // });


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
    chapterId:PropTypes.string.isRequired
}

export default VideoPlayer;