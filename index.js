'use strict'

require('./server')
/*const
//svgFilename = 'data/Podium A v1-3D.svg',
svgFilename = 'data/Podium C v1-3D.svg',
host = '127.0.0.1',
port = 1337,

fs = require('fs'),
http = require('http'),
jsdom = require('jsdom'),
async = require('async'),
chalk = require('chalk'),
cli = require('clui'),

db = require('./src/db'),
Exception = require('./src/errors'),
Drawing = require('./src/drawing'),
Layer = require('./src/layer'),
Path = require('./src/path'),
model = require('./src/model'),
ProgressBar = require('./src/progress-bar').ProgressBar,
progressBarLibs = require('./src/progress-bar').progressBarLibs,
progressBarLibName = require('./src/progress-bar').progressBarLibName,
progressBarLib = require('./src/progress-bar').progressBarLib,

log = msg => (object => {
	console.log.call(object || {}, msg)
	return object
})(msg),

error = e => console.error(e),

consoleSize = () => {
	let
		lineBuffer = new cli.LineBuffer({ x: 0, y: 0, width: 'console', height: 'console' }),
		width = lineBuffer.width(),
		height = lineBuffer.height()
	return { width, height }
},

readFile = path => new Promise((resolve, reject) => {
	fs.readFile(`${__dirname}/${path}`, 'utf8', (err, data) => {
		if (err) reject(new Exception.FileNotFound(err))
		resolve(data)
	})
}),

sendFile = (res, path, contentType) => Promise.resolve(path)
	.then(() => res.writeHead(200, { 'Content-Type': contentType }))
	.then(() => readFile(path))
	.then(file =>	res.end(file))
	.then(() => path)
	.catch(error),

getFilename = url => {
	switch(url) {
		case '/':
		case '/load_file':
		case '/layers':
			return 'index.html'
		case '/style.css':
		case '/reindeer.css':
		case '/favicon.ico':
		case '/PodiumAv1-3D.js':
		case '/Podium.js':
		case '/svg.js':
		//case '/object_hash.js':
			return url.substr(1)
		default:
			return url
	}
},

getContentType = url => {
	switch(url.split('.').reverse()[0]) {
		case 'css':
			return 'text/css'
		case 'ico':
			return 'image/x-icon'
		default:
			return 'text/html'
	}
},

fileName = filePath => `"${filePath.split('/').reverse()[0].split('.')[0]}"`,

file = filePath => chalk.blue(fileName(filePath)),

getDrawing = path => new Promise((resolve, reject) => {
	log(` Reading ${file(path)}`)
	readFile(path).then(data => {
		log(` Loaded  ${file(path)} [${data.length} bytes]`)
		log(' Parsing SVG file')
		jsdom.env({
			html: data,
			done: (errors, window) => {
				if (errors) reject(errors)
				log(' Parsed SVG file')
				resolve(window.document)
			}
		})
	})
	.catch(error)
}),

getLayers = (doc, drawing_id) => {
	let layers = [...doc.querySelectorAll('g[id]')].map(g => new Layer(g, drawing_id))
	log(` Found ${layers.length} layers`)
	return Promise.all(layers.map(getLayer))
		.then(() => log(` Saved ${layers.length} layers`))
		.catch(error)
},

getLayer = layer => saveLayer(layer)
	.then(() => Promise.all(layer.paths[0].map(path => {
		path.parent_id = layer._id
		log(`path => ${JSON.stringify(path)}`)
		return savePath(path)
	})))
	.then(() => layer),

saveLayer = layer => layer.save()
	.then(saved => log(`  Saved layer "${saved.name}"`))
	.catch(error),

savePath = path => {
	log('path =>', path)
	return path.save()
		.then(saved => log(`  Saved path "${saved.id}"`))
		.catch(error)
},

saveDrawing = drawing => drawing.save()
	.then(saved => log(`  Saved drawing ${file(saved.name)}`))
	.catch(error),

loadSvgFile = svgFilename => {
	let
		svg = null,
		drawing = null
	return getFileSize(svgFilename)
		.then(() => getDrawing(svgFilename))
		.then(x => svg = x)
		.then(svg => new Drawing(svgFilename))
		.then(x => drawing = x)
		.then(drawing => drawing.save())
		.then(() => getLayers(svg, drawing.id))
		.then(() => {
			log('SVG file loading complete')
			log('=========================')
		})
		.catch(error)
},

getFileSize = filename => new Promise((resolve, reject) => {
	let stats = fs.stat(filename, (err, stats) => {
		if (err) reject(Error(err))
		resolve(stats['size'])
	})
}),

getFile = filename => new Promise((resolve, reject) => {
	try {
		let
			fd = fs.openSync(filename, 'r'),
			stats = fs.fstatSync(fd),
			bufferSize = stats.size,
			chunkSize = 512,
			buffer = new Buffer(bufferSize),
			bytesRead = 0,
			name = file(filename),
			width = consoleSize().width - (25 + name.length),
			elements = [],
			bar = progressBarLib.start(name, width, bufferSize)
		async.whilst(
			() => (bytesRead < bufferSize),
			done => {
				if ((bytesRead + chunkSize) > bufferSize) {
					chunkSize = (bufferSize - bytesRead)
				}
				fs.read(fd, buffer, bytesRead, chunkSize, bytesRead, function(err, bytes, buff) {
					if (err) return done(err)
					let buffRead = buff.slice(bytesRead, bytesRead + chunkSize)
					// do something with buffRead
					bytesRead += chunkSize
					progressBarLib.update(bytesRead, chunkSize)
					done()
				})
			},
			err => {
				if (err) console.log(err)
				fs.close(fd)
				progressBarLib.stop()
			}
		)
	} catch(e) {
		console.trace(e)
	}
})

db.connect()
	.then(() => {
		log('MongoDB connected')
		http.createServer((req, res) => {
			let url = req.url
			switch(url) {
				case '/load_file':
					loadSvgFile(svgFilename)
					//getFile(svgFilename)
					break
				default: break
			}
			sendFile(res, `src/${getFilename(url)}`, getContentType(url))
		})
		.listen(port, host, () => log(`Server running at http://${host}:${port}/`))
	})
	.catch(error)*/