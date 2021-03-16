import React from 'react';
import PropTypes from "prop-types";
import {StoreContext} from "contexts";
import Image from './components/Image';
import WidenImage from './components/widen/WidenImage';
import WidenVideo from './components/widen/WidenVideo';

const Media = ({id,type,path,sourceID,alt}) => {
    const { state } = React.useContext(StoreContext);
    const {
        jContent,
    } = state;
console.log("Media type: ",type)
    console.log("Media equals: ",type === jContent.cnd_type.WIDEN_IMAGE)
    let component;
    switch(type){
        case jContent.cnd_type.WIDEN_IMAGE :
            component = <WidenImage uuid={id} />
            break;

        case jContent.cnd_type.WIDEN_VIDEO :
            component = <WidenVideo uuid={id} sourceID={sourceID} />
            break;

        default:
            component = <Image path={path} alt={alt}/>
            break;
    }
    console.log("Media component: ",component)
    return(component)
}

Media.propTypes={
    id:PropTypes.string.isRequired,
    type:PropTypes.string.isRequired,
    path:PropTypes.string,
    sourceID:PropTypes.string,
    alt:PropTypes.string
}

export default Media;