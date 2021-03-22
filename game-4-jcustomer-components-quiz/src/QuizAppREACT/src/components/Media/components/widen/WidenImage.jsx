import React from "react";
import PropTypes from "prop-types";
import {StoreContext} from "contexts";
import {useQuery} from "@apollo/react-hooks";
import {GET_WIDEN_MEDIA} from "./WidenMediaGraphQL";
import get from "lodash.get";
import MediaMapper from './WidenMediaModel';


const WidenImage = ({uuid}) => {
    const _SIZE_ = '{size}';
    const _SCALE_ = '{scale}';
    const _QUALITY_ = '{quality}';
    const width = '1024';
    const scale = '1';
    const quality = '72';

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
            media.imageURL=media.imageURL
                .replace(_SIZE_,width)
                .replace(_SCALE_,scale)
                .replace(_QUALITY_,quality);
            setMedia(media);
        }
    }, [loading,data]);

    if (loading) return <img src={`https://via.placeholder.com/${width}x768/09f/fff?text=Loading`} alt="loading"/>;
    if (error) return <p>Error :(</p>;

    return (
        <>
        {media &&
            <img className="d-block w-100"
             src={media.imageURL}
             alt={media.title}/>
        }
        </>
    )
}

WidenImage.propTypes={
    uuid:PropTypes.string.isRequired
}

export default WidenImage;