import React from 'react';
import PropTypes from "prop-types";
import {StoreContext} from "contexts";
import Image from './components/Image';
import Video from './components/Video';
import WidenImage from './components/widen/WidenImage';
import WidenVideo from './components/widen/WidenVideo';

const Media = ({id,type,path,sourceID,alt}) => {
    const { state } = React.useContext(StoreContext);
    const {cnd_type,files_endpoint} = state.jContent;

    // console.log("Media equals: ",type === cnd_type.WIDEN_IMAGE)
    let component;
    switch(type){
        case cnd_type.WIDEN_IMAGE :
            component = <WidenImage uuid={id} />
            break;

        case cnd_type.WIDEN_VIDEO :
            component = <WidenVideo uuid={id} ownerID={sourceID} />
            break;

        case cnd_type.EXT_VIDEO:
            component = <Video url={path} ownerID={sourceID} />
            break;
            
        case cnd_type.INT_VIDEO:
            component = <Video url={files_endpoint+encodeURI(path)} ownerID={sourceID} />
            break;
            
        default:
            component = <Image path={path} alt={alt}/>
            break;
    }
    // console.log("Media component: ",component)
    return(component)
}

Media.propTypes={
    id:PropTypes.string,
    type:PropTypes.string.isRequired,
    path:PropTypes.string,
    sourceID:PropTypes.string,
    alt:PropTypes.string
}

export default Media;