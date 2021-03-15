import {useQuery} from "@apollo/react-hooks";
import {GET_WIDEN_MEDIA} from "./WidenMediaGraphQL";

const WidenImage = ({id,type,path}) => {
    const variables = {
        id: props.id
    }
    const {loading, error, data} = useQuery(GET_WIDEN_MEDIA, {
        variables: variables,
    });
}