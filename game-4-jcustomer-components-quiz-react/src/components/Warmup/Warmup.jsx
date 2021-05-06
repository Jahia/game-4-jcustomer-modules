import React from 'react';
import PropTypes from "prop-types";

import get from "lodash.get";
import {useQuery} from "@apollo/react-hooks";

import {StoreContext} from "contexts";
import {GET_WARMUP} from "./WarmupGraphQL";
import Qna from "components/Qna";
import WarmupMapper from "components/Warmup/WarmupModel";
import Media from "components/Media";
import classnames from "clsx";
import cssSharedClasses from "components/cssSharedClasses";
import {makeStyles} from "@material-ui/core/styles";
import {Typography, Button} from "@material-ui/core";
import DOMPurify from "dompurify";
import Header from "components/Header/Header";
import {manageTransition} from "misc/utils";

const useStyles = makeStyles(theme => ({
    contentGroup:{
        textAlign:'justify',
        maxWidth:'800px',
        margin:"auto",
        marginTop:`${theme.spacing(3)}px`,
        marginBottom:`${theme.spacing(4)}px`
    }
}));

const Warmup = (props) => {
    const classes = useStyles(props);
    const sharedClasses = cssSharedClasses(props);
    const { state, dispatch } = React.useContext(StoreContext);
    const { currentSlide,jContent,transitionTimeout,transitionIsEnabled} = state;
    const { gql_variables,cnd_type,language_bundle } =  jContent;

    const variables = Object.assign(gql_variables,{id:props.id})
    // const query = loader("./Warmup.graphql.disabled");
    const {loading, error, data} = useQuery(GET_WARMUP, {
        variables:variables,
    });

    const [warmup, setWarmup] = React.useState({childNodes:[]});

    React.useEffect(() => {

        if(loading === false && data){
            const warmup = WarmupMapper(get(data, "response.warmup", {}),cnd_type)
            dispatch({
                case:"ADD_SLIDES",
                payload:{
                    slides:warmup.childNodes.map(node=>node.id),
                    parentSlide:warmup.id
                }
            });
            // console.debug("warmup.id : ",warmup.id,"; warmup.video : ",warmup.video);
            setWarmup(warmup);
        }
    },[loading,data]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error :(</p>;
    console.debug("*** paint warmup : ",warmup.title);

    const show = currentSlide === props.id;
    const handleCLick = () =>
        manageTransition({
            state,
            dispatch,
            payload:{
                case:"NEXT_SLIDE"
            }
        });
        // if(transitionIsEnabled){
        //     dispatch({
        //         case:"TOGGLE_TRANSITION"
        //     });
        //     setTimeout(()=>dispatch({
        //         case:"TOGGLE_TRANSITION"
        //     }),transitionTimeout);
        //     setTimeout(()=>dispatch({
        //         case:"NEXT_SLIDE"
        //     }),transitionTimeout);
        // }else{
        //     dispatch({
        //         case:"NEXT_SLIDE"
        //     })
        // }

        // dispatch({
        //     case:"NEXT_SLIDE"
        // });

    return(
        <>
            <div className={classnames(
                sharedClasses.item,
                sharedClasses.showOverlay,
                (show ? 'active':'')
            )}>
                <Header/>
                {warmup.media &&
                    <Media id={warmup.media.id}
                           type={warmup.media.type?warmup.media.type.value:null}
                           mixins={warmup.media.mixins?warmup.media.mixins.map(mixin=>mixin.value):[]}
                           path={warmup.media.path}
                           alt={warmup.title}
                    />
                }

                <div className={sharedClasses.caption}>
                    <Typography className={sharedClasses.textUppercase}
                                variant="h3">
                        {warmup.title}
                    </Typography>
                    <Typography className={sharedClasses.subtitle}
                                color="primary"
                                variant="h4">
                        {warmup.subtitle}
                    </Typography>

                    <div className={classes.contentGroup}>
                        <Typography component="div"
                                    className={classes.content}
                                    dangerouslySetInnerHTML={{__html:DOMPurify.sanitize(warmup.content, { ADD_ATTR: ['target'] })}}/>

                        { warmup.video != null &&
                        <div>
                            <Media id={warmup.video.id || null}
                                   type={warmup.video.type.value}
                                   mixins={[]}
                                   path={warmup.video.path}
                                   sourceID={warmup.id}
                            />
                        </div>
                        }
                    </div>


                    <Button onClick={ handleCLick }>
                        {language_bundle && language_bundle.btnQuestion}
                    </Button>
                </div>
            </div>
            {warmup.childNodes.map( node =>
                <Qna
                    key={node.id}
                    id={node.id}
                />
            )}
        </>
    );
}

Warmup.propTypes={
    id:PropTypes.string.isRequired
}

export default Warmup;