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

var

widths = new Set(),
heights = new Set(),
propertyValues = new Map(),
bboxTotal = new BBOX(),
polygon = [],

load = function() {
	var width = 1000,
		height = 750,
		viewBox = `0 0 ${width} ${height}`,
		version = '1.1',
		defs = `<defs>
	<style type="text/css">
		<![CDATA[
			path {
				cursor: pointer;
			}
			path:hover {
				stroke: #f00;
				/*stroke-width: 10;
				fill: #f00;*/
			}
		]]>
	</style>
</defs>`,
		svg = SVG.create('svg', { width, height, viewBox, version });
		/*svg = SVG.fromString(/*`<?xml version="1.0" standalone="no"?>
			<?xml-stylesheet type="text/css" href="style-svg.css"?>
			<?xml-stylesheet type="text/css" href="fluo.css"?>
			`<svg ${xmlns(SVG.namespace)} width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" version="1.1"></svg>`);*/
	//var div = $('div#svg');
	//console.log(svg);
	$('div#svg').appendChild(svg);
	Podium.map(SVG.Layer).forEach(x => svg.appendChild(x));
	//svg.innerHTML = defs;
	//createGroups(Podium).forEach(group => svg.appendChild(group));
	//$('div#svg').innerHTML = createSVG(Podium);
	initLayersList();
	initStylesList();
	rangeSlider();
	initMenuButton();
	var svg = $('svg');
	svg.style.width = '100%';
	svg.style.height = '100%';
	//$('div#svg').addEventListener('mousedown', mousedown, false);
	View.init();
	var bboxView = View.bbox();
	var view = new View(bboxView);
	view.use(svg);
	var zoomLeft = $('input#zoom-left');
	zoomLeft.min = view.left;
	zoomLeft.value = view.left;
	zoomLeft.max = view.right;
	var paths = [...$$('path')];
	//console.log(paths.length);
	//console.log(click);
	//var i = 0;
	paths.forEach(p => {
		//console.log(i++);
		//i++;
		//if (i < 10) console.dir(p);
		//p.addEventListener('mouseover', mouseover, false);
		//p.addEventListener('mouseout', mouseout, false);
		/*p.addEventListener('click', function(evt) {
			console.log(777);
		})*/
		/*p.onclick = function(evt) {
			console.log(888);
		}*/
	});
	[...$$('legend')].forEach(legend => {
		legend.addEventListener('click', clickLegend);
		[...$$('*', legend.parentNode)].filter(noLegends).forEach(child => toggleDisplay(child.style));
	});
	$('div#menu-overlay').addEventListener('click', hideMenu, false);
	//Podium A
	/*var polygons = `<polygon points="453.29,351.39 443.77,347.25 443.8,327.6 453.3,330.81 453.29,351.39" style="fill:black;"/>
		<polygon points="673.45,362.11 639.54,362.98 639.63,326.55 673.55,325.99 673.45,362.11" fill="${Fluo.Yellow}"/>
		<polygon points="638.71,362.92 621.95,358.55 622.03,323.47 638.97,326.33 638.71,362.92" fill="${Fluo.Blue}"/>
		<polygon points="603.39,363.9 568.28,364.8 568.54,216.11 603.7,216.49 603.39,363.9" fill="${Fluo.Pink}"/>
		<polygon points="567.44,364.82 531.7,365.73 531.9,215.95 567.04,216.2 567.44,364.82" fill="${Fluo.Yellow}"/>
		<polygon points="530.84,365.76 494.46,366.69 494.6,215.32 531.04,215.71 530.84,365.76" fill="${Fluo.Purple}"/>
		<polygon points="493.58,366.47 456.46,367.38 456.54,214.93 493.72,215.31 493.58,366.47" fill="${Fluo.Yellow}"/>
		<polygon points="451.92,367.77 451.92,214.88 455.73,214.91 455.65,367.68 451.92,367.77" fill="${Fluo.Orange}"/>
		<polygon points="372.83,369.75 369,369.89 368.95,213.98 372.78,214.04 372.83,369.75" fill="${Fluo.Green}"/>
		<polygon points="450.94,367.75 413.15,368.72 413.16,330.02 450.96,329.4 450.94,367.75" fill="${Fluo.Purple}"/>
		<polygon points="412.24,368.5 373.8,369.53 373.74,330.67 412.25,330.04 412.24,368.5" fill="${Fluo.Yellow}"/>
		<polygon points="368.02,369.87 328.73,370.87 328.64,213.55 367.32,213.95 368.02,369.87" fill="${Fluo.Orange}"/>
		<polygon points="327.78,370.65 287.74,371.67 287.58,213.11 327.7,213.54 327.78,370.65" fill="${Fluo.Yellow}"/>
		<polygon points="286.78,371.95 245.98,372.99 245.73,212.66 285.85,213.08 286.78,371.95" fill="${Fluo.Pink}"/>
		<polygon points="244.99,373.01 203.39,374.12 203.07,212.21 243.95,212.68 244.99,373.01" fill="${Fluo.Yellow}"/>
		<polygon points="158.99,375.21 115.77,376.31 115.6,334.95 158.89,334.2 158.99,375.21" fill="${Fluo.Blue}"/>
		<polygon points="163.91,369.7 160.09,375.03 159.87,333.43 163.58,330.07 163.91,369.7" fill="${Fluo.Orange}"/>
		<polygon points="451.06,291.27 413.16,291.78 413.18,176.13 451.12,176.85 451.06,291.27" fill="${Fluo.Purple}"/>
		<polygon points="412.25,291.54 373.73,291.83 373.75,174.49 412.27,175.29 412.25,291.54" fill="${Fluo.Blue}"/>`;*/
	//Podium B
	var polygons = ``;
	//$('svg').innerHTML += polygons;
	svg.addEventListener('click', function(evt) {
		var target = evt.target
		switch (target.tagName) {
			case 'path':
				click(target);
				break;
			case 'g':
				if (target.id === 'group-select-lines') {

				}
				break;
			default:
				break;
		}
	})
},

/*createSVG = function(layers) {
	var nsSVG = 'http://www.w3.org/2000/svg',
		ns = xmlns(nsSVG),
		w = 1000,
		h = 750,
		width = `width=${w.toFixed(3)}`,
		height = `height=${h.toFixed(3)}`,
		viewBox = `viewBox="0.0 0.0 ${w} ${h}"`,
		s = `<?xml version="1.0" standalone="no"?>
<?xml-stylesheet type="text/css" href="style-svg.css"?>
<?xml-stylesheet type="text/css" href="fluo.css"?>
<svg ${nsSVG} ${width} ${height} ${viewBox} version="1.1">
	${createGroups(layers)}
</svg>`;
	var sortedWidths = Array.from(widths).sort(sortFloat);
	var sortedHeights = Array.from(heights).sort(sortFloat);
	$('button#btnFilterSizes').addEventListener('click', filterBySize);
	populateDatalist('width', sortedWidths);
	populateDatalist('height', sortedHeights);
	var minWidth = $('input#min-width'),
		maxWidth = $('input#max-width'),
		minW = getMin(sortedWidths),
		maxW = getMax(sortedWidths);
	minWidth.min = minW;
	minWidth.value = minW;
	minWidth.max = maxW;
	maxWidth.min = minW;
	maxWidth.value = maxW;
	maxWidth.max = maxW;
	var minHeight = $('input#min-height'),
		maxHeight = $('input#max-height'),
		minH = getMin(sortedHeights),
		maxH = getMax(sortedHeights);
	minHeight.min = minH;
	minHeight.value = minH;
	minHeight.max = maxH;
	maxHeight.min = minH;
	maxHeight.value = maxH;
	maxHeight.max = maxH;
	return s;
},*/

//createGroup = g => `<g${g.name ? ` id="group${g.hash}"` : ''}${g.display ? ` display="visible"` : ''}>${createChildren(g.children)}</g>`,

createGroups = groups => {
	//console.log(groups);
	return (groups.children ? groups.children : groups).map(group => createGroup(group))
},

createGroup = group => {
	//console.log(group.children);
	let id = `group${group.hash}`,
		display = group.display ? 'visible' : 'hidden',
		g = SVG.create('g', { id, display }),
		children = createChildren(group.children);
	children.forEach(child => {
		//console.log(child);
		//child.forEach(c => g.appendChild(c));
		g.appendChild(child);
	});
	return g;
},

createChild = child => child.T === 'Group' ? createGroup(child) : createPath(child),

createChildren = list => {
	//console.log(list);
	return list.map(c => createChild(c));
},

getBBOX = function(path) {
	var points = getPoints(path),
		bbox = new BBOX(),
		length = points.length;
	for (var i = 0; i < length; i++) {
		var point = points[i];
		bbox.add(point);
	}
	return bbox;
},

getPoints = function(path) {
	var d = path.d
		.replace(/M|Z|L/g, ' ')
		.split(' ')
		.filter(x => x !== '')
		.map(x => parseFloat(x))
	var length = d.length / 2,
		points = new Array(length);
	for (var i = 0; i < length; i++) {
		points[i] = new Point(d[i * 2], d[1 + i * 2]);
	}
	return points;
},

createPath = function(pa) {
	var properties = properties = ['fill', 'fill-rule', 'stroke', 'stroke-width'],
		d = pa.d,
		cursor = 'pointer',
		bbox = getBBOX(pa);
	bboxTotal.add(bbox.min);
	bboxTotal.add(bbox.max);
	var width = parseFloat(bbox.width.toFixed(0));
	var height = parseFloat(bbox.height.toFixed(0));
	widths.add(width);
	heights.add(height);
	var props = { d, cursor, width, height };
	for (var j = 0; j < properties.length; j++) {
		var propertyName = properties[j],
			property = pa[propertyName];
		if (property)	{
			if (!propertyValues.has(propertyName)) {
				propertyValues.set(propertyName, new Set());
			}
			propertyValues.get(propertyName).add(property)
			//if (propertyName === 'stroke-width' && property === '0.5') property = '0.1';
			//s += `${propertyName}="${property}" `;
			props[propertyName] = property;
		}
	}
	var p = SVG.create('path', props);
	/*p.addEventListener('click', function() {
		alert(999);
	})*/
	return p;
},

createPaths = function(paths) {
	return paths.map(p => createPath(p));
	/*var s = '';
	var ps = [];
	for (var i = 0; i < paths.length; i++) {
		var path = paths[i],
			d = path.d,
			cursor = 'pointer';
		var bbox = getBBOX(path);
		bboxTotal.add(bbox.min);
		bboxTotal.add(bbox.max);
		var width = parseFloat(bbox.width.toFixed(0));
		var height = parseFloat(bbox.height.toFixed(0));
		widths.add(width);
		heights.add(height);
		var props = { d, cursor, width, height };
		
		s += `<path ${xmlns(SVG.namespace)} d="${path.d}" cursor="pointer" `;
		for (var j = 0; j < properties.length; j++) {
			var propertyName = properties[j],
				property = path[propertyName];
			if (property)	{
				if (!propertyValues.has(propertyName)) {
					propertyValues.set(propertyName, new Set());
				}
				propertyValues.get(propertyName).add(property)
				//if (propertyName === 'stroke-width' && property === '0.5') property = '0.1';
				s += `${propertyName}="${property}" `;
				props[propertyName] = property;
			}
		}
		var p = SVG.create('path', props);
		ps.push(p);
		s += ` width="${width}" height="${height}"/>`;
	}
	return ps;*/
},

click = function(evt, target) {
	//console.log(666);
	//var element = evt.target,
	var element = target,
		d = element.getAttribute('d'),
		points = getPoints({ d }),
		//lines = [],
		circles = [],
		paths = d
			.split('M')
			.filter(p => p != '')
			.map(l => {
				var coords = l.replace(/Z|L/g, ' ')
					.split(' ')
					.filter(x => x !== '')
					.map(x => parseFloat(x)),
				length = coords.length / 2,
				ps = new Array(length);
				for (var i = 0; i < length; i++) {
					ps[i] = new Point(coords[i * 2], coords[1 + i * 2]);
				}
				return ps;
			}),
		b = new BBOX(),
		length = points.length;
	var circles = points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="0.1" stroke="red" stroke-width="0.2"/>`)
	points.forEach(point => b.add(point));
	b.grow();
	var lines = paths.map(p => `<line x1="${p[0].x}" y1="${p[0].y}" x2="${p[1].x}" y2="${p[1].y}" stroke="green" stroke-width="0.05" cursor="pointer"/>`);
	var rect = `<rect x="${b.min.x}" y="${b.min.y}" width="${b.width}" height="${b.height}" stroke="blue" stroke-width="0.05" fill="white"/>`;
	var svg = $('svg');
	svg.innerHTML += `<g id="group-select-lines">${rect + /*lines.join('') +*/ circles.join('')}</g>`;
	var g = $('g#group-select-lines', svg);
	g.addEventListener('mouseover', function(evt) {
		g.setAttribute('fill-opacity', '0.5');
	}, false);
	[...$$('circle', g)].forEach(line => {
		//line.setAttribute('stroke-dasharray', '0.1, 0.1');
		//line.addEventListener('mouseover', mouseoverLine, false);
		//line.addEventListener('mouseout', mouseoutLine, false);
		line.addEventListener('click', clickLine, false);
	});
	//g.addEventListener('mouseout', function(evt) {
		//g.removeAttribute('fill-opacity');
	//}, false);
	[...$$('line', g)].forEach(line => line.removeAttribute('stroke-dasharray'));
	b.grow();
	var viewBox = new View(b);
	viewBox.use(svg);
	//var viewBox = [b.min.x, b.min.y, b.width, b.height].join(',');
	//svg.setAttribute('viewBox', viewBox);
	//console.log(points);
	/*element.setAttribute('_stroke', element.getAttribute('stroke'));
	element.setAttribute('_stroke-width', element.getAttribute('stroke-width'));
	element.setAttribute('stroke', 'red');
	element.setAttribute('stroke-width', '0.2');*/
},

mouseoverLine = function(evt) {
	var target = evt.target;
	if (target.getAttribute('selected') != 'true') {
		target.setAttribute('stroke-width', '0.1');
		target.setAttribute('stroke-dasharray', '0.1, 0.1');
		target.setAttribute('stroke', 'red');
	}
},

mouseoutLine = function(evt) {
	var target = evt.target;
	if (target.getAttribute('selected') != 'true') {
		target.setAttribute('stroke-width', '0.05');
		target.removeAttribute('stroke-dasharray');
		target.setAttribute('stroke', 'green');
	}
},

clickLine = function(evt) {
	evt.target.setAttribute('r', '0.2');
	if (localStorage.polygons == null) {
		localStorage.polygons = JSON.stringify({});
	}
	var polygons = JSON.parse(localStorage.polygons);
	var polygon = null;
	var index = null;
	for (var p in polygons) {
		index = p;
		polygon = polygons[p];
	}
	if (polygon == null) {
		index = 0;
		polygon = [];
	}
	polygon.push([parseFloat(evt.target.getAttribute('cx')), parseFloat(evt.target.getAttribute('cy'))]);
	polygons[index] = polygon;
	localStorage.polygons = JSON.stringify(polygons);
},

mouseover = function(evt) {
	var element = evt.target;
	element.setAttribute('_stroke', element.getAttribute('stroke'));
	element.setAttribute('_stroke-width', element.getAttribute('stroke-width'));
	element.setAttribute('stroke', 'red');
	//element.setAttribute('stroke-width', '0.2');
},

mouseout = function(evt) {
	var element = evt.target;
	element.setAttribute('stroke', element.getAttribute('_stroke'));
	//element.setAttribute('stroke-width', element.getAttribute('_stroke-width'));
}

document.addEventListener('DOMContentLoaded', load, false);