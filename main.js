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

                    const parent = el.parentNode;
                    const children = Array.from(wrapper.childNodes);

                    children.forEach(child => {
                        parent.insertBefore(child, el);
                    });

                    el.remove();
                });
                break;

            case "insert":
                const target = document.querySelector(action.target);
                if (!target) return;

                const temp = document.createElement('div');
                temp.innerHTML = action.element;

                const children = Array.from(temp.childNodes);

                if (action.position === "after") {
                    children.forEach(child => {
                        target.appendChild(child);
                    });
                } else if (action.position === "before") {
                    children.reverse().forEach(child => {
                        target.insertBefore(child, target.firstChild);
                    });
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
