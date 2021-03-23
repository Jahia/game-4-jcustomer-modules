import get from "lodash.get";

export default function(mediaData) {
console.log("mediaData: ",mediaData);
    return{
        //NOTE be sure string value like "false" or "true" are boolean I use JSON.parse to cast
        id: get(mediaData, "id"),
        type: get(mediaData, "type.value"),
        imageURL: get(mediaData, "imageURL.value"),
        videoURL: get(mediaData, "videoURL.value")
    }
};