package org.jahia.se.modules.game.quiz.rules;

import org.jahia.services.content.rules.ModuleGlobalObject;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(service = ModuleGlobalObject.class, immediate = true)
public class ScoreAsUserPropertyModuleObject extends ModuleGlobalObject {
    @Reference(service = ScoreAsUserProperty.class)
    public void setCU_UserProperty(ScoreAsUserProperty scoreAsUserProperty) {
        getGlobalRulesObject().put("scoreAsUserProperty", scoreAsUserProperty);
    }
}