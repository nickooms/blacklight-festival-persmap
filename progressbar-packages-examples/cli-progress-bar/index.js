var ProgressBar = require('cli-progress-bar')

var bar = new ProgressBar({
	width: 100
})

var value = 0

function show() {
	bar.show('Foo', value / 100)
	bar.pulse('bar')
	if (value < 100) {
		value++
		setTimeout(show, 50)
	} else {
		process.exit()
	}
}

show()

/*setInterval(function () {
  bar.pulse('bar')
}, 50)*/

//bar.hide()