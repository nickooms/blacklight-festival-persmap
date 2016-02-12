var createSVG = function(layers) {
	//layers.forEach(layer => bboxes.set(layer.name, new BBOX()));
	var SVG = 'http://www.w3.org/2000/svg',
		ns = xmlns(SVG),
		w = 1000,
		h = 750,
		width = `width=${w.toFixed(3)}`,
		height = `height=${h.toFixed(3)}`,
		viewBox = `viewBox="0.0 0.0 ${w} ${h}"`,
		s = `<svg ${SVG} ${width} ${height} ${viewBox} version="1.1">\n${createGroups(layers)}\n</svg>`;
	var sortedWidths = Array.from(widths).sort(sortFloat);
	var sortedHeights = Array.from(heights).sort(sortFloat);
	$('button#btnFilterSizes').addEventListener('click', filterBySize);
	populateDatalist('width', sortedWidths);
	populateDatalist('height', sortedHeights);
	var minWidth = $('input#slider-min-width'),
		maxWidth = $('input#slider-max-width'),
		minW = getMin(sortedWidths),
		maxW = getMax(sortedWidths);
	minWidth.min = minW;
	minWidth.value = minW;
	minWidth.max = maxW;
	maxWidth.min = minW;
	maxWidth.value = maxW;
	maxWidth.max = maxW;
	var minHeight = $('input#slider-min-height'),
		maxHeight = $('input#slider-max-height'),
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

widths = new Set(),
heights = new Set(),
propertyValues = new Map(),
bboxTotal = new BBOX(),

sortFloat = (a, b) => {
	var fA = parseFloat(a),
		fB = parseFloat(b);
	return fA < fB ? -1 : 1
},

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

createGroup = g => `<g${g.name ? ` id="${g.hash}"` : ''}${g.display ? ` display="visible"` : ''}>${createChildren(g.children)}</g>`,

createGroups = list => list.map(createGroup).join(''),

createChild = child => child.T === 'Group' ? createGroups([child]) : createPaths([child]),

createChildren = list => list.map(c => createChild(c)),

filterBySize = function(evt) {
	var minWidth = $('input#slider-min-width').value |0,
		minHeight = $('input#slider-min-height').value |0,
		maxWidth = $('input#slider-max-width').value |0,
		maxHeight = $('input#slider-max-height').value |0,
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
	//console.log(d);
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
		s += `<path d="${path.d}" `;
		for (var j = 0; j < properties.length; j++) {
			var propertyName = properties[j],
				property = path[propertyName];
			if (property)	{
				if (!propertyValues.has(propertyName)) {
					propertyValues.set(propertyName, new Set());
				}
				propertyValues.get(propertyName).add(property)
				if (propertyName === 'stroke-width' && property === '0.5') property = '0.05';
				s += `${propertyName}="${property}" `;
			}
		}
		s += ` width="${width}" height="${height}"/>`;
	}
	return s;
},

$ = (selector, o) => (o || document).querySelector(selector),

$$ = (selector, o) => (o || document).querySelectorAll(selector),

toggleLayersList = function() {
	var div = $('div#layers');
	div.innerHTML = `<fieldset><legend>Layers</legend><ul id="layers" class="box box-asphalt" style="list-style-type: none; display: none;">${
		Podium.map(layer =>
			`<li class="box btn btn-asphalt menu" layer-id="${layer.hash}" style="border: 1px solid #fff;">
					<input id="chk${layer.hash}" class="regular-checkbox" type="checkbox" checked/>
					<label for="chk${layer.hash}" style="color:#fff;padding-left: 40px; flex">${layer.name}</label>
				</li>`).join('')
			}</ul></fieldset>`
	var checkboxes = Array.from(div.querySelectorAll('input'));
	checkboxes.forEach(c => c.addEventListener('change', (evt) => {
		var	checkbox = evt.target,
			checked = checkbox.checked,
			layerId = checkbox.id.replace('chk', '');
			layer = document.getElementById(layerId);
			layer.setAttribute('display', checked ? 'visible' : 'none');
	}));
	Array.from($$('legend')).forEach(legend => legend.addEventListener('click', function(evt) {
		[...evt.target.parentNode.querySelectorAll('*')]
			.filter(element => element.tagName !== 'LEGEND')
			.forEach(sibling => {
				var style = sibling.style;
				style.display = style.display === 'none' ? '' : 'none';
			});
	}));
},

toggleStylesList = function() {
	var ul = $('ul#styles');
	ul.innerHTML = [...propertyValues].map(property =>
	 `<li id="li${property[0]}" style="border: 1px solid #fff;">
	 		<label for="li${property[0]}" style="color: #fff;">${property[0]}</label>${
	 		[...property[1]].map(v => `<input type="checkbox"/><label for="" style="color: #fff;">${v}</label>`)
	 	}</li>`).join('')
},

toggleLayer = function(event) {
	var target = event.target;
	while (!target.getAttribute('layer-id')) target = target.parentNode;
	var	checkbox = $('input', target),
		checked = !checkbox.checked,
		layerId = target.getAttribute('layer-id'),
		layer = document.getElementById(layerId);
	layer.setAttribute('display', checked ? 'visible' : 'none');
}

document.addEventListener('DOMContentLoaded', function(event) {
	$('div#svg').innerHTML = createSVG(Podium);
	toggleLayersList();
	toggleStylesList();
	rangeSlider();
	initMenuButton();
	var svg = $('svg');
	svg.style.width = '100%';
	svg.style.height = '100%';
	svg.style.zoom = '200%';
	console.log(propertyValues);
	console.log(bboxTotal);
	svg.setAttribute('viewBox', [bboxTotal.min.x, bboxTotal.min.y, bboxTotal.width, bboxTotal.height].join(','));
	$('input#slider-zoom-left').min = bboxTotal.min.x |0;
	$('input#slider-zoom-left').value = bboxTotal.min.x |0;
	$('input#slider-zoom-right').max = (bboxTotal.min.x + bboxTotal.width) |0;
	Array.from($$('path')).forEach(p => {
		p.addEventListener('click', function(evt) {
			evt.target.setAttribute('stroke', 'red');
			evt.target.setAttribute('stroke-width', '0.2');
		}, false);
	})
});