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
	svg.addEventListener('click', function(evt) {
		var target = evt.target
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
	g.addEventListener('mouseout', function(evt) {
		g.setAttribute('fill-opacity', '1.0');
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