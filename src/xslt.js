'use strict'

let
	fs = require('fs'),
	libxslt = require('libxslt'),
	//hash = require('object-hash'),
	sum = require('hash-sum'),

	/*stylesheetSource = fs.readFileSync('cd.xsl', 'utf8'),
	docSource = fs.readFileSync('cd.xml', 'utf8'),

	stylesheet = libxslt.parse(stylesheetSource)*/
	filename = '../data/Podium A v1-3D',
	data = fs.readFileSync(filename + '.svg', 'utf8'),
	stylesheetTextOut = libxslt.parse(fs.readFileSync('svg.xsl', 'utf8')),
	result = stylesheetTextOut.apply(data)
	result = result.replace('var Podium = ', '')
	var json = JSON.parse(result).layers;
	
	function loopObject(o) {
		//console.log(o)
		//var h = hash(o);
		var h = sum(o);
		//console.log(h);
		o.hash = h;
		if (o.children) {
			for (var i = 0; i < o.children.length; i++) {
				var child = o.children[i];
				loopObject(child)
			}
		}
	}
	for (var i = 0; i < json.length; i++) {
		var layer = json[i];
		//console.log(sum(layer))
		loopObject(layer);
	}
	result = 'var Podium = ' + JSON.stringify(json);
	//console.log(result);
	//
	fs.writeFileSync(filename.replace(/\s/g, '')/*.replace('../data/', '')*/ + '.js', result, {})

/*stylesheet.apply(docSource, function(err, result) {
	console.log(result)
})*/