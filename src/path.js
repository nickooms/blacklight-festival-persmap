'use strict'

class Path {
	constructor(g) {
		this.d = g.getAttribute('d')
		this.fill = g.getAttribute('fill')
		this.fillRule = g.getAttribute('fill-rule')
		this.stroke = g.getAttribute('stroke')
		this.strokeWidth = g.getAttribute('stroke-width')
	}
	save() {
		return new Promise((resolve, reject) => {
			const path = new model.Path({
				d: this.d,
				fill: this.fill,
				fillRule: this.fillRule,
				stroke: this.stroke,
				strokeWidth: this.strokeWidth
			})
			path.save(err => {
				if (err) reject(new Error(err))
				resolve(path)
			})
		})
	}
}

module.exports = Path