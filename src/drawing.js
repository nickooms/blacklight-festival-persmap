'use strict'

const //Path = require('./Path'),
model = require('./model')

class Drawing {
	constructor(filename) {
		this.name = filename
	}
	save() {
		return new Promise((resolve, reject) => {
			const drawing = new model.Drawing({
				name: this.name
			})
			drawing.save(err => {
				//console.log('saving drawing')
				if (err) reject(new Error(err))
				resolve(drawing)
			})
		})
	}
}

module.exports = Drawing