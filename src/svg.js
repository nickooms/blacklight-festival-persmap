var
//115,325,58,60
widths = new Set(),
heights = new Set(),
propertyValues = new Map(),
bboxTotal = new BBOX(),
selectBox = {
	x: 0,
	y: 0,
	box: null,
	init: function(x, y, bbox) {
		selectBox.left = bbox.left;
		selectBox.top = bbox.top;
		selectBox.x = x + selectBox.left;
		selectBox.y = y + selectBox.top;
		var box = selectBox.box;
		if (box == null) {
			box = document.createElement('div');
			box.style.position = 'absolute';
			box.style.border = '1px solid red';
			document.body.appendChild(box);
			selectBox.box = box;
		}
		box.style.display = '';
	},
	show: function(x, y) {
		var style =	selectBox.box.style,
			left = x + selectBox.left,
			top = y + selectBox.top;
		style.left = `${Math.min(selectBox.x, left)}px`;
		style.top = `${Math.min(selectBox.y, top)}px`;
		style.width = `${Math.abs(selectBox.x - left)}px`;
		style.height = `${Math.abs(selectBox.y - top)}px`;
	},
	stop: function() {
		var rect = selectBox.box.getBoundingClientRect();
		console.log(rect);
		console.log($('svg').getBoundingClientRect());
		console.log($('svg').getAttribute('viewBox'));
		selectBox.box.style.display = 'none';
	}
},

createSVG = function(layers) {
	var SVG = 'http://www.w3.org/2000/svg',
		ns = xmlns(SVG),
		w = 1000,
		h = 750,
		width = `width=${w.toFixed(3)}`,
		height = `height=${h.toFixed(3)}`,
		viewBox = `viewBox="0.0 0.0 ${w} ${h}"`,
		s = `<?xml version="1.0" standalone="no"?>
<?xml-stylesheet type="text/css" href="style-svg.css"?>
<svg ${SVG} ${width} ${height} ${viewBox} version="1.1">
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
},

sortFloat = (a, b) => parseFloat(a) < parseFloat(b) ? -1 : 1,

getMin = array => array.reduce((a, b) => Math.min(a, b), Infinity),
getMax = array => array.reduce((a, b) => Math.max(a, b), -Infinity),

selectOption = value => `<option value="${value}">${value}</option>`,

datalistOption = value => `<option>${value}</option>`,

populateDropdown = (id, options, value) => {
	var dd = $(`select#${id}`);
	dd.innerHTML = options.map(selectOption).join('');
	if (value) dd.value = value;
},

populateDatalist = (id, options, value) => {
	var dd = $(`datalist#${id}`);
	dd.innerHTML = options.map(datalistOption).join('');
	if (value) dd.value = value;
},

xmlns = ns => `xmlns="${ns}"`,

createGroup = g => `<g${g.name ? ` id="group${g.hash}"` : ''}${g.display ? ` display="visible"` : ''}>${createChildren(g.children)}</g>`,

createGroups = list => list.map(createGroup).join(''),

createChild = child => child.T === 'Group' ? createGroups([child]) : createPaths([child]),

createChildren = list => list.map(c => createChild(c)),

filterBySize = function(evt) {
	var minWidth = $('input#min-width').value |0,
		minHeight = $('input#min-height').value |0,
		maxWidth = $('input#max-width').value |0,
		maxHeight = $('input#max-height').value |0,
		paths = $$('path');
	console.log(minWidth, maxWidth, minHeight, maxHeight)
	for (var path of paths) {
		var width = path.getAttribute('width') |0,
			height = path.getAttribute('height') |0;
			inRange = (minWidth <= width && width <= maxWidth) && (minHeight <= height && height <= maxHeight)
		path.setAttribute('display', inRange ? 'visible' : 'none');
	}
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

createPaths = function(paths) {
	var properties = properties = ['fill', 'fill-rule', 'stroke', 'stroke-width'];
	var s = '';
	for (var i = 0; i < paths.length; i++) {
		var path = paths[i];
		var bbox = getBBOX(path);
		bboxTotal.add(bbox.min);
		bboxTotal.add(bbox.max);
		var width = parseFloat(bbox.width.toFixed(0));
		var height = parseFloat(bbox.height.toFixed(0));
		widths.add(width);
		heights.add(height);
		s += `<path d="${path.d}" cursor="pointer" `;
		for (var j = 0; j < properties.length; j++) {
			var propertyName = properties[j],
				property = path[propertyName];
			if (property)	{
				if (!propertyValues.has(propertyName)) {
					propertyValues.set(propertyName, new Set());
				}
				propertyValues.get(propertyName).add(property)
				if (propertyName === 'stroke-width' && property === '0.5') property = '0.1';
				s += `${propertyName}="${property}" `;
			}
		}
		s += ` width="${width}" height="${height}"/>`;
	}
	return s;
},

$ = (selector, n) => (n || document).querySelector(selector),

$$ = (selector, n) => (n || document).querySelectorAll(selector),

initLayersList = () => {
	var fieldset = $('fieldset#layers');
	fieldset.innerHTML += Podium.map(layer =>
		`<div layer-id="${layer.hash}">
			<input id="chk${layer.hash}" class="regular-checkbox" type="checkbox" checked/>
			<label for="chk${layer.hash}" style="color: #fff;">${layer.name}</label>
		</div>`).join('');
	[...$$('input', fieldset)].forEach(checkbox => checkbox.addEventListener('change', checkboxChange));
},

checkboxChange = evt => $(`g#${evt.target.id.replace('chk', 'group')}`).setAttribute('display', evt.target.checked ? 'visible' : 'none'),

clickLegend = evt => [...$$('*', evt.target.parentNode)].filter(noLegends).map(getElementStyle).forEach(toggleDisplay),

noLegends = element => element.tagName !== 'LEGEND',

getElementStyle = element => element.style,

toggleDisplay = style => style.display = style.display === 'none' ? '' : 'none',

initStylesList = () => $('fieldset#styles').innerHTML += [...propertyValues].map(stylesList).join(''),

stylesList = property =>
`<fieldset id="fieldset${property[0]}">
	<legend>${property[0]}</legend>
	${[...property[1]].map(styleList, property[0]).join('')}
</fieldset>`,

styleList = (v, prop) =>
`<input id="style${prop}${v}" type="checkbox" checked/>
<label for="style${prop}${v}" style="color: #fff;">${v}</label><br>`,

toggleLayer = function(event) {
	var target = event.target;
	while (!target.getAttribute('layer-id')) target = target.parentNode;
	var	checkbox = $('input', target),
		checked = !checkbox.checked,
		layerId = target.getAttribute('layer-id'),
		layer = document.getElementById(layerId);
	layer.setAttribute('display', checked ? 'visible' : 'none');
},

mousedown = function(evt) {
	selectBox.init(evt.offsetX, evt.offsetY, evt.target.getBoundingClientRect());
	document.addEventListener('mousemove', mousemove, false);
	document.addEventListener('mouseup', mouseup, false);
},

mousemove = function(evt) {
	selectBox.show(evt.offsetX, evt.offsetY);
},

mouseup = function(evt) {
	document.removeEventListener('mousemove', mousemove);
	document.removeEventListener('mouseup', mouseup);
	selectBox.stop();
},

click = function(evt) {
	var element = evt.target,
		d = element.getAttribute('d'),
		points = getPoints({ d }),
		lines = [],
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
	//console.log(paths);
	for (var i = 0; i < length; i++) {
		var point = points[i];
		b.add(point);
	}
	b.grow();
	for (var i = 0; i < paths.length; i++) {
		var point1 = paths[i][0],
			point2 = paths[i][1],
			line = `<line x1="${point1.x}" y1="${point1.y}" x2="${point2.x}" y2="${point2.y}" stroke="green" stroke-width="0.05"/>`;
		lines.push(line);
	}
	var rect = `<rect x="${b.min.x}" y="${b.min.y}" width="${b.width}" height="${b.height}" stroke="blue" stroke-width="0.05" fill="white"/>`;
	//console.log(d);
	//console.log(rect);
	var svg = $('svg');
	svg.innerHTML += `<g id="group-select-lines">${rect + lines.join('')}</g>`;
	var g = $('g#group-select-lines', svg);
	g.addEventListener('mouseover', function(evt) {
		g.setAttribute('fill-opacity', '0.5');
		[...$$('line', g)].forEach(line => line.setAttribute('stroke-dasharray', '0.1, 0.1'));
	}, false);
	g.addEventListener('mouseout', function(evt) {
		g.removeAttribute('fill-opacity');
		[...$$('line', g)].forEach(line => line.removeAttribute('stroke-dasharray'));
	}, false);
	b.grow();
	var viewBox = [b.min.x, b.min.y, b.width, b.height].join(',');
	svg.setAttribute('viewBox', viewBox);
	//console.log(points);
	/*element.setAttribute('_stroke', element.getAttribute('stroke'));
	element.setAttribute('_stroke-width', element.getAttribute('stroke-width'));
	element.setAttribute('stroke', 'red');
	element.setAttribute('stroke-width', '0.2');*/
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
},

hideMenu = function() {
	$('.js-menu-button').classList.toggle('menu-button--open');
	$('div#menu-overlay').classList.toggle('open');
	$('div#controls').classList.toggle('open');
},

load = function() {
	$('div#svg').innerHTML = createSVG(Podium);
	initLayersList();
	initStylesList();
	rangeSlider();
	initMenuButton();
	var svg = $('svg');
	svg.style.width = '100%';
	svg.style.height = '100%';
	$('div#svg').addEventListener('mousedown', mousedown, false);
	//console.log(propertyValues);
	//console.log(bboxTotal);
	var view = {
		left: bboxTotal.min.x |0,
		top: bboxTotal.min.y |0,
		width: bboxTotal.width |0,
		height: bboxTotal.height |0
	}
	view = { left: 115, top: 325, width: 58, height: 60 };
	var viewBox = [view.left, view.top, view.width, view.height].join(',');
	svg.setAttribute('viewBox', viewBox);
	$('input#zoom-left').min = view.left;
	$('input#zoom-left').value = view.left;
	$('input#zoom-left').max = view.left + view.width;
	[...$$('path')].forEach(p => {
		p.addEventListener('mouseover', mouseover, false);
		p.addEventListener('mouseout', mouseout, false);
		p.addEventListener('click', click, false);
	});
	[...$$('legend')].forEach(legend => {
		legend.addEventListener('click', clickLegend);
		[...$$('*', legend.parentNode)].filter(noLegends).forEach(child => toggleDisplay(child.style));
	});
	$('div#menu-overlay').addEventListener('click', hideMenu, false);
};

document.addEventListener('DOMContentLoaded', load, false);