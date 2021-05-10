import { useState, useEffect } from "react";

const appendScript = (baseUrl, setScriptLoaded) => {
    if (window.MktoForms2) return setScriptLoaded(true);

    const script = document.createElement("script");
    script.src = `${baseUrl}/js/forms2/js/forms2.min.js`;
    script.onload = () => (window.MktoForms2 ? setScriptLoaded(true) : null);
    document.body.appendChild(script);
}

const useMarketo = ({ baseUrl, munchkinId, formId, callback, whenReadyCallback,handleSuccess }) => {
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        if (!(baseUrl && munchkinId && formId))
            return "Fill the fields and a form should appear";

        if (scriptLoaded) {
            window.MktoForms2.loadForm(baseUrl, munchkinId, formId, callback);
            window.MktoForms2.whenReady( whenReadyCallback );

            return;
        }
        appendScript(baseUrl, setScriptLoaded);
    }, [scriptLoaded, baseUrl, munchkinId, formId, callback,handleSuccess]);
}

export default useMarketo;