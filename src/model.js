'use strict'

const prefix = 'blacklight.festival.persmap',

mongoose = require('mongoose'),

drawingSchema = mongoose.Schema({
	name: String
}, {
	collection: `${prefix}.drawings`
}),

layerSchema = mongoose.Schema({
	name: String,
	display: Boolean
}, {
	collection: `${prefix}.layers`
}),

pathSchema = mongoose.Schema({
	d: String,
	fill: String,
	fillRule: String,
	stroke: String,
	strokeWidth: String
}, {
	collection: `${prefix}.paths`
}),

Drawing = mongoose.model('Drawing', drawingSchema),

Layer = mongoose.model('Layer', layerSchema),

Path = mongoose.model('Path', pathSchema)

module.exports = { Drawing, Layer, Path }