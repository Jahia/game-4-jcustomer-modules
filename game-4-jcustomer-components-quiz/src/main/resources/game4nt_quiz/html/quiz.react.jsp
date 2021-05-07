<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<jsp:useBean id="random" class="java.util.Random" scope="application" />

<%--Add files used by the webapp--%>
<template:addResources type="css" resources="webapp/2.6c0f60ba.chunk.css" />
<template:addResources type="css" resources="webapp/main.3443d2d0.chunk.css" media="screen"/>
<template:addResources type="javascript" resources="webapp/2.50996edc.chunk.js" />
<template:addResources type="javascript" resources="webapp/main.1c6beadb.chunk.js" />

<c:set var="_uuid_" value="${currentNode.identifier}"/>
<c:set var="language" value="${currentResource.locale.language}"/>
<c:set var="workspace" value="${renderContext.workspace}"/>

<c:set var="site" value="${renderContext.site.siteKey}"/>
<c:set var="host" value="${url.server}"/>

<c:set var="token" value="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJodHRwOi8vamFoaWEuY29tIiwic3ViIjoiYXBpIHZlcmlmaWNhdGlvbiIsImlzcyI6ImR4Iiwic2NvcGVzIjpbImdhbWU0UXVpeiJdLCJpYXQiOjE2MjAwMzY2MjIsImp0aSI6IjAxZjA4ODU4LTI0ODgtNDIzMy1iYWM2LTI3ZWQ0MzBhYjFjMCJ9.kgQy5hZwnDqOrGwn8afRHxlf3nMPpKUrOJZurSbc0dk"/>
<c:set var="targetId" value="REACT_Quiz_${fn:replace(random.nextInt(),'-','_')}"/>

<div id="${targetId}"></div>

<script>
    const quiz_context_${targetId}={
        host:"${host}",
        workspace:"${workspace}",
        scope:"${site}",//site key
        files_endpoint:"${host}/files/${workspace}",
        gql_endpoint:"${host}/modules/graphql",
        gql_authorization:"Bearer ${token}",
        gql_variables:{
            id:"${_uuid_}",
            language: "${language}",
        },
        cdp_endpoint:window.digitalData?window.digitalData.contextServerPublicUrl:undefined,//digitalData is set in live mode only
    };

    window.addEventListener("DOMContentLoaded", (event) => {
        //in case if edit mode slow down the load waiting for the jahia GWT UI was setup,
        // otherwise the react app failed (maybe loosing his position as the DOM is updated by the jahia UI at the same time)
        <c:choose>
        <c:when test="${renderContext.editMode}" >
            setTimeout(() => {
                window.quizUIApp("${targetId}",quiz_context_${targetId});
            },500);
        </c:when>
        <c:otherwise>
            window.quizUIApp("${targetId}",quiz_context_${targetId});
        </c:otherwise>
        </c:choose>
    });

    <%-- Load the webapp --%>
    !function(e){function r(r){for(var n,i,l=r[0],f=r[1],a=r[2],c=0,s=[];c<l.length;c++)i=l[c],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&s.push(o[i][0]),o[i]=0;for(n in f)Object.prototype.hasOwnProperty.call(f,n)&&(e[n]=f[n]);for(p&&p(r);s.length;)s.shift()();return u.push.apply(u,a||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,l=1;l<t.length;l++){var f=t[l];0!==o[f]&&(n=!1)}n&&(u.splice(r--,1),e=i(i.s=t[0]))}return e}var n={},o={1:0},u=[];function i(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.m=e,i.c=n,i.d=function(e,r,t){i.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,r){if(1&r&&(e=i(e)),8&r)return e;if(4&r&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)i.d(t,n,function(r){return e[r]}.bind(null,n));return t},i.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(r,"a",r),r},i.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},i.p="/";var l=this.webpackJsonpquiz=this.webpackJsonpquiz||[],f=l.push.bind(l);l.push=r,l=l.slice();for(var a=0;a<l.length;a++)r(l[a]);var p=f;t()}([]);
    //# sourceMappingURL=/modules/game-4-jcustomer-components-quiz/javascript/webapp/runtime-main.2b41a98e.js.map
</script>