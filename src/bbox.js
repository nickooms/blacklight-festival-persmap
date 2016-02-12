'use strict'

class BBOX {
	constructor() {
		this._min = new Point(Infinity, Infinity)
		this._max = new Point(-Infinity, -Infinity)
	}
	add(point) {
		this._min.x = Math.min(this._min.x, point.x)
		this._min.y = Math.min(this._min.y, point.y)
		this._max.x = Math.max(this._max.x, point.x)
		this._max.y = Math.max(this._max.y, point.y)
	}
	get min() {
		return this._min
	}
	get max() {
		return this._max
	}
	get width() {
		return Math.abs(this._max.x - this._min.x)
	}
	get height() {
		return Math.abs(this._max.y - this._min.y)
	}
}

class Point {
	constructor(...point) {
		switch(point.length) {
			case 2:
				this._x = point[0]
				this._y = point[1]
				break
			default:
				break
		}
	}
	get x() {
		return this._x
	}
	set x(value) {
		this._x = value
	}
	get y() {
		return this._y
	}
	set y(value) {
		this._y = value
	}
}