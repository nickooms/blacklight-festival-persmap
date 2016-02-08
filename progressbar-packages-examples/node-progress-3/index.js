'use strict'

const
	ProgressBar = require('node-progress-3'),
	chalk = require('chalk'),
	colors = require('ansi-256-colors'),
	ansiEscapes = require('ansi-escapes'),
	bar = new ProgressBar({
		total: 20,
		complete: colors.bg.getRgb(0, 3, 5) + ' ' + colors.reset,//chalk.blue.inverse(' '),
		incomplete: ' ',
		format: 'Loading file |:bar| :percent | :etas'//':c[blue][:bar]'
	}),

timer = setInterval(() => bar.tick(), 100)

process.stdout.write(ansiEscapes.cursorHide)

bar.onComplete = () => {
	process.stdout.write(ansiEscapes.cursorShow)
	//console.log(bar.report)
	process.exit()
}