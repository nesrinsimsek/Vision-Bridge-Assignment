// Asynchronously loads multiple YAML files given by their URLs
async function loadYAMLFiles(urls) {
    // Fetches all YAML files in parallel, parses them, and extracts priority and actions
    const configs = await Promise.all(
        urls.map(url =>
            fetch(url)
                .then(res => res.text()) // Gets raw text content from response
                .then(text => {
                    const config = jsyaml.load(text); // Parses YAML text into JS object
                    return {
                        priority: config.priority || 0, // Default priority to 0 if missing
                        actions: config.actions || [] // Default to empty actions array if missing
                    };
                })
        )
    );
    return configs; // Returns array of objects each containing priority and actions
}

// Applies a list of actions to the DOM
function applyActions(actions) {
    actions.forEach(action => {
        switch (action.type) {
           
            case "remove":
                // Removes all elements matching the selector(s)
                document.querySelectorAll(action.selector).forEach(el => el.remove());
                break;

            case "replace":
                // Normalizes selector to an array (if not already)
                const selectors = Array.isArray(action.selector) ? action.selector : [action.selector];

                selectors.forEach(selector => {
                    // For each matching selector element, replaces it with newElement parsed as DOM nodes
                    document.querySelectorAll(selector).forEach(el => {
                        const wrapper = document.createElement('div');
                        wrapper.innerHTML = action.newElement;

                        // Uses a DocumentFragment to efficiently move the new nodes into the DOM
                        const fragment = document.createDocumentFragment();
                        while (wrapper.firstChild) {
                            fragment.appendChild(wrapper.firstChild);
                        }

                        el.replaceWith(fragment);
                    });
                });
                break;

            case "insert":
                // Normalizes target to an array (if not already)
                const targets = Array.isArray(action.target) ? action.target : [action.target];

                targets.forEach(target => {
                    // For each matching target element, inserts new elements before or after
                    document.querySelectorAll(target).forEach(tar => {
                        const wrapper = document.createElement('div');
                        wrapper.innerHTML = action.element;

                        // Uses a DocumentFragment to efficiently move the new nodes into the DOM
                        const fragment = document.createDocumentFragment();
                        while (wrapper.firstChild) {
                            fragment.appendChild(wrapper.firstChild);
                        }

                        if (action.position === "after") {
                            tar.appendChild(fragment);
                        } else if (action.position === "before") {
                            tar.insertBefore(fragment, target.firstChild);
                        }
                    });
                });
                break;

            case "alter":
                // Walks through all text nodes in the body and replaces oldValue with newValue
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
                while (walker.nextNode()) {
                    const node = walker.currentNode;
                    node.nodeValue = node.nodeValue.replaceAll(action.oldValue, action.newValue);
                }
                break;
        }
    });
}

// Loads multiple YAML files, sorts by priority ascending, flattens all actions and applies them
loadYAMLFiles(['config1.yml', 'config2.yml']).then(results => {

    results.sort((a, b) => a.priority - b.priority);

    const allActions = results.flatMap(item => item.actions);

    applyActions(allActions);
    
});
