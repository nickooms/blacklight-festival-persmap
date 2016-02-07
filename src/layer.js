'use strict'

const Path = require('./Path'),
model = require('./model')

class Layer {
	constructor(g, drawing_id) {
		this.name = g.getAttribute('id')
		this.display = g.getAttribute('display') === 'visible'
		this.paths = [...g.querySelectorAll('g')]
			.map(p => [...p.querySelectorAll('path')].map(path => new Path(path)))
		this._ = new model.Layer(Object.assign({}, this))
	}
	get id() { return this._._id }
	save() {
		return new Promise((resolve, reject) => this._.save(err => {
			if (err) reject(new Error(err))
			resolve(this)
		}))
	}
}

module.exports = Layer