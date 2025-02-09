// Defining the custom element 'toggle-theme'
class ToggleTheme extends HTMLElement {
    // Lifecycle method that runs when the element is added to the DOM
    connectedCallback() {
        this.render();
    }
//Method to render the component's HTML and functionality
    render() {
    this.innerHTML = `
    <style>
        .toggle-theme {
        padding: 10px;
        background-color: var(--color-light);
        color: var(--color-dark);
        border: none;
        cursor: pointer;
        }
    </style>
    <button class='toggle-theme'>Toggle Theme</button>
    `;
    // Add event listener to toggle theme when button is clicked 
    this.querySelector('button').addEventListener('click', () => {
        // Toggle visibility of dark mode class
        const currentDark = getComputedStyle(document.documentElement).getPropertyValue('--color-dark').trim();
        const darkMode = currentDark === '255, 255, 255';
        
        // Toggle theme color scheme
        document.documentElement.style.setProperty('--color-dark', darkMode?  '10, 10, 20' : '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', darkMode?  '255, 255, 255' : '10, 10, 20');
    });
}
}
// define custom element
customElements.define('toggle-theme', ToggleTheme);