package org.jahia.se.modules.game.core.rules;

import org.drools.core.spi.KnowledgeHelper;
import org.jahia.registries.ServicesRegistry;
//import org.jahia.services.content.rules.BackgroundAction;
import org.jahia.services.content.rules.NodeFact;
//import org.jahia.services.content.rules.PublishedNodeFact;

//import org.quartz.SchedulerException;

import org.json.JSONObject;
import org.json.JSONException;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;

@Component(service = CU_UserProperty.class, immediate = true)
public class CU_UserProperty{

    private static final Logger logger = LoggerFactory.getLogger(CU_UserProperty.class);
//    private String key="createOrUpdateUserProperties";

//    private CreateOrUpdateUserProperties myRuleService;
//
//    public void setCreateOrUpdateUserProperties(CreateOrUpdateUserProperties myRuleService) {
//
//        this.myRuleService = myRuleService;
//
//    }

    public void executeActionNow(NodeFact node){
//        game4:jExpPropertyName (string) indexed=no
//          game4:jExpPropertyId (string) hidden indexed=no
        //Get value game4:jExpPropertyId
        String jExpPropertyId =
        logger.info("executeActionNow ! ");
    }

//    public void executeActionNow(NodeFact node,KnowledgeHelper drools) throws JSONException{
//
////        JSONObject o = new JSONObject(properties);
////        logger.info("properties : "+node.getNode().getProperty("game4:jExpPropertyName").getString());
//        logger.info("executeActionNow ! ");
//    }

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

