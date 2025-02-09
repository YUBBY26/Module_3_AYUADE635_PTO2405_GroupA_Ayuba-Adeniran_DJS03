// Importing the authors data from another file (data.js)
import { authors } from "./data.js";

// Defining the custom element 'BookPreview'
export class BookPreview extends HTMLElement {
    constructor() {
        super();
        // Attaching a shadow DOM to the custom element with "open" mode
        this.attachShadow({ mode: "open" });
    }
    connectedCallback() {
        this.render();
    }
  // This method is triggered when any observed attribute is changed  
    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }
    // Static method to define the attributes that the custom element will observe for changes
    static get observedAttributes() {
        return ['author', 'id', 'image', 'title'];
    }
// Render function that creates the HTML template for the component
render() {
    const author = this.getAttribute('author');
    const id = this.getAttribute('id');
    const image = this.getAttribute('image');
    const title = this.getAttribute('title');
    // Creating a new <template> element for the HTML structure
    const template = document.createElement('template');
    // Using the authors object to get the author name from the 'author' attribute
    const authorName = authors[author];

    // HTML structure for the component, with template literals to inject dynamic data
    template.innerHTML = `
<style>
    .preview {
  border-width: 0;
  width: 100%;
  font-family: Roboto, sans-serif;
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  text-align: left;
  border-radius: 8px;
  border: 1px solid rgba(var(--color-dark), 0.15);
  background: rgba(var(--color-light), 1);
}

@media (min-width: 60rem) {
  .preview {
    padding: 1rem;
  }
}

.preview_hidden {
  display: none;
}

.preview:hover {
  background: rgba(var(--color-blue), 0.05);
}

.preview__image {
  width: 48px;
  height: 70px;
  object-fit: cover;
  background: grey;
  border-radius: 2px;
  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.1), 0px 1px 3px 0px rgba(0, 0, 0, 0.1);
}

.preview__info {
  padding: 1rem;
}

.preview__title {
  margin: 0 0 0.5rem;
  font-weight: bold;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
  color: rgba(var(--color-dark), 0.8)
}

.preview__author {
  color: rgba(var(--color-dark), 0.4);
}
</style>
<button class='preview' data preview='${id}'>
<img class='preview-image' src='${image}' alt='${title}'/>
<div class='preview-info'>
  <h3 class='preview-title'>${title}</h3>
  <div class='preview-author'>By ${authorName}</div>

</div>


</button>
`;
// Clearing any existing content in the shadow DOM and adding the new template
this.shadowRoot.innerHTML = '';
this.shadowRoot.appendChild(template.content.cloneNode(true));
}
}