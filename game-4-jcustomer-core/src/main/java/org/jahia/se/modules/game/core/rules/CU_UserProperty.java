package org.jahia.se.modules.game.core.rules;

import org.drools.core.spi.KnowledgeHelper;
import org.jahia.registries.ServicesRegistry;
//import org.jahia.services.content.rules.BackgroundAction;
import org.jahia.services.content.rules.AbstractNodeFact;
import org.jahia.services.content.rules.NodeFact;
import org.jahia.services.content.JCRNodeWrapper;
//import org.jahia.services.content.rules.PublishedNodeFact;
//import java.lang.reflect.Method;
//import org.quartz.SchedulerException;

//import org.jahia.modules.jexperience.admin.ContextServerService;
//import org.jahia.modules.jexperience.admin.JExperienceConfigFactory;
//import org.apache.http.HttpEntity;
//import org.apache.http.util.EntityUtils;

import org.json.JSONObject;
import org.json.JSONException;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

import javax.jcr.RepositoryException;

@Component(service = CU_UserProperty.class, immediate = true)
public class CU_UserProperty{

    private static final Logger logger = LoggerFactory.getLogger(CU_UserProperty.class);
//    private ContextServerService contextServerService;
//    private JExperienceConfigFactory contextServerSettingsService;
//    private String key="createOrUpdateUserProperties";

//    private CreateOrUpdateUserProperties myRuleService;
//
//    public void setCreateOrUpdateUserProperties(CreateOrUpdateUserProperties myRuleService) {
//
//        this.myRuleService = myRuleService;
//
//    }

    public void executeActionNow(NodeFact node){
//        final String PROPERTY_ID = "game4:jExpPropertyId";
//        final String PROPERTY_NAME = "game4:jExpPropertyName";
//
//        AbstractNodeFact node = (AbstractNodeFact) node;
//        JCRNodeWrapper jcrNodeWrapper = node.getNode();
//
//        //Get value game4:jExpPropertyId
//        String jExpPropertyId = jcrNodeWrapper.getProperty(PROPERTY_ID).getString();
//        //Request jCustomer to see if exist
//        //TODO quid du copy/past? l'id sera copié et la valeur maj alors que je veux peut plutot en créer un...
//        //Le mieux serait peut etre une Initializer qui call jCustomer pour avoir la liste des properties!!!
//        //If doesn't exist POST new propertie to jCustomer
//        //If exist update the name
//
////        game4:jExpPropertyName (string) indexed=no
////          game4:jExpPropertyId (string) hidden indexed=no
//
//
////        Method[] methods = node.getClass().getMethods();
////        for (int i = 0; i < methods.length; i++) {
////            logger.info("public method: " + methods[i]);
////        }
//        logger.info("executeActionNow ! ");
//        logger.info("class node : "+node.getClass());
////        logger.info("class myNode : "+myNode.getClass());
////        logger.info("class node.getNode() : "+myNode.getNode().getPath());
////        logger.info("class node.getNode() : "+myNode.getNode().getClass());
    }

//TODO review this
//    private boolean createNewProperty(String siteKey, String json) throws IOException {
//        ContextServerSettings contextServerSettings = contextServerSettingsService.getSettings(siteKey);
//        if (contextServerSettings != null) {
//            EntityUtils.consume(
//                HttpUtils.executePostRequest(
//                    contextServerSettings.getAdminHttpClient(),
//                    contextServerSettings.getContextServerURL() + "/cxs/rules/",
//                    json,
//                    null,
//                    null
//                )
//            );
//            return true;
//        }
//        return false;
//    }
    //TODO review query to get property based on id
//    private String getProperty(String siteKey, String formMappingID) throws IOException {
//        ContextServerSettings contextServerSettings = contextServerSettingsService.getSettings(siteKey);
//        if (contextServerSettings != null) {
//            HttpEntity entity = HttpUtils.executeGetRequest(contextServerSettings.getAdminHttpClient(), contextServerSettings.getContextServerURL() + "/cxs/rules/" + formMappingID, null, null);
//    //Pkoi pas retourner un JSONObject?
//            if (entity != null) {
//                String json = EntityUtils.toString(entity);
//                EntityUtils.consume(entity);
//                return json;
//            }
//        }
//        return null;
//    }



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

