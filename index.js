'use strict'

const

//svgFilename = 'data/Podium A v1-3D.svg',
svgFilename = 'data/Podium C v1-3D.svg',
host = '127.0.0.1',
port = 1337,

fs = require('fs'),
http = require('http'),
jsdom = require('jsdom'),

db = require('./src/db'),
Exception = require('./src/errors'),
Drawing = require('./src/drawing'),
Layer = require('./src/layer'),
model = require('./src/model'),

log = msg => (object => {
	console.log.call(object || {}, msg)
	return object
})(msg),

error = e => console.error(e),

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

getDrawing = path => new Promise((resolve, reject) => {
	log(` Reading "${path}"`)
	readFile(path).then(data => {
		log(` Loaded "${path}" [${data.length} bytes]`)
		log(' Parsing SVG file')
		jsdom.env({
			html: data,
			done: (errors, window) => {
				if (errors) reject(errors)
				resolve(window.document)
			}
		})
	})
	.catch(error)
}),

getLayers = doc => {
	//console.log(`getLayers doc = ${doc}`)
	let layers = [...doc.querySelectorAll('g[id]')].map(g => new Layer(g))
	//console.log(`layers = ${layers}`)
	log(` Found ${layers.length} layers`)
	return Promise.all(layers
		.map(layer => {
			saveLayer(layer).then(() => Promise.all(layer.paths
				.map(path => savePath(path))
			))
			.then(() => layer)
		})
		//.map(() => layer.paths.map(path => savePath(path)))
	)
	.then(() => log(` Saved ${layers.length} layers`))
	.catch(error)
},

saveLayer = layer => layer.save()
	.then(saved => log(`  Saved layer "${saved.name}"`))
	.catch(error),

savePath = path => path.save()
	.then(saved => log(`  Saved path "${saved.id}"`))
	.catch(error),

saveDrawing = drawing => drawing.save()
	.then(saved => log(`  Saved drawing "${saved.name}"`))
	.catch(error),

loadSvgFile = svgFilename => {
	log(`Loading SVG file...`)
	getDrawing(svgFilename)
		.then(svg => {
			//console.log(666)
			let drawing = new Drawing(svgFilename)
			//console.log(777)
			saveDrawing(drawing)
				.then(() => {
					//console.log(888)
					getLayers(svg)
						.then(() => {

							log('SVG file loading complete')
							log('=========================')
						})
				})
		})
}

db.connect().then(() => {
		log('MongoDB connected')
		http.createServer((req, res) => {
			let url = req.url
			switch(url) {
				case '/load_file':
					loadSvgFile(svgFilename)
					break
				default: break
			}
			sendFile(res, `src/${getFilename(url)}`, getContentType(url))
		})
		.listen(port, host, () => log(`Server running at http://${host}:${port}/`))
	})
	.catch(error)