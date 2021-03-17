import React from "react";
import PropTypes from "prop-types";
import VideoPlayer from "components/VideoPlayer";

const Video = ({url,ownerID}) =>{


    return(
        <VideoPlayer
            videoURL={url}
            ownerID={ownerID}
        />
    )
}
Video.propTypes={
    url:PropTypes.string.isRequired,
    ownerID:PropTypes.string.isRequired,
}

export default Video;