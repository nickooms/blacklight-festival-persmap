const

ansiEscapes = require('ansi-escapes'),
colors = require('ansi-256-colors'),
chalk = require('chalk'),
//cli = require('clui'),

blue = colors.bg.getRgb(0, 3, 5) + ' ' + colors.reset,
white = chalk.bgWhite(' '),
green = '\u001b[42m \u001b[0m',
red = '\u001b[41m \u001b[0m',

out = msg => process.stdout.write(msg),
clearScreen = () => out(ansiEscapes.eraseScreen),
hideCursor = () => out(ansiEscapes.cursorHide),
showCursor = () => out(ansiEscapes.cursorShow),

progressBarLibs = {
	'progress': {
		get format() { return `loading ${this.name} [:bar] :percent :etas` },
		start(name, width, total) {
			this.name = name
			hideCursor()
			this.bar = new ProgressBar(this.format, {
				complete: blue,
				incomplete: ' ',
				width: width,
				total: total,
				clear: true
			})
		},
		update(bytesRead, chunkSize) { this.bar.tick(chunkSize) },
		stop() { showCursor() }
	},
	'cli-progress': {
		get format() { return `loading ${this.name} [{bar}] {percentage}% {eta}s` },
		start(name, width, total) {
			this.name = name
			this.bar = new ProgressBar.Bar({
				format: this.format,
				fps: 6,
				clearOnComplete: true,
				barCompleteString: white,
				barIncompleteString: blue,
				barsize: width,
				total: total,
				hideCursor: true
			})
			this.bar.start(total, 0)
		},
		update(bytesRead, chunkSize) { this.bar.update(bytesRead) },
		stop() { this.bar.stop() }
	},
	'smooth-progress': {
		get format() { return `loading ${this.name} [:bar] :percent :etas` },
		start(name, width, total) {
			this.name = name
			hideCursor()
			clearScreen()
			this.bar = ProgressBar({
				tmpl: this.format,
				width: width,
				total: total
			})
		},
		update(bytesRead, chunkSize) {
			this.bar.tick(chunkSize)
			out(ansiEscapes.eraseLine + ansiEscapes.cursorUp(1))
		},
		stop() { showCursor() }
	},
	'node-progress-3': {
		get format() { return `Loading ${this.name} |:bar| :percent | :opsec bytes/s` },
		start(name, width, total) {
			this.name = name
			hideCursor()
			this.bar = new ProgressBar({
				format: this.format,
				complete: blue,
				incomplete: ' ',
				width: width,
				total: total,
				clear: true
			})
			this.bar.onComplete = function() {
				console.log('')
				console.log('=======')
			}
		},
		update(bytesRead, chunkSize) { this.bar.tick(chunkSize) },
		stop() { showCursor() }
	}
},
//progressBarLibName = 'smooth-progress',
progressBarLibName = 'node-progress-3',
//progressBarLibName = 'progress',
progressBarLib = progressBarLibs[progressBarLibName],
progressBarDebug = false,

ProgressBar = require(progressBarLibName)

module.exports = { ProgressBar, progressBarLibs, progressBarLibName, progressBarLib }