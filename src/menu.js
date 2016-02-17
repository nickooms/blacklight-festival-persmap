'use strict'

const

hideMenu = function() {
	$('.js-menu-button').classList.toggle('menu-button--open');
	$('div#menu-overlay').classList.toggle('open');
	$('div#controls').classList.toggle('open');
},

filterBySize = function(evt) {
	var minWidth = $('input#min-width').value |0,
		minHeight = $('input#min-height').value |0,
		maxWidth = $('input#max-width').value |0,
		maxHeight = $('input#max-height').value |0,
		paths = $$('path');
	for (var path of paths) {
		var width = path.getAttribute('width') |0,
			height = path.getAttribute('height') |0;
			inRange = (minWidth <= width && width <= maxWidth) && (minHeight <= height && height <= maxHeight)
		path.setAttribute('display', inRange ? 'visible' : 'none');
	}
},

initLayersList = () => {
	var fieldset = $('fieldset#layers');
	fieldset.innerHTML += Podium.map(layer => {
		var checked = true,
			checkboxId = `chk${layer.hash}`;
		//console.log(checkboxId);
		if (localStorage[checkboxId] != null) {
			checked = localStorage[checkboxId] === 'false' ? false : true;
			if (!checked) {
				//debugger;
				$(`g#group${layer.hash}`).setAttribute('display', 'none');
				//console.log(777);
			}
		}
		//console.log(layer.name, '=>', checked);
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
	var target = evt.target,
		id = target.id,
		name = id.replace('chk', 'group'),
		checked = target.checked;
	localStorage[id] = checked;
	$(`g#${name}`).setAttribute('display', checked ? 'visible' : 'none');
	//getViewBBOX();
	var view = new View(View.bbox());
	view.use(svg);
},

initStylesList = () => {
	var fieldset = $('fieldset#styles');
	var styles = [...propertyValues].map(stylesList).join('\n');
	//console.log(styles);
	fieldset.innerHTML += styles;
	var checkboxes = [...$$('input', fieldset)];
	//console.log(checkboxes);
	checkboxes.forEach(checkbox => checkbox.addEventListener('change', styleCheckboxChange));
},

stylesList = property => {
	var name = property[0];
	//console.log(property[1]);
return `<fieldset id="fieldset${name}">
	<legend>${name}</legend>
	${[...property[1]].map(prop => styleList(name, prop)).join('\n')}
</fieldset>`
},

filterByStyle = function(property, values) {
	var v = property.split('_'),
		name = v[1],
		//value = v[2],
		paths = $$('path');
		//console.log(name, values);
	for (var path of paths) {
		var value = path.getAttribute(name);
		for (var val of values) {
			if (val[0] === value) {
				path.setAttribute('display', val[1] ? '' : 'none');
			}
		}
		//var ok = checkbox = 
		//var inRange = 
		//if (inRange) path.setAttribute('display', 'none');
	}
},

styleList = (name, v) =>
	`<div>
		<input id="style_${name}_${v}" type="checkbox" checked/>
		<label for="style_${name}_${v}" style="color: #fff;">${v}</label>
	</div>`,

styleCheckboxChange = evt => {
	var parent = evt.target.parentNode.parentNode;
	var property = parent.id.replace('fieldset', '');
	//console.log(property);
	var values = [...$$('input', parent)].map(chk => [chk.id.replace(`style_${property}_`, ''), chk.checked]);
	//console.log(values)
	filterByStyle(evt.target.id, values);
	//$(`g#${evt.target.id.replace('chk', 'group')}`).setAttribute('display', evt.target.checked ? 'visible' : 'none')
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