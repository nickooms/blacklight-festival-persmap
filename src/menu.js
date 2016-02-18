'use strict'

const

hideMenu = function() {
	$('.js-menu-button').classList.toggle('menu-button--open');
	$('div#menu-overlay').classList.toggle('open');
	$('div#controls').classList.toggle('open');
},

filterBySize = function(evt) {
	const
		minWidth = $('input#min-width').value |0,
		minHeight = $('input#min-height').value |0,
		maxWidth = $('input#max-width').value |0,
		maxHeight = $('input#max-height').value |0,
		paths = $$('path');
	for (let path of paths) {
		let	width = path.getAttribute('width') |0,
			height = path.getAttribute('height') |0;
			inRange = (minWidth <= width && width <= maxWidth) && (minHeight <= height && height <= maxHeight)
		path.setAttribute('display', inRange ? 'visible' : 'none');
	}
},

initLayersList = () => {
	let fieldset = $('fieldset#layers');
	fieldset.innerHTML += Podium.map(layer => {
		let checked = true,
			checkboxId = `chk${layer.hash}`;
		if (localStorage[checkboxId] != null) {
			checked = localStorage[checkboxId] === 'false' ? false : true;
			if (!checked) {
				$(`g#group${layer.hash}`).setAttribute('display', 'none');
			}
		}
		return `<div layer-id="${layer.hash}">
			<input id="chk${layer.hash}" class="regular-checkbox" type="checkbox" ${checked ? 'checked' : ''}/>
			<label for="chk${layer.hash}" style="color: #fff;">${layer.name}</label>
		</div>`
	}).join('');
	[...$$('input', fieldset)].forEach(checkbox => checkbox.addEventListener('change', checkboxChange));
},

clickLegend = evt => [...$$('*', evt.target.parentNode)].filter(noLegends).map(getElementStyle).forEach(toggleDisplay),

noLegends = element => element.tagName !== 'LEGEND',

checkboxChange = evt => {
	let target = evt.target,
		id = target.id,
		name = id.replace('chk', 'group'),
		checked = target.checked;
	localStorage[id] = checked;
	$(`g#${name}`).setAttribute('display', checked ? 'visible' : 'none');
	let view = new View(View.bbox());
	view.use(svg);
},

initStylesList = () => {
	let fieldset = $('fieldset#styles');
	let styles = [...propertyValues].map(stylesList).join('\n');
	fieldset.innerHTML += styles;
	let checkboxes = [...$$('input', fieldset)];
	checkboxes.forEach(checkbox => checkbox.addEventListener('change', styleCheckboxChange));
},

stylesList = property => {
	let name = property[0];
return `<fieldset id="fieldset${name}">
	<legend>${name}</legend>
	${[...property[1]].map(prop => styleList(name, prop)).join('\n')}
</fieldset>`
},

filterByStyle = function(property, values) {
	let v = property.split('_'),
		name = v[1],
		paths = $$('path');
	for (let path of paths) {
		let value = path.getAttribute(name);
		for (let val of values) {
			if (val[0] === value) {
				path.setAttribute('display', val[1] ? '' : 'none');
			}
		}
	}
},

styleList = (name, v) =>
	`<div>
		<input id="style_${name}_${v}" type="checkbox" checked/>
		<label for="style_${name}_${v}" style="color: #fff;">${v}</label>
	</div>`,

styleCheckboxChange = evt => {
	let parent = evt.target.parentNode.parentNode;
	let property = parent.id.replace('fieldset', '');
	let values = [...$$('input', parent)].map(chk => [chk.id.replace(`style_${property}_`, ''), chk.checked]);
	filterByStyle(evt.target.id, values);
},

toggleLayer = function(event) {
	let target = event.target;
	while (!target.getAttribute('layer-id')) target = target.parentNode;
	let	checkbox = $('input', target),
		checked = !checkbox.checked,
		layerId = target.getAttribute('layer-id'),
		layer = document.getElementById(layerId);
	layer.setAttribute('display', checked ? 'visible' : 'none');
}