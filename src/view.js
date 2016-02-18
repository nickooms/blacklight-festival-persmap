class View {
	constructor(bbox) {
		this.left = bbox.min.x |0
		this.top = bbox.min.y |0
		this.width = bbox.width |0
		this.height = bbox.height |0
	}
	get right() {
		return this.left + this.width
	}
	get box() {
		return [this.left, this.top, this.width, this.height].join(',')
	}
	use(svg, storeView) {
		this._svg = $('svg');
		this._svg.setAttribute('viewBox', this.box);
		if (!storeView) View.list.push(this);
		View.active = this;
	}

	static zoomIn() {
		var w = View.active.width;
		var h = View.active.height;
		View.active.left += w / 4;
		View.active.top += h / 4;
		View.active.width = View.active.width / 2;
		View.active.height = View.active.height / 2;
		$('svg').setAttribute('viewBox', [View.active.left, View.active.top, View.active.width, View.active.height].join(','));
	}
	static zoomOut() {
		var w = View.active.width;
		var h = View.active.height;
		View.active.left -= w / 2;
		View.active.top -= h / 2;
		View.active.width = View.active.width * 2;
		View.active.height = View.active.height * 2;
		$('svg').setAttribute('viewBox', [View.active.left, View.active.top, View.active.width, View.active.height].join(','));
	}
	static zoom(factor) {
		var w  = View.active.width, h = View.active.height;
		var left = View.active.left + (w / factor);
		var top = View.active.top + (h / factor);
		var width = w / factor;
		var height = h / factor;
		var bbox = new BBOX();
		bbox.add(new Point(left, top));
		bbox.add(new Point(left + width, top + height));
		var view = new View(bbox);
		view.use($('svg'));
	}
	moveUp() {
		var h = this.height;
		this.top -= h / 10
		this.use(this._svg, false);
	}
	moveLeft() {
		var w = this.width;
		this.left -= w / 10
		this.use(this._svg, false);
	}
	moveDown() {
		var h = this.height;
		this.top += h / 10
		this.use(this._svg, false);
	}
	moveRight() {
		var w = this.width;
		this.left += w / 10
		this.use(this._svg, false);
	}
	static restore() {
		var g = $('g#group-select-lines');
		if (g != null) g.parentNode.removeChild(g);
		View.list.pop();
		var view = View.list[View.list.length - 1];
		var box = view.box;
		svg.setAttribute('viewBox', box);
		View.active = view;
	}
	static bbox() {
		var bboxView = new BBOX(),
		visibleLayers = [...$$('g', $('svg'))]
			.filter(layer => layer.getAttribute('display') === 'visible');
		visibleLayers.forEach(layer => {
			var paths = [...$$('path', layer)];
			paths.forEach(path => {
				var bbox = getBBOX({ d: path.getAttribute('d') });
				bboxView.add(bbox.min);
				bboxView.add(bbox.max);
			});
		});
		return bboxView;
	}
	static fill() {
		var polygon = JSON.parse(localStorage.polygons)[0];
		polygon.push(polygon[0]);
		var filled = `<polygon points="${polygon.map(p => p.join(',')).join(' ')}" fill="${Fluo.Yellow}"/>`;
		$('svg').innerHTML += filled;
		delete localStorage.polygons;

	}
	static init() {
		View.list = [];
		document.body.addEventListener('keyup', doCommand, false);
	}
}

function doCommand(evt) {
	var view = View.active;
	switch (evt.keyCode) {
		case 107: return View.zoomIn();
		case 109: return View.zoomOut();
		case 37: 	return view.moveLeft();
		case 38: 	return view.moveUp();
		case 40: 	return view.moveDown();
		case 39: 	return view.moveRight();
		case 102: return View.reset();
		case 122: return View.fill();
		case 27: 	return View.restore();
		default: break;
	}
}