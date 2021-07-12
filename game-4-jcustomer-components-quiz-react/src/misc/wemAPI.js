// import uTracker from "unomi-analytics";

// const syncTracker = ({scope,url,sessionId,dispatch}) => {
//     uTracker.initialize({
//         "Apache Unomi": {
//             scope,
//             url,
//             // sessionId
//         }
//     });
//
//     uTracker.ready( () =>
//         dispatch({
//             case:"ADD_CXS",
//             payload:{
//                 cxs:window.cxs
//             }
//         })
//     );
// };

const syncConsentStatus= ({wem,consents}) => {
    const statusDate = new Date();
    const revokeDate = new Date(statusDate);
    revokeDate.setFullYear(revokeDate.getFullYear() + 2);
    console.debug("syncConsentStatus consents :", consents);

    const consentsEvents = consents.map(consent =>{
        const consentEvent = wem.buildEvent("modifyConsent",
            wem.buildTarget(consent.typeIdentifier, 'consent'),
            wem.buildSourcePage()
        );
        consentEvent.properties={
            consent: {
                typeIdentifier:consent.typeIdentifier,
                scope:consent.scope,
                status:consent.status,
                statusDate: statusDate.toISOString(),//"2018-05-22T09:27:09.473Z",
                revokeDate: revokeDate.toISOString()//"2020-05-21T09:27:09.473Z"
            }
        }
        return consentEvent;
    });
    wem.collectEvents(consentsEvents, function () {
        console.debug("consents status updated");
    }, function (xhr) {
        console.error("oups something get wrong : ",xhr);
    })



};

// const syncQuizScore = ({quizKey,split,quizScore}) =>
//     uTracker.track("setQuizScore",{
//         score:`${quizKey}${split}${quizScore}`
//     });

const syncQuizScore = ({wem,quizKey,quizScore}) =>{
    const syncScoreEvent = wem.buildEvent("setQuizScore",
        wem.buildTarget(quizKey, 'quiz'),
        wem.buildSourcePage()
    );
    syncScoreEvent.properties={
        update : {
            [`properties.quiz-score-${quizKey}`]:quizScore
        }
    };
    wem.collectEvents(syncScoreEvent, function () {
        console.debug("score updated");
    }, function (xhr) {
        console.error("oups something get wrong : ",xhr);
    })
}


const syncVideoStatus = ({wem,content,parent,status,player}) =>{
    const videoEvent = wem.buildEvent("video",
        wem.buildTarget(content.id, content.type,{
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
        }),
        wem.buildSourcePage()
    );
    // syncQuizVisitorData.properties={
    //     update : {
    //         [propertyName]:propertyValue
    //     }
    // };
    wem.collectEvents(videoEvent, function () {
        console.debug("video data synch");
    }, function (xhr) {
        console.error("oups something get wrong : ",xhr);
    })
};
    // uTracker.track("video",{
    //     id:content.id,
    //     type:content.type,
    //     game4Quiz:{
    //         id:content.id,
    //         type:content.type
    //     },
    //     game4Warmup:{
    //         id:parent
    //     },
    //     game4Video:{
    //         duration: player.current.getDuration(),
    //         currentTime: player.current.getCurrentTime(),
    //         status: status
    //     }
    // });

const syncVisitorData = ({wem,propertyName,propertyValue,resolve}) =>{
    const syncQuizVisitorData = wem.buildEvent("syncVisitorData",
        wem.buildTarget(propertyName, 'quizAnswer'),
        wem.buildSourcePage()
    );
    syncQuizVisitorData.properties={
        update : {
            [propertyName]:propertyValue
        }
    };
    wem.collectEvents(syncQuizVisitorData, resolve , function (xhr) {
        console.error("oups something get wrong : ",xhr);
    })
};

export {
    // syncTracker,
    syncConsentStatus,
    syncQuizScore,
    syncVideoStatus,
    syncVisitorData
}