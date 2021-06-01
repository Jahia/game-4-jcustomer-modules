package org.jahia.se.modules.game.quiz.initializers.jExperience;

import org.apache.jackrabbit.value.StringValue;
import org.jahia.modules.jexperience.admin.ContextServerService;
import org.jahia.services.content.JCRNodeWrapper;
import org.jahia.services.content.decorator.JCRSiteNode;
import org.jahia.services.content.nodetypes.ExtendedPropertyDefinition;
import org.jahia.services.content.nodetypes.initializers.ChoiceListValue;
import org.jahia.services.content.nodetypes.initializers.ModuleChoiceListInitializer;
import org.json.JSONException;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.RepositoryException;
import java.util.*;

@Component(service = ModuleChoiceListInitializer.class, immediate = true)
public class JExpProfileCardsInitializer implements ModuleChoiceListInitializer {
    private static final Logger logger = LoggerFactory.getLogger(JExpProfileCardsInitializer.class);

    private String key="jExpProfileCardsInitializer";
    private ContextServerService contextServerService;

    @Reference(service= ContextServerService.class)
    public void setContextServerService(ContextServerService contextServerService) {
        this.contextServerService = contextServerService;
    }

    @Override
    public List<ChoiceListValue> getChoiceListValues(ExtendedPropertyDefinition epd, String param, List<ChoiceListValue> values, Locale locale, Map<String, Object> context) {
        List<ChoiceListValue> choiceListValues = new ArrayList<>();

        try {
            JCRNodeWrapper node = (JCRNodeWrapper)
                    ((context.get("contextParent") != null)
                            ? context.get("contextParent")
                            : context.get("contextNode"));

            JCRSiteNode site = node.getResolveSite();
            Utils utils = new Utils(site,contextServerService);
            TreeSet<String> cardNames = utils.getCardNames();
            cardNames.forEach(cardName -> choiceListValues.add(new ChoiceListValue(cardName, null, new StringValue(cardName))));

        } catch (RepositoryException | JSONException e){
            logger.error("Error happened", e);
        }

        return choiceListValues;
    }
    @Override
    public void setKey(String key) {
        this.key = key;
    }

    @Override
    public String getKey() {
        return key;
    }
}
