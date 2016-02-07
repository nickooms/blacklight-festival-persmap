'use strict'

const
	db = require('./db'),
	model = require('./model')

class Path {
	constructor(g, parent_id) {
		this.d = g.getAttribute('d')
		this.fill = g.getAttribute('fill')
		this.fill_rule = g.getAttribute('fill-rule')
		this.stroke = g.getAttribute('stroke')
		this.stroke_width = g.getAttribute('stroke-width')
		this.parent_id = parent_id
	}
	save() {
		return new Promise((resolve, reject) => {
			const
				//parent = db.getCollection(`${model.prefix}.layers`).find({ name: this.parent.name }),
				path = new model.Path({
					d: this.d,
					fill: this.fill,
					fill_rule: this.fill_rule,
					stroke: this.stroke,
					stroke_width: this.stroke_width,
					parent_id: this.parent_id
				})
			path.save(err => {
				if (err) reject(new Error(err))
				resolve(path)
			})
		})
	}
}

module.exports = Path