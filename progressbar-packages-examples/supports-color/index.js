var supportsColor = require('supports-color');

if (supportsColor) {
	console.log('Terminal supports color');
}

if (supportsColor.has256) {
	console.log('Terminal supports 256 colors');
}

if (supportsColor.has16m) {
	console.log('Terminal supports 16 million colors (truecolor)');
}