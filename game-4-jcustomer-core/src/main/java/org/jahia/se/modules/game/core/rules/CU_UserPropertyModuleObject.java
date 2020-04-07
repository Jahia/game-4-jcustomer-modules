package org.jahia.se.modules.game.core.rules;

import org.jahia.se.modules.game.core.rules.CU_UserProperty;
import org.jahia.services.content.rules.ModuleGlobalObject;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;

@Component(service = ModuleGlobalObject.class, immediate = true)
public class CU_UserPropertyModuleObject extends ModuleGlobalObject {
    @Reference(service = CU_UserProperty.class)
    public void setCU_UserProperty(CU_UserProperty cU_UserProperty) {
        getGlobalRulesObject().put("cU_UserProperty", cU_UserProperty);
    }
}