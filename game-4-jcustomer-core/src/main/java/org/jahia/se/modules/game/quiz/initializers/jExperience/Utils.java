package org.jahia.se.modules.game.quiz.initializers.jExperience;

import com.ning.http.client.AsyncCompletionHandler;
import com.ning.http.client.AsyncHttpClient;
import com.ning.http.client.ListenableFuture;
import com.ning.http.client.Response;
import org.jahia.modules.jexperience.admin.ContextServerService;
import org.jahia.services.content.decorator.JCRSiteNode;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Comparator;
import java.util.HashMap;
import java.util.TreeSet;
import java.util.concurrent.ExecutionException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class Utils {
    private static final Logger logger = LoggerFactory.getLogger(Utils.class);
    private ContextServerService contextServerService;
    private JCRSiteNode site;

//    @Reference(service= ContextServerService.class)
//    public void setContextServerService(ContextServerService contextServerService) {
//        this.contextServerService = contextServerService;
//    }

    public Utils(JCRSiteNode site,ContextServerService contextServerService){
        this.site=site;
        this.contextServerService = contextServerService;
    }

    public HashMap<String,String> getPropertyNames(String cardName) throws JSONException {
        JSONArray profileProperties = getProfileProperties ();
        return getPropertyNames(profileProperties,cardName);
    };

    public TreeSet<String> getCardNames() throws JSONException {
        JSONArray profileProperties = getProfileProperties ();
        return getCardNames(profileProperties);
    };

    private JSONArray getProfileProperties () {
        try {
            final AsyncHttpClient asyncHttpClient = contextServerService
                    .initAsyncHttpClient(site.getSiteKey());

            JSONArray profileProperties;

            if (asyncHttpClient != null) {
                AsyncHttpClient.BoundRequestBuilder requestBuilder = contextServerService
                        .initAsyncRequestBuilder(site.getSiteKey(), asyncHttpClient, "/cxs/profiles/properties",
                                true, true, true);

                ListenableFuture<Response> future = requestBuilder.execute(new AsyncCompletionHandler<Response>() {
                    @Override
                    public Response onCompleted(Response response) {
                        asyncHttpClient.closeAsynchronously();
                        return response;
                    }
                });

                JSONObject responseBody = new JSONObject(future.get().getResponseBody());
                profileProperties = responseBody.getJSONArray("profiles");
                return profileProperties;
            }

        }catch ( InterruptedException | ExecutionException | IOException | JSONException e) {
            logger.error("Error happened", e);
        }
        return null;
    };

    private HashMap<String,String> getPropertyNames(JSONArray profileProperties, String cardName) throws JSONException {
        HashMap<String,String> propertyNames= new HashMap<String,String>();
        for (int i = 0; i < profileProperties.length(); i++) {
            JSONObject property = profileProperties.getJSONObject(i);
            JSONObject metadata = property.getJSONObject("metadata");
            String propertyCardName = getCardName(property);
            boolean cardNameMatch = cardName.equals(propertyCardName);
            boolean multivalued = property.optBoolean("multivalued");

            if(!cardNameMatch)
                continue;

            if(multivalued)
                continue;

            String type = property.optString("type");
            String itemId = property.optString("itemId");
            String displayName = metadata.optString("name",itemId);

            propertyNames.put(itemId,displayName+"<"+type+">");
//            propertyNames.put(itemId,displayName);
        }

        return propertyNames;
    };

    private TreeSet<String> getCardNames(JSONArray profileProperties) throws JSONException {
        TreeSet<String> cardNames= new TreeSet<>(new Comparator<String>() {
            @Override
            public int compare(String s1, String s2) {
                return s1.trim().toUpperCase().compareTo(s2.trim().toUpperCase());
            }
        });
        for (int i = 0; i < profileProperties.length(); i++) {
            JSONObject property = profileProperties.getJSONObject(i);
            String cardName = getCardName(property);
            if(!cardName.isEmpty())
                cardNames.add(cardName);
        }
        return cardNames;
    };

    private String getCardName(JSONObject property) throws JSONException {
        JSONObject metadata = property.getJSONObject("metadata");
        JSONArray systemTags = metadata.optJSONArray("systemTags");

        logger.debug("systemTags.toString() : "+systemTags.toString());

        Pattern cardPattern = Pattern.compile("\"cardDataTag/(\\w+)/(\\d{1,2}(?:\\.\\d{1,2})?)/(.*?)\"");
        Matcher matcher = cardPattern.matcher(systemTags.toString());
        //matcher.group(1) = cardId (String);
        //matcher.group(2) = cardIndex (String);
        //matcher.group(3) = cardName (String);
        String cardName = "";
        if (matcher.find())
            cardName = matcher.group(3);

        logger.debug("cardName : "+cardName);
        return cardName;
    };
}
