import React from "react";
import {StoreContext} from "contexts";
import {useQuery} from "@apollo/react-hooks";
import {GET_WIDEN_MEDIA} from "./WidenMediaGraphQL";
import get from "lodash.get";
import MediaMapper from './WidenMediaModel';
import PropTypes from "prop-types";
import VideoPlayer from "components/VideoPlayer";


const WidenVideo = ({uuid, ownerID}) => {

    const { state } = React.useContext(StoreContext);
    const { gql_variables} =  state.jContent;

    const variables = Object.assign(gql_variables,{id:uuid})
    const {loading, error, data} = useQuery(GET_WIDEN_MEDIA, {
        variables: variables,
    });

    const [media, setMedia] = React.useState({});

    React.useEffect(() => {
        if(loading === false && data){
            const media = MediaMapper(get(data, "response.media", {}));
            setMedia(media);
        }
    }, [loading,data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;

    return (
        <>
        {media.videoURL &&
            <VideoPlayer
                videoURL={media.videoURL}
                ownerID={ownerID}
            />
        }
        </>
    )
}

WidenVideo.propTypes={
    uuid:PropTypes.string.isRequired,
    ownerID:PropTypes.string.isRequired,
}

export default WidenVideo;