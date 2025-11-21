document.addEventListener('DOMContentLoaded', () => {
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('original-data').textContent = JSON.stringify(data, null, 2);
            const form = document.getElementById('admin-form');
            buildForm(form, data);
        });

    document.getElementById('save-button').addEventListener('click', () => {
        const formData = getFormData();
        const jsonString = JSON.stringify(formData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'data.json';
        a.click();
        URL.revokeObjectURL(url);
    });
});

function buildForm(parent, data, parentKey = '') {
    for (const key in data) {
        const currentKey = parentKey ? `${parentKey}.${key}` : key;
        const section = document.createElement('div');
        section.classList.add('form-section');
        const title = document.createElement('h2');
        title.textContent = key;
        section.appendChild(title);

        if (Array.isArray(data[key])) {
            data[key].forEach((item, index) => {
                const arrayItem = document.createElement('div');
                arrayItem.classList.add('array-item');
                arrayItem.dataset.key = key;
                arrayItem.dataset.index = index;
                buildObjectForm(arrayItem, item, `${currentKey}.${index}`);
                section.appendChild(arrayItem);
            });
            const addButton = document.createElement('button');
            addButton.textContent = `Add to ${key}`;
            addButton.classList.add('btn', 'btn-add');
            addButton.type = 'button';
            addButton.addEventListener('click', () => {
                const newItem = {};
                if (data[key].length > 0) {
                    const firstItem = data[key][0];
                    for(const prop in firstItem) {
                        newItem[prop] = '';
                    }
                }
                data[key].push(newItem);
                const arrayItem = document.createElement('div');
                arrayItem.classList.add('array-item');
                arrayItem.dataset.key = key;
                arrayItem.dataset.index = data[key].length - 1;
                buildObjectForm(arrayItem, newItem, `${currentKey}.${data[key].length - 1}`);
                section.insertBefore(arrayItem, addButton);
            });
            section.appendChild(addButton);
        } else if (typeof data[key] === 'object' && data[key] !== null) {
            buildObjectForm(section, data[key], currentKey);
        } else {
            const formGroup = document.createElement('div');
            formGroup.classList.add('form-group');
            const label = document.createElement('label');
            label.textContent = key;
            const input = document.createElement('input');
            input.type = 'text';
            input.name = currentKey;
            input.value = data[key];
            formGroup.appendChild(label);
            formGroup.appendChild(input);
            section.appendChild(formGroup);
        }
        parent.appendChild(section);
    }
}

function buildObjectForm(parent, obj, parentKey) {
    for (const prop in obj) {
        const currentKey = `${parentKey}.${prop}`;
        const formGroup = document.createElement('div');
        formGroup.classList.add('form-group');
        const label = document.createElement('label');
        label.textContent = prop;
        
        let input;
        if (Array.isArray(obj[prop])) {
            input = document.createElement('textarea');
            input.value = JSON.stringify(obj[prop], null, 2);
        } else if (typeof obj[prop] === 'object' && obj[prop] !== null) {
            input = document.createElement('div');
            buildObjectForm(input, obj[prop], currentKey);
        }
        else {
            input = document.createElement('input');
            input.type = 'text';
            input.value = obj[prop];
        }

        input.name = currentKey;
        formGroup.appendChild(label);
        formGroup.appendChild(input);
        parent.appendChild(formGroup);
    }
}

function getFormData() {
    const form = document.getElementById('admin-form');
    const data = {};

    function setDataByPath(obj, path, value) {
        const keys = path.split('.');
        let current = obj;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            const nextKey = keys[i+1];
            const isNextKeyNumeric = !isNaN(parseInt(nextKey, 10));

            if (isNextKeyNumeric) {
                if (!current[key]) {
                    current[key] = [];
                }
            } else {
                if (!current[key]) {
                    current[key] = {};
                }
            }
            current = current[key];
        }
        current[keys[keys.length - 1]] = value;
    }

    form.querySelectorAll('input[type="text"], textarea').forEach(input => {
        try {
            setDataByPath(data, input.name, JSON.parse(input.value));
        } catch (e) {
            setDataByPath(data, input.name, input.value);
        }
    });

    // Reconstruct the original structure
    const originalData = JSON.parse(document.getElementById('original-data').textContent);
    const finalData = {};
    for (const key in originalData) {
        finalData[key] = data[key];
    }

    return finalData;
}