import React from "react";
import {StoreContext} from "contexts";

const Image = ({path,alt}) =>{
    const { state} = React.useContext(StoreContext);
    const {files_endpoint} = state.jContent;
    return(
        <img className="d-block w-100"
             src={`${files_endpoint}${encodeURI(path)}`}
             alt={alt}/>
    )
}
export default Image;