var progress = require('progressbar-stream');
var fs = require('fs')

var input = fs.createReadStream('file.txt');
var length = fs.statSync('file.txt').size;
input.on('open', function () {
	input.pipe(progress({total: length}));
})