import get from "lodash.get";

const WarmupMapper = (warmupData,cnd_type) => {
    let video = null;
    const videoLink = get(warmupData, "videoLink.value", "");
    const videoIntPath = get(warmupData, "videoIntPath.node");

    if(videoLink)
        video= videoIntPath ?
            videoIntPath:{
                id:null,
                type:{
                    value:cnd_type.EXT_VIDEO
                },
                path:get(warmupData, "videoExtPath.value")
            }

    return{
        id: get(warmupData, "id", ""),
        title: get(warmupData, "title", ""),
        subtitle: get(warmupData, "subtitle.value", ""),
        content: get(warmupData, "content.value", ""),
        duration: get(warmupData, "duration.value", ""),
        media: get(warmupData, "media.node", {}),
        childNodes: get(warmupData,"children.nodes",[])
            .map(node => {
                return{
                    id: get(node, "id"),
                    type: get(node, "type.value")
                }
            }),
        video
    }
}
export default WarmupMapper;