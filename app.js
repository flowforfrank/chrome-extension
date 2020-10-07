const populateIngredients = (response) => {
    document.querySelector('.recipe-name').innerText = response.recipeName;

    const ingredientsList = document.querySelector('.ingredients');

    response.ingredients.forEach(ingredient => {
        const listItem = document.createElement('li');
        const checkbox = document.createElement('input');

        checkbox.type = 'checkbox';

        listItem.appendChild(checkbox);
        listItem.appendChild(document.createTextNode(ingredient));

        ingredientsList.appendChild(listItem);
    });

    document.querySelector('.import').classList.add('hidden');
    document.querySelector('.clear').classList.remove('hidden');

    chrome.storage.sync.set({ response }, () => {});
}

chrome.tabs.getSelected(null, tab => {
    if (tab.url.includes('tasty.co/recipe')) {
        document.querySelector('.disclaimer').classList.add('hidden');
        document.querySelector('.clear').classList.add('hidden');
        document.querySelector('.shopping-list').classList.remove('hidden');

        chrome.storage.sync.get(['response'], (result) => {
            populateIngredients(result.response);
        });

        document.querySelector('.import').addEventListener('click', () => {
            chrome.tabs.sendMessage(tab.id, { action: 'fetchIngredients' }, response => {
                populateIngredients(response);
            });
        });

        document.querySelector('.clear').addEventListener('click', () => {
            chrome.storage.sync.clear();

            document.querySelector('.disclaimer').classList.remove('hidden');
            document.querySelector('.shopping-list').classList.add('hidden');
        });

        document.querySelector('.ingredients').addEventListener('click', e => {
            if (e.target.nodeName === 'INPUT') {
                if (e.target.checked) {
                    e.target.parentElement.classList.add('checked');
                } else {
                    e.target.parentElement.classList.remove('checked');
                }
            }
        });
    }
});