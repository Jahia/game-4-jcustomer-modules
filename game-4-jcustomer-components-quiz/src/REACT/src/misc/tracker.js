import uTracker from "unomi-analytics";

//TODO faire un POST /context.json pour recuperer l'email du user et voir s'il existe deja
//TODO voir le code de la version eL2 sans tracker pour le call

const syncTracker = ({scope,url,sessionId,dispatch}) => {
    uTracker.initialize({
        "Apache Unomi": {
            scope,
            url,
            sessionId
        }
    });
    uTracker.ready( () =>
        dispatch({
            case:"ADD_CXS",
            payload:{
                cxs:window.cxs
            }
        })
    );
};

const syncConsentStatus= ({typeIdentifier,scope,status}) => {
    const statusDate = new Date();
    const revokeDate = new Date(statusDate);
    revokeDate.setFullYear(revokeDate.getFullYear() + 2);
    console.debug("syncConsentStatus status :", status);

    uTracker.track("modifyConsent", {
        consent: {
            typeIdentifier,
            scope,
            status,
            statusDate: statusDate.toISOString(),//"2018-05-22T09:27:09.473Z",
            revokeDate: revokeDate.toISOString()//"2020-05-21T09:27:09.473Z"
        }
    });
};

const syncQuizScore = ({quizKey,split,quizScore}) =>
    uTracker.track("setQuizScore",{
        score:`${quizKey}${split}${quizScore}`
    });

const syncVideoStatus = ({content,parent,status,player}) =>
    uTracker.track("video",{
        id:content.id,
        type:content.type,
        game4Quiz:{
            id:content.id,
            type:content.type
        },
        game4Warmup:{
            id:parent
        },
        game4Video:{
            duration: player.current.getDuration(),
            currentTime: player.current.getCurrentTime(),
            status: status
        }
    });

const syncVisitorData = ({propertyName,propertyValue}) =>
    uTracker.track("updateVisitorData",{
        update : {
            propertyName,
            propertyValue
        }
    });

//Todo syncMergeProfile

export {
    syncTracker,
    syncConsentStatus,
    syncQuizScore,
    syncVideoStatus,
    syncVisitorData
}