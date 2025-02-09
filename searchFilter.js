class SearchFilter extends HTMLElement {
    // Called when the element is added to the DOM
    connectedCallback() {
        this.render();
    }

    render() {
        // Get the 'options' attribute from the element and parse it as JSON
        const optionsJson = this.getAttribute('options');
        const defaultOption = this.getAttribute('default-option') || 'select an option';
        
        
        let optionsObject;
        try {
           optionsObject = JSON.parse(optionsJson); // Parse the options JSON string into an object
        } catch (error) {
            console.error('Invalid JSON in options attribute:', optionsJson);
            optionsJson = '{}'; // Default to an empty object in case of an error
        }
    
    // Set the innerHTML of the custom element
    this.innerHTML = `
    <style>
    select {
        padding: 5px;
        margin: 5px;
    }
    </style>
    <select>
        <option value='any'>${defaultOption}</option>
        ${Object.entries(optionsObject).map(([id, name]) => `<option value='${id}'>${name}</option>`).join('')}

    </select>
    `;
    }
}
// Define custom element 
customElements.define('search-filter', SearchFilter);