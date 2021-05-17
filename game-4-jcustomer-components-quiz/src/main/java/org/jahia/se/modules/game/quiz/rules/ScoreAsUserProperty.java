package org.jahia.se.modules.game.quiz.rules;

//import org.jahia.services.content.rules.BackgroundAction;
import com.ning.http.client.AsyncCompletionHandler;
import com.ning.http.client.AsyncHttpClient;
import com.ning.http.client.ListenableFuture;
import com.ning.http.client.Response;
import org.apache.http.HttpEntity;
import org.apache.http.util.EntityUtils;
import org.jahia.services.content.decorator.JCRSiteNode;
import org.jahia.services.content.rules.AddedNodeFact;
//import org.jahia.services.content.rules.PublishedNodeFact;
//import java.lang.reflect.Method;
//import org.quartz.SchedulerException;

//import org.jahia.modules.jexperience.admin.ContextServerService;
//import org.jahia.modules.jexperience.admin.JExperienceConfigFactory;
//import org.apache.http.HttpEntity;
//import org.apache.http.util.EntityUtils;

import org.jahia.services.content.rules.ChangedPropertyFact;
import org.jahia.modules.jexperience.admin.ContextServerService;
import org.json.JSONObject;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import java.io.IOException;
import java.util.concurrent.ExecutionException;

@Component(service = ScoreAsUserProperty.class, immediate = true)
public class ScoreAsUserProperty {
    private static final Logger logger = LoggerFactory.getLogger(ScoreAsUserProperty.class);
    private String key="scoreAsUserProperty";
    private ContextServerService contextServerService;

//    private JExperienceConfigFactory contextServerSettingsService;
//    private CreateOrUpdateUserProperties myRuleService;
//
//    public void setCreateOrUpdateUserProperties(CreateOrUpdateUserProperties myRuleService) {
//
//        this.myRuleService = myRuleService;
//
//    }

    @Reference(service=ContextServerService.class)
    public void setContextServerService(ContextServerService contextServerService) {
        this.contextServerService = contextServerService;
    }

    public void executeActionNow(ChangedPropertyFact propertyFact) throws RepositoryException {

        final String PROPERTIES_PATH= "/cxs/profiles/properties";
        String jExpPropertyId = propertyFact.getValue().toString();
        String path = PROPERTIES_PATH+"/"+jExpPropertyId;
        JCRSiteNode site = propertyFact.getNode().getNode().getResolveSite();

        String item = getItem(contextServerService,site,path);




        logger.info("**** jExpPropertyId : "+jExpPropertyId);

//        AbstractNodeFact node = (AbstractNodeFact) node.;
//        JCRNodeWrapper jcrNodeWrapper = node.getNode();

        //Get value game4:jExpPropertyId
//        String jExpPropertyId = jcrNodeWrapper.getProperty(PROPERTY_ID).getString();
        //Request jCustomer to see if exist
        //TODO quid du copy/past? l'id sera copié et la valeur maj alors que je veux peut plutot en créer un...
        //Le mieux serait peut etre une Initializer qui call jCustomer pour avoir la liste des properties!!!
        //If doesn't exist POST new propertie to jCustomer
        //If exist update the name

//        game4:jExpPropertyName (string) indexed=no
//          game4:jExpPropertyId (string) hidden indexed=no


//        Method[] methods = node.getClass().getMethods();
//        for (int i = 0; i < methods.length; i++) {
//            logger.info("public method: " + methods[i]);
//        }
//        logger.info("executeActionNow ! ");
//        logger.info("class node : "+node.getClass());
//        logger.info("class myNode : "+myNode.getClass());
//        logger.info("class node.getNode() : "+myNode.getNode().getPath());
//        logger.info("class node.getNode() : "+myNode.getNode().getClass());
    }


    private static String getItem(ContextServerService contextServerService, JCRSiteNode site, String path){
        String responseString = null;
        try{
            final AsyncHttpClient asyncHttpClient = contextServerService
                    .initAsyncHttpClient(site.getSiteKey());

            if (asyncHttpClient != null) {
                AsyncHttpClient.BoundRequestBuilder requestBuilder = contextServerService
                        .initAsyncRequestBuilder(site.getSiteKey(), asyncHttpClient, path,
                                true, true, true);

                ListenableFuture<Response> future = requestBuilder.execute(new AsyncCompletionHandler<Response>() {
                    @Override
                    public Response onCompleted(Response response) {
                        asyncHttpClient.closeAsynchronously();
                        return response;
                    }
                });

                responseString = future.get().getResponseBody();
            }

        }catch (IOException | ExecutionException | InterruptedException e){
            logger.error("Error happened", e);
        }

        return responseString;
    };

    private static void registerItem(ContextServerService contextServerService, JCRSiteNode site, String path) {
        String json = "";
        String response="0";
//        public static String post(String url, String json, Long timeOut, TimeUnit timeUnit, String charset) {
//            Future<Response> f = null;
//            try (AsyncHttpClient asyncHttpClient = new AsyncHttpClient()) {
//                AsyncHttpClient.BoundRequestBuilder builder = asyncHttpClient.preparePost(url);
//                builder.setBodyEncoding(StandardCharsets.UTF_8.name()).setBody(json);
//                return (f = builder.execute()).get(timeOut == null ? DEFEAT_TIMEOUT : timeOut,
//                        timeUnit == null ? DEFEAT_UNIT : timeUnit)
//                        .getResponseBody(charset == null ? StandardCharsets.UTF_8.name() : charset);
//            } catch (Exception e) {
//                _log.error(ExceptionUtils.errorInfo(e));
//                throw new RuntimeException(e);
//            } finally {
//                if (f != null) f.cancel(true);
//            }
//        }





        try{
            final AsyncHttpClient asyncHttpClient = contextServerService
                    .initAsyncHttpClient(site.getSiteKey());

            if (asyncHttpClient != null) {
                AsyncHttpClient.BoundRequestBuilder requestBuilder = contextServerService
                        .initAsyncRequestBuilder(site.getSiteKey(), asyncHttpClient, path,
                                false, true, true);

                ListenableFuture<Response> future = requestBuilder.execute(new AsyncCompletionHandler<Response>() {
                    @Override
                    public Response onCompleted(Response response) {
                        asyncHttpClient.closeAsynchronously();
                        return response;
                    }
                });

                response = future.post().getResponseBody();
            }
            logger.info("Item registered on Apache Unomi, on path {} and json {}", path, json);
        }catch (IOException | ExecutionException | InterruptedException e){
            logger.error("Error happened", e);
        }
        return response
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

