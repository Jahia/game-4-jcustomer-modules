import React from 'react';
import ReactDOM from 'react-dom';

import App from 'components/App';
import AjvError from "components/Error/Ajv";

import * as serviceWorker from 'misc/serviceWorker';

import ApolloClient from "apollo-boost";
import { ApolloProvider } from '@apollo/react-hooks';

import {contextValidator} from "douane";

import 'index.css';

const render=(target,context)=>{
  try{
    // console.log("context : ",JSON.stringify(context));
    context = contextValidator(context);
    const headers={};
    if(context.gql_authorization)
      headers.Authorization=context.gql_authorization;

    const client = new ApolloClient({
      uri:context.gql_endpoint,
      headers
    })

    // console.log("lesson : ",src.data.jcr.lesson);
    ReactDOM.render(
      <ApolloProvider client={client}>
        <App context={context}/>
      </ApolloProvider>,
      document.getElementById('root')
    );

  }catch(e){
    console.error("error : ",e);
    //TODO create a generic error handler
    ReactDOM.render(
      <AjvError
        item={e.item}
        errors={e.errors}
      />,
      document.getElementById(target)
    );
  }
}

window.quizUIApp = render;

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
