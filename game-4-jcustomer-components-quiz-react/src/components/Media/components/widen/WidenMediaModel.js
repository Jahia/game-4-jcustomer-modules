import get from "lodash.get";

const MediaMapper = (mediaData) => ({
    id: get(mediaData, "id"),
    type: get(mediaData, "type.value"),
    imageURL: get(mediaData, "imageURL.value"),
    videoURL: get(mediaData, "videoURL.value")
})

export default MediaMapper;