async function loadYAMLFiles(urls) {
    const configs = await Promise.all(
        urls.map(url =>
            fetch(url)
                .then(res => res.text())
                .then(text => {
                    const config = jsyaml.load(text);
                    return {
                        priority: config.priority || 0,
                        actions: config.actions || []
                    };
                })
        )
    );
    return configs;
}

function applyActions(actions) {
    actions.forEach(action => {
        switch (action.type) {
           
            case "remove":
                document.querySelectorAll(action.selector).forEach(el => el.remove());
                break;

            case "replace":
                const selectors = Array.isArray(action.selector) ? action.selector : [action.selector];

                selectors.forEach(selector => {
                    document.querySelectorAll(selector).forEach(el => {
                        const wrapper = document.createElement('div');
                        wrapper.innerHTML = action.newElement;

                        const fragment = document.createDocumentFragment();
                        while (wrapper.firstChild) {
                            fragment.appendChild(wrapper.firstChild);
                        }

                        el.replaceWith(fragment);
                    });
                });
                break;

            case "insert":
                const targets = Array.isArray(action.target) ? action.target : [action.target];

                targets.forEach(target => {
                    document.querySelectorAll(target).forEach(tar => {
                        const wrapper = document.createElement('div');
                        wrapper.innerHTML = action.element;

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
                const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
                while (walker.nextNode()) {
                    const node = walker.currentNode;
                    node.nodeValue = node.nodeValue.replaceAll(action.oldValue, action.newValue);
                }
                break;
        }
    });
}

loadYAMLFiles(['config1.yml', 'config2.yml']).then(results => {

    results.sort((a, b) => b.priority - a.priority);

    const allActions = results.flatMap(item => item.actions);

    applyActions(allActions);
    
});
