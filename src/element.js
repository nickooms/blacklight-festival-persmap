class Element {
	constructor() {}
	static fromString(string) {
		Element.element.innerHTML = string
		return Element.element.querySelector('*')
	}
	static get element() {
		if (Element._element == null) {
			Element._element = document.createElement('div')
		}
		return Element._element
	}
}