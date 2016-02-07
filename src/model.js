'use strict'

const
prefix = 'blacklight.festival.persmap',
mongoose = require('mongoose'),
ObjectId = mongoose.Schema.Types.ObjectId,

options = name => ({ collection: `${prefix}.${name}` }),

drawingSchema = mongoose.Schema({
	name: String,
	parent_id: ObjectId
}, options('drawings')),

layerSchema = mongoose.Schema({
	name: String,
	display: Boolean,
	parent_id: ObjectId
}, options('layers')),

pathSchema = mongoose.Schema({
	d: String,
	fill: String,
	fillRule: String,
	stroke: String,
	strokeWidth: String,
	parent_id: ObjectId
}, options('paths')),

Drawing = mongoose.model('Drawing', drawingSchema),

Layer = mongoose.model('Layer', layerSchema),

Path = mongoose.model('Path', pathSchema)

module.exports = { Drawing, Layer, Path, prefix }