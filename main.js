async function loadYAMLFiles(urls) {
    const results = await Promise.all(
        urls.map(url =>
            fetch(url)
                .then(res => res.text())
                .then(text => jsyaml.load(text))
        )
    );
    return results.flatMap(config => config.actions || []);
}

function applyActions(actions) {


    actions.forEach(action => {
        switch (action.type) {
            case "remove":
                document.querySelectorAll(action.selector).forEach(el => el.remove());
                break;

            case "replace":
                document.querySelectorAll(action.selector).forEach(el => {
                    const wrapper = document.createElement('div');
                    wrapper.innerHTML = action.newElement;

                    const fragment = document.createDocumentFragment();
                    while (wrapper.firstChild) {
                        fragment.appendChild(wrapper.firstChild);
                    }

                    el.replaceWith(fragment);
                });
                break;

            case "insert":
                const target = document.querySelector(action.target);
                if (!target) return;
                const wrapper = document.createElement('div');
                wrapper.innerHTML = action.element;

                const fragment = document.createDocumentFragment();
                while (wrapper.firstChild) {
                    fragment.appendChild(wrapper.firstChild);
                }

                if (action.position === "after") {
                    target.appendChild(fragment);
                } else if (action.position === "before") {
                    target.insertBefore(fragment, target.firstChild);
                }
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


loadYAMLFiles(['config1.yml']).then(applyActions);
