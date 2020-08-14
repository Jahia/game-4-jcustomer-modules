import get from "lodash.get";

export default function(warmupData,files_endpoint) {
    let video = null;
    const videoLink = get(warmupData, "videoLink.value", "");
    const videoIntPath = get(warmupData, "videoIntPath.node.path");

    if(videoLink)
        video= videoIntPath ?
            `${files_endpoint}${encodeURI(videoIntPath)}`:
            get(warmupData, "videoExtPath.value")


    return{
        id: get(warmupData, "id", ""),
        title: get(warmupData, "title", ""),
        subtitle: get(warmupData, "subtitle.value", ""),
        content: get(warmupData, "content.value", ""),
        duration: get(warmupData, "duration.value", ""),
        cover: get(warmupData, "cover.node.path", ""),
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