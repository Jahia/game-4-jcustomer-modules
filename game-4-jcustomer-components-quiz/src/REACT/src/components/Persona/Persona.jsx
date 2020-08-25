import React from 'react';
import PropTypes from "prop-types";
import { CircularProgressbar } from 'react-circular-progressbar';
import {StoreContext} from "contexts";
import {Button,Form} from "react-bootstrap";

const Persona = (props) => {
    const { state,dispatch } = React.useContext(StoreContext);
    const { quiz,currentSlide,personaIndex,jContent,showNext } = state;
    const { files_endpoint,language_bundle } =  jContent;

    const show = currentSlide === personaIndex;

    const handleShowScore = () =>
        dispatch({
            case:"SHOW_SCORE"
        });

    console.log("Persona props.show :",props.show);
    return(
        <div className={`game4-quiz__item show-overlay ${show ? 'active':''} `}>
            {quiz.cover &&
                <img className="d-block w-100"
                     src={`${files_endpoint}${encodeURI(quiz.cover)}`}
                     alt={quiz.title}/>
            }
            <div className="game4-quiz__caption d-none d-md-block">
                {/*<Form.Label>Email address</Form.Label>*/}
                <Form.Control type="email" placeholder="name@example.com" />

                <Button variant="game4-quiz"
                        onClick={handleShowScore}
                        disabled={!showNext}>
                    {language_bundle && language_bundle.btnShowResults}
                </Button>
            </div>
        </div>
    );
}

Persona.propTypes={}

export default Persona;