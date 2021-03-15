import React from 'react';
import PropTypes from "prop-types";
import {StoreContext} from "contexts";
import Image from './components/Image'

const Media = ({id,type,path}) => {
    const { state } = React.useContext(StoreContext);
    const {
        jContent,
    } = state;

    let component;
    switch(type){
        case type === jContent.cnd_type.WIDEN_IMAGE :
            break;

        case type === jContent.cnd_type.WIDEN_VIDEO :
            break;

        default:
            component = <Image>
    }


    return(component)

}

Media.propTypes={
    id:PropTypes.string.isRequired,
    type:PropTypes.string.isRequired,
    path:PropTypes.string.isRequired
}

export default Media;