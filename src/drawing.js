'use strict'

const model = require('./model')

class Drawing {
	constructor(filename) {
		this.name = filename
		this._ = new model.Drawing(Object.assign({}, this))
	}
	get id() { return this._._id }
	save() {
		return new Promise((resolve, reject) => this._.save(err => {
			if (err) reject(new Error(err))
			resolve(this)
		}))
	}
}

module.exports = Drawing