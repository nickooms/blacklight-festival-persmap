'use strict'

const NE = require('node-exceptions')

class FileNotFound extends NE.InvalidArgumentException {}

module.exports = {
	FileNotFound
}