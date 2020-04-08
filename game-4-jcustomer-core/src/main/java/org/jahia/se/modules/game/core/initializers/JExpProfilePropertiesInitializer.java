package org.jahia.se.modules.game.core.initializers;


import org.jahia.modules.jexperience.admin.internal.HttpUtils;
import org.jahia.services.content.JCRPropertyWrapper;
import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;
import org.jahia.services.content.nodetypes.ValueImpl;
import org.jahia.services.content.nodetypes.initializers.ChoiceListValue;
import org.jahia.services.content.nodetypes.initializers.ModuleChoiceListInitializer;
import org.jahia.services.content.nodetypes.renderer.AbstractChoiceListRenderer;
import org.jahia.services.content.nodetypes.renderer.ModuleChoiceListRenderer;
import org.jahia.services.render.RenderContext;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.PropertyType;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import java.util.*;

import org.jahia.modules.jexperience.admin.internal.ContextServerSettings;
import org.jahia.modules.jexperience.admin.internal.ContextServerSettingsService;
import org.jahia.modules.jexperience.admin.JExperienceConfigFactory;

import org.apache.http.HttpEntity;
import org.apache.http.util.EntityUtils;
import org.jahia.services.content.JCRNodeWrapper;

import java.io.IOException;
//name = "jExpProfilePropertiesInitializer",
@Component(service = ModuleChoiceListInitializer.class, immediate = true)

public class JExpProfilePropertiesInitializer  extends AbstractChoiceListRenderer implements ModuleChoiceListInitializer, ModuleChoiceListRenderer {
    private static final Logger logger = LoggerFactory.getLogger(JExpProfilePropertiesInitializer.class);

    private ContextServerSettingsService contextServerSettingsService;

    @Reference(service=ContextServerSettingsService.class)
    public void setContextServerSettingsService(ContextServerSettingsService contextServerSettingsService) {
        this.contextServerSettingsService = contextServerSettingsService;
    }

    private String key="jExpProfilePropertiesInitializer";
//    private String key;

    /**
     * {@inheritDoc}
     */
    public List<ChoiceListValue> getChoiceListValues(ExtendedPropertyDefinition epd, String param, List<ChoiceListValue> values,
                                                     Locale locale, Map<String, Object> context){

        //Create the list of ChoiceListValue to return
        List<ChoiceListValue> myChoiceList = new ArrayList<ChoiceListValue>();

        if (context == null) {
            return myChoiceList;
        }

        logger.info("epd : "+epd);
        logger.info("param : "+param);
        logger.info("values : "+values);
        logger.info("context : "+context);
        JCRNodeWrapper node = (JCRNodeWrapper) context.get("contextParent");
        String siteKey=null;

        try{
            siteKey = node.getResolveSite().getSiteKey();
        }catch (RepositoryException e){
            logger.error("getResolveSite with node: "+node+" throws a RepositoryException : "+e);
        }

        logger.info("siteKey : "+siteKey);


//        HashMap<String, Object> myPropertiesMap = null;

        //#1 Get all jExperiences properties optimization -> ask for card ? then display attribute of this card...
        //#2 get id and name of properties and loop over the results
        myChoiceList.add(new ChoiceListValue("name","id"));
        //externalLink
//        myPropertiesMap = new HashMap<String, Object>();
//        myPropertiesMap.put("addMixin","game4mix:externalVideoLink");
//        myChoiceList.add(new ChoiceListValue("external",myPropertiesMap,new ValueImpl("tata", PropertyType.STRING, false)));
//
//        //internalLink
//        myPropertiesMap = new HashMap<String, Object>();
//        myPropertiesMap.put("addMixin","game4mix:internalVideoLink");
//        myChoiceList.add(new ChoiceListValue("internal",myPropertiesMap,new ValueImpl("internal", PropertyType.STRING, false)));

        //Return the list
        return myChoiceList;
    }

    /**
     * {@inheritDoc}
     */
    public void setKey(String key) {
        this.key = key;
    }

    /**
     * {@inheritDoc}
     */
    public String getKey() {
        return key;
    }

    /**
     * {@inheritDoc}
     */
    public String getStringRendering(RenderContext context, JCRPropertyWrapper propertyWrapper) throws RepositoryException {
        final StringBuilder sb = new StringBuilder();

        if (propertyWrapper.isMultiple()) {
            sb.append('{');
            final Value[] values = propertyWrapper.getValues();
            for (Value value : values) {
                sb.append('[').append(value.getString()).append(']');
            }
            sb.append('}');
        } else {
            sb.append('[').append(propertyWrapper.getValue().getString()).append(']');
        }

        return sb.toString();
    }

    /**
     * {@inheritDoc}
     */
    public String getStringRendering(Locale locale, ExtendedPropertyDefinition propDef, Object propertyValue) throws RepositoryException {
        return "[" + propertyValue.toString() + "]";
    }

    private String getProperties(String siteKey) throws IOException {
        ContextServerSettings contextServerSettings = contextServerSettingsService.getSettings(siteKey);
        if (contextServerSettings != null) {
            HttpEntity entity = HttpUtils.executeGetRequest(contextServerSettings.getAdminHttpClient(), contextServerSettings.getContextServerURL() + "/cxs/rules/" + formMappingID, null, null);
            //Pkoi pas retourner un JSONObject?
            if (entity != null) {
                String json = EntityUtils.toString(entity);
                EntityUtils.consume(entity);
                return json;
            }
        }
        return null;
    }
}
