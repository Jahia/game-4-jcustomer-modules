<%@ page language="java" contentType="text/html;charset=UTF-8" %>
<%@ taglib prefix="template" uri="http://www.jahia.org/tags/templateLib" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<c:set var="quizNode" value="${currentNode.properties['j:node'].node}"/>
<c:set var="referenceView" value="${not empty currentNode.properties['j:referenceView'] ?
    currentNode.properties['j:referenceView'].string :
    'default'}"/>

<template:module node="${quizNode}" editable="false" view="${referenceView}" />
