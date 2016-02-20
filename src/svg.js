'use strict'
const

widths = new Set(),
heights = new Set(),
propertyValues = new Map(),
bboxTotal = new BBOX(),
polygon = [],

load = function() {
	const
		width = 1000,
		height = 750,
		viewBox = `0 0 ${width} ${height}`,
		version = '1.1',
		svg = SVG.create('svg', { width, height, viewBox, version }),
		defs = SVG.create('defs'),
		style = SVG.create('style', { type: 'text/css' });

	$('div#svg').appendChild(svg);
	svg.appendChild(defs);
	defs.appendChild(style);
	style.textContent = CSS;
	Podium.map(SVG.Layer).forEach(x => svg.appendChild(x));
	initLayersList();
	initStylesList();
	rangeSlider();
	initMenuButton();
	$('button#btnFilterSizes').addEventListener('click', filterBySize, false);
	let root = $('svg');
	root.style.width = '100%';
	root.style.height = '100%';
	View.init();
	const
		bboxView = View.bbox(),
		view = new View(bboxView),
		zoomLeft = $('input#zoom-left');
	view.use(root);
	zoomLeft.min = view.left;
	zoomLeft.value = view.left;
	zoomLeft.max = view.right;
	[...$$('legend')].forEach(legend => {
		legend.addEventListener('click', clickLegend);
		[...$$('*', legend.parentNode)].filter(noLegends).forEach(child => toggleDisplay(child.style));
	});
	delete localStorage.polygons;
	$('div#menu-overlay').addEventListener('click', hideMenu, false);
	svg.addEventListener('click', function(evt) {
		let target = evt.target
		switch (target.tagName) {
			case 'path':
				click(evt, target);
				break;
			case 'g':
				if (target.id === 'group-select-lines') {

				}
				break;
			default:
				break;
		}
	});
	fillPodium();
},

createGroups = groups => (groups.children ? groups.children : groups).map(group => createGroup(group)),

createGroup = group => {
	let id = `group${group.hash}`,
		display = group.display ? 'visible' : 'hidden',
		g = SVG.create('g', { id, display }),
		children = createChildren(group.children);
	children.forEach(child => g.appendChild(child));
	return g;
},

createChild = child => child.T === 'Group' ? createGroup(child) : createPath(child),

createChildren = list => list.map(c => createChild(c)),

getBBOX = function(path) {
	let points = getPoints(path),
		bbox = new BBOX(),
		length = points.length;
	for (let i = 0; i < length; i++) {
		let point = points[i];
		bbox.add(point);
	}
	return bbox;
},

getPoints = function(path) {
	let d = path.d
		.replace(/M|Z|L/g, ' ')
		.split(' ')
		.filter(x => x !== '')
		.map(x => parseFloat(x));
	let length = d.length / 2,
		points = new Array(length);
	for (let i = 0; i < length; i++) {
		points[i] = new Point(d[i * 2], d[1 + i * 2]);
	}
	return points;
},

createPaths = paths => paths.map(p => createPath(p)),

click = function(evt, target) {
	let element = target,
		d = element.getAttribute('d'),
		points = getPoints({ d }),
		paths = d
			.split('M')
			.filter(p => p != '')
			.map(l => {
				let coords = l.replace(/Z|L/g, ' ')
					.split(' ')
					.filter(x => x !== '')
					.map(x => parseFloat(x)),
				length = coords.length / 2,
				ps = new Array(length);
				for (let i = 0; i < length; i++) {
					ps[i] = new Point(coords[i * 2], coords[1 + i * 2]);
				}
				return ps;
			}),
		b = new BBOX(),
		length = points.length;
	let circles = points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="0.1" stroke="red" stroke-width="0.2"/>`)
	points.forEach(point => b.add(point));
	b.grow();
	let lines = paths.map(p => `<line x1="${p[0].x}" y1="${p[0].y}" x2="${p[1].x}" y2="${p[1].y}" stroke="green" stroke-width="0.05" cursor="pointer"/>`),
		rect = `<rect x="${b.min.x}" y="${b.min.y}" width="${b.width}" height="${b.height}" stroke="blue" stroke-width="0.05" fill="white"/>`,
		svg = $('svg');
	svg.innerHTML += `<g id="group-select-lines">${rect + circles.join('')}</g>`;
	let g = $('g#group-select-lines', svg);
	g.addEventListener('mouseover', function(evt) {
		g.setAttribute('fill-opacity', '0.5');
	}, false);
	g.addEventListener('mouseout', function(evt) {
		g.setAttribute('fill-opacity', '1.0');
	}, false);
	[...$$('circle', g)].forEach(line => line.addEventListener('click', clickLine, false));
	[...$$('line', g)].forEach(line => line.removeAttribute('stroke-dasharray'));
	b.grow();
	let viewBox = new View(b);
	viewBox.use(svg);
},

clickLine = function(evt) {
	if (localStorage.polygons == null) {
		localStorage.polygons = JSON.stringify({});
	}
	let target = evt.target,
		polygons = JSON.parse(localStorage.polygons),
		polygon = null,
		index = null;
	target.setAttribute('r', '0.2');
	for (let p in polygons) {
		index = p;
		polygon = polygons[p];
	}
	if (polygon == null) {
		index = 0;
		polygon = [];
	}
	polygon.push([parseFloat(target.getAttribute('cx')), parseFloat(target.getAttribute('cy'))]);
	polygons[index] = polygon;
	localStorage.polygons = JSON.stringify(polygons);
}

document.addEventListener('DOMContentLoaded', load, false);