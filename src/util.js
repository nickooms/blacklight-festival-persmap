'use strict'

const

$ = (selector, n) => (n || document).querySelector(selector),

$$ = (selector, n) => (n || document).querySelectorAll(selector),

xmlns = ns => `xmlns="${ns}"`,

sortFloat = (a, b) => parseFloat(a) < parseFloat(b) ? -1 : 1,

getMin = array => array.reduce((a, b) => Math.min(a, b), Infinity),

getMax = array => array.reduce((a, b) => Math.max(a, b), -Infinity),

selectOption = value => `<option value="${value}">${value}</option>`,

populateDropdown = (id, options, value) => {
	var dd = $(`select#${id}`);
	dd.innerHTML = options.map(selectOption).join('');
	if (value) dd.value = value;
},

datalistOption = value => `<option>${value}</option>`,

populateDatalist = (id, options, value) => {
	var dd = $(`datalist#${id}`);
	dd.innerHTML = options.map(datalistOption).join('');
	if (value) dd.value = value;
},

getElementStyle = element => element.style,

toggleDisplay = style => style.display = style.display === 'none' ? '' : 'none'