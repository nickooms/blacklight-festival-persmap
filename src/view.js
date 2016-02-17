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
		console.log('zoomIn');
		var w = View.active.width;
		var h = View.active.height;
		View.active.left += w / 4;
		View.active.top += h / 4;
		View.active.width = View.active.width / 2;
		View.active.height = View.active.height / 2;
		$('svg').setAttribute('viewBox', [View.active.left, View.active.top, View.active.width, View.active.height].join(','));
	}
	static zoomOut() {
		console.log('zoomOut');
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
		console.log(left, top, width, height);
		var bbox = new BBOX();
		bbox.add(new Point(left, top));
		bbox.add(new Point(left + width, top + height));
		console.log(bbox);
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
		console.log(box);
		svg.setAttribute('viewBox', box);
		View.active = view;
	}
	static bbox() {
		//console.time('View.bbox()');
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
		//console.timeEnd('View.bbox()');
		//console.log(bboxView.toString());
		return bboxView;
	}
	static init() {
		View.list = [];
		document.body.addEventListener('keyup', function(evt) {
			switch (evt.keyCode) {
				case 107: View.zoomIn(); break;
				case 109: View.zoomOut(); break;
				case 37: View.active.moveLeft(); break;
				case 38: View.active.moveUp(); break;
				case 40: View.active.moveDown(); break;
				case 39: View.active.moveRight(); break;
				case 102: View.reset(); break;
				case 27: console.log('restore'); View.restore(); console.log(View.list);break;
				default:
					//console.log(event.keyCode);
					break;
			}
		}, false);
	}
}