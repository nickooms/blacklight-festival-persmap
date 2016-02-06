'use strict'

const Path = require('./Path'),
model = require('./model')

class Layer {
	constructor(g) {
		this.name = g.getAttribute('id')
		this.display = g.getAttribute('display') === 'visible'
		this.paths = [...g.querySelectorAll('g')]
			.map(g => [...g.querySelectorAll('path')]
			.map(path => new Path(path)))
	}
	save() {
		return new Promise((resolve, reject) => {
			const layer = new model.Layer({
				name: this.name,
				display: this.display
			})
			layer.save(err => {
				if (err) reject(new Error(err))
				resolve(layer)
			})
		})
	}
}

module.exports = Layer