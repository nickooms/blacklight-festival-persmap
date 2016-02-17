class SVG extends Element {
	constructor() {
		super()
	}
	static get namespace() { return 'http://www.w3.org/2000/svg' }
	static create(name, attrs) {
		let element = document.createElementNS(SVG.namespace, name)
		for (let attr in attrs) {
			element.setAttribute(attr, attrs[attr])
		}
		return element
	}
	static Layer(x) {
		let id = `group${x.hash}`,
			name = x.name,
			display = x.display ? 'visible' : 'hidden',
			attrs = { id, name, display },
			g = SVG.create('g', attrs);
			x.children.map(SVG.Group).forEach(group => g.appendChild(group));
		//console.log(x.children);
		return g;
	}
	static Group(x) {
		let id = `group${x.hash}`,
			attrs = { id },
			g = SVG.create('g', attrs);
		x.children.map(SVG.GroupOrPath).forEach(gop => g.appendChild(gop));
		/*x.children.forEach(p => p.addEventListener('click', function(evt) {
			console.log(6666666)
		}, true);*/
		return g;
	}
	static GroupOrPath(x) {
		switch (x.T) {
			case 'Group':
				return SVG.Group(x)
			case 'Path':
				return SVG.Path(x)
			default:
				break;
		}
	}
	static Path(x) {
		let properties = ['fill', 'fill-rule', 'stroke', 'stroke-width'],
			id = `path${x.hash}`,
			d = x.d,
			cursor = 'pointer',
			bbox = getBBOX(x);
		bboxTotal.add(bbox.min);
		bboxTotal.add(bbox.max);
		let width = parseFloat(bbox.width.toFixed(0)),
			height = parseFloat(bbox.height.toFixed(0)),
			attrs = { id, d, cursor, width, height };
		for (var j = 0; j < properties.length; j++) {
			var propertyName = properties[j],
				property = x[propertyName];
			if (property)	{
				if (!propertyValues.has(propertyName)) {
					propertyValues.set(propertyName, new Set());
				}
				propertyValues.get(propertyName).add(property)
				//if (propertyName === 'stroke-width' && property === '0.5') property = '0.1';
				//s += `${propertyName}="${property}" `;
				attrs[propertyName] = property;
			}
		}
		let path = SVG.create('path', attrs);
		widths.add(width);
		heights.add(height);
		return path;
	}
}