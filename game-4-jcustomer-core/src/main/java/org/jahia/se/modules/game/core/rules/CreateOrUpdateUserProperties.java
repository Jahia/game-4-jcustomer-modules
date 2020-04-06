package org.jahia.se.modules.game.core.rules;

import org.drools.core.spi.KnowledgeHelper;
import org.jahia.registries.ServicesRegistry;
import org.jahia.services.content.rules.BackgroundAction;
import org.jahia.services.content.rules.NodeFact;
import org.jahia.services.content.rules.PublishedNodeFact;
import org.quartz.SchedulerException;

import org.json.JSONObject;
import org.json.JSONException;
//import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;

//@Component(name = "createOrUpdateUserProperties", service = CreateOrUpdateUserProperties.class, immediate = true)
public class CreateOrUpdateUserProperties {

    private static final Logger logger = LoggerFactory.getLogger(CreateOrUpdateUserProperties.class);
//    private String key="createOrUpdateUserProperties";

//    private CreateOrUpdateUserProperties myRuleService;
//
//    public void setCreateOrUpdateUserProperties(CreateOrUpdateUserProperties myRuleService) {
//
//        this.myRuleService = myRuleService;
//
//    }

    public void executeActionNow(NodeFact node, final String properties,KnowledgeHelper drools) throws JSONException{
        JSONObject o = new JSONObject(properties);
        logger.info("properties : "+o.toString());
    }

//    public void executeActionNow(NodeFact node, final String actionToExecute, KnowledgeHelper drools) throws SchedulerException, RepositoryException {
//
//        final BackgroundAction action = ServicesRegistry.getInstance().getJahiaTemplateManagerService().getBackgroundActions().get(actionToExecute);
//
//        if (action != null) {
//            if (node instanceof PublishedNodeFact) {
//                if (((PublishedNodeFact) node).getNode().getProperty("j:published").getBoolean()) {
//                    action.executeBackgroundAction(((PublishedNodeFact) node).getNode());
//                }
//            }
//        }
//    }
}

