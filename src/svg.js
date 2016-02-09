var createSVG = function(layers) {
	var SVG = 'http://www.w3.org/2000/svg',
		ns = xmlns(SVG),
		w = 800,
		h = 600,
		width = `width=${w.toFixed(3)}`,
		height = `height=${h.toFixed(3)}`,
		viewBox = `viewBox="0.0 0.0 ${w} ${h}"`,
		s = `<svg ${SVG} ${width} ${height} ${viewBox} version="1.1">\n${createGroups(layers)}\n</svg>`
	return s;
},

xmlns = ns => `xmlns="${ns}"`,

createGroup = g => `<g${g.name ? ` id="${g.hash}"` : ''}${g.display ? ` display="visible"` : ''}>${createChildren(g.children)}</g>`,

createGroups = groups => groups.map(createGroup).join(''),

createChildren = function(children) {
	var s = '';
	for (var i = 0; i < children.length; i++) {
		var child = children[i];
		if (child.T == 'Group') {
			s += createGroups([child])
		} else if (child.T == 'Path') {
			s += createPaths([child])
		}
	}
	return s;
},

createPaths = function(paths) {
	var properties = properties = ['fill', 'fill-rule', 'stroke', 'stroke-width'];
	var s = '';
	for (var i = 0; i < paths.length; i++) {
		var path = paths[i];
		s += `<path d="${path.d}" `;
		for (var j = 0; j < properties.length; j++) {
			var propertyName = properties[j],
				property = path[propertyName];
			if (propertyName === 'stroke-width' && property === '0.5') property = '0.05';
			if (property)	{
				s += `${propertyName}="${property}" `;
			}
		}
		s += `/>`;
	}
	return s;
},

$ = (selector, o) => (o || document).querySelector(selector),

$$ = (selector, o) => (o || document).querySelectorAll(selector),

toggleLayersList = function(event) {
	var div = $('div#layers');
	if (div.innerHTML != '') {
		div.innerHTML = '';
		div.style.display = 'none';
		return;
	}
	div.innerHTML = `<ul id="layers" class="box box-asphalt">${
		Podium.map(layer =>
			`<li class="box btn btn-asphalt menu" layer-id="${layer.hash}" style="border: 1px solid #fff;">`+
			//<div class="checkbox-design1">
					`<input id="chk${layer.hash}" class="regular-checkbox" type="checkbox" checked>
					<label for="chk${layer.hash}">${layer.name}</label>`+
			//</div>
				`</li>`).join('')
			}</ul>`
	var checkboxes = Array.from($$('input'));
	//checkboxes.forEach(chk => chk.parentNode.addEventListener('click', toggleLayer, false))
	div.style.display = 'block';
},

toggleLayer = function(event) {
	var target = event.target;
	while (!target.getAttribute('layer-id')) target = target.parentNode;
	var	checkbox = $('input', target),
		checked = !checkbox.checked,
		layerId = target.getAttribute('layer-id'),
		layer = document.getElementById(layerId);
	//checkbox.checked = checked;
	layer.setAttribute('display', checked ? 'visible' : 'none');
}

document.addEventListener('DOMContentLoaded', function(event) {
	$('div#svg').innerHTML = createSVG(Podium)
	$('button#layers').addEventListener('click', toggleLayersList, false)
});