'use strict'

let
	fs = require('fs'),
	libxslt = require('libxslt'),

	/*stylesheetSource = fs.readFileSync('cd.xsl', 'utf8'),
	docSource = fs.readFileSync('cd.xml', 'utf8'),

	stylesheet = libxslt.parse(stylesheetSource)*/
	data = fs.readFileSync('../data/Podium C v1-3D.svg', 'utf8'),
	stylesheetTextOut = libxslt.parse(fs.readFileSync('svg.xsl', 'utf8')),
	result = stylesheetTextOut.apply(data)
	console.log(result)

/*stylesheet.apply(docSource, function(err, result) {
	console.log(result)
})*/