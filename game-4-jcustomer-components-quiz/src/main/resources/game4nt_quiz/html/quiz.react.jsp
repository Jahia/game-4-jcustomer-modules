<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="jcr" uri="http://www.jahia.org/tags/jcr" %>
<%@ taglib prefix="ui" uri="http://www.jahia.org/tags/uiComponentsLib" %>
<%@ taglib prefix="functions" uri="http://www.jahia.org/tags/functions" %>
<%@ taglib prefix="query" uri="http://www.jahia.org/tags/queryLib" %>
<%@ taglib prefix="utility" uri="http://www.jahia.org/tags/utilityLib" %>
<%@ taglib prefix="s" uri="http://www.jahia.org/tags/search" %>

<%--Add files used by the webapp--%>
<template:addResources type="css" resources="REACTEmbeddedBuild/2.f524894f.chunk.css" />
<template:addResources type="css" resources="REACTEmbeddedBuild/main.77fd84b9.chunk.css" />
<template:addResources type="javascript" resources="REACTEmbeddedBuild/2.ce498631.chunk.js" />
<template:addResources type="javascript" resources="REACTEmbeddedBuild/main.a3e7e162.chunk.js" />


<%--<c:set var="_path_" value="${currentNode.path}"/>--%>
<c:set var="_uuid_" value="${currentNode.identifier}"/>
<c:set var="language" value="${currentResource.locale.language}"/>
<%--<c:set var="mode" value="${renderContext.mode}"/>--%>
<c:set var="workspace" value="${renderContext.workspace}"/>

<c:set var="site" value="${renderContext.site.siteKey}"/>
<c:set var="host" value="${url.server}"/>

<c:set value="${currentNode.properties['game4:ask4persona'].boolean}" var="ask4persona" />
<c:set value="${(empty ask4persona) ? false : ask4persona}" var="ask4persona" />


<c:set var="host" value="${url.server}"/>
<%--<c:set var="token" value="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJodHRwOi8vamFoaWEuY29tIiwic3ViIjoiYXBpIHZlcmlmaWNhdGlvbiIsImlzcyI6ImR4Iiwic2NvcGVzIjpbImVsMiJdLCJpYXQiOjE1ODg3ODEwODMsImp0aSI6IjAwNzUzZjAwLThlYjgtNGFkMS1hMzk5LTMzMGU0N2MxZDIwZCJ9.4iQMBy_olTt-w5VuDXTocCN6IGdwEnWm71xU7dQ3MN8"/>--%>

<%--<utility:logger level="INFO" value="**** MA REQUEST : ${renderContext.request.requestURL}******"/>--%>
<%--<utility:logger level="INFO" value="**** SERVEUR : ${url.server}******"/>--%>
<%--<utility:logger level="INFO" value="**** workspace : ${workspace}******"/>--%>

<c:set var="targetId" value="REACT_Quiz_${fn:replace(currentNode.identifier,'-','_')}"/>
<div id="${targetId}"></div>

<script>
    const context={
        host:"${host}",
        workspace:"${workspace}",
        // allow_indicator_browsing:true,
        //ask4persona:${ask4persona},
        scope:"${site}",//site key
        files_endpoint:"${host}/files/${workspace}",
        gql_endpoint:"${host}/modules/graphql",
        //Note: le mode default utilise le cookie JSESSIONID et le live utilise le token pour authentifier l'accès au scope
        // soit je génère le token dans un filter soit j'ouvre tout au niveau  : org.jahia.modules.api.permissions-gql.cfg
        // permission.JCRQuery.* = jcr:read
        gql_authorization:"Basic cm9vdDpyb290",//"Bearer ${token}",
        gql_variables:{
            id:"${_uuid_}",
            language: "${language}",
        },
        cdp_endpoint:window.digitalData?window.digitalData.contextServerPublicUrl:undefined//digitalData is set in live mode only
    };

    window.addEventListener("DOMContentLoaded", (event) => {
        //in case if edit mode slow down the load waiting for the jahia GWT UI was setup,
        // otherwise the react app failed (maybe loosing his position as the DOM is updated by the jahia UI at the same time)
        <c:choose>
        <c:when test="${renderContext.editMode}" >
            setTimeout(() => {
                window.quizUIApp("${targetId}",context);
            },500);
        </c:when>
        <c:otherwise>
            window.quizUIApp("${targetId}",context);
        </c:otherwise>
        </c:choose>
    });

    <%-- Load the webapp --%>
    !function(e){function r(r){for(var n,i,l=r[0],f=r[1],a=r[2],c=0,s=[];c<l.length;c++)i=l[c],Object.prototype.hasOwnProperty.call(o,i)&&o[i]&&s.push(o[i][0]),o[i]=0;for(n in f)Object.prototype.hasOwnProperty.call(f,n)&&(e[n]=f[n]);for(p&&p(r);s.length;)s.shift()();return u.push.apply(u,a||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,l=1;l<t.length;l++){var f=t[l];0!==o[f]&&(n=!1)}n&&(u.splice(r--,1),e=i(i.s=t[0]))}return e}var n={},o={1:0},u=[];function i(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,i),t.l=!0,t.exports}i.m=e,i.c=n,i.d=function(e,r,t){i.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},i.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,r){if(1&r&&(e=i(e)),8&r)return e;if(4&r&&"object"===typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(i.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var n in e)i.d(t,n,function(r){return e[r]}.bind(null,n));return t},i.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(r,"a",r),r},i.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},i.p="/";var l=this.webpackJsonpquiz=this.webpackJsonpquiz||[],f=l.push.bind(l);l.push=r,l=l.slice();for(var a=0;a<l.length;a++)r(l[a]);var p=f;t()}([]);
    //# sourceMappingURL=runtime-main.410ddc6b.js.map
</script>