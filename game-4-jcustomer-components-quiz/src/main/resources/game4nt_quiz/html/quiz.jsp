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

<c:set var="title" value="${fn:escapeXml(currentNode.displayableName)}"/>
<c:set var="description" value="${currentNode.properties['game4:description'].string}"/>

<c:set value="${currentNode.properties['game4:cover'].node}" var="coverNode"/>
<c:url var="imageURL" value="${coverNode.url}"/>

<c:url var="quiz" value="${currentNode.url}"/>

<div class="half d-lg-flex d-block">
    <div class="image ${imagePosition} ${renderContext.editMode == true?' position-relative':''}">
        <div class="image-display" style="background-image: url('${imageURL}');"></div>
    </div>
    <div class="text text-center">
        <h3 class="mb-4">${title}</h3>
        <p class="mb-5">
            ${description}
        </p>
        <%-- TODO faire un content template--%>
        <p><a class="btn btn-primary btn-sm px-3 py-2" href="${quiz}"><fmt:message key="label.read_more"/></a></p>
    </div>
</div>