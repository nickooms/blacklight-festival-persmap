class LocalStorage {
	constructor() {}
}

class LocalStoragePolygon {
	constructor()
	static init() {
		LocalStorage.polygon = {
			points: []
		}
		return LocalStoragePolygon
	}
	static clear() {
		delete localStorage.polygon
		return LocalStoragePolygon
	}
	static load() {
		LocalStorage.polygon = JSON.parse(localStorage.polygon)
		return LocalStorage.polygon
	}
	static save(polygon) {
		localStorage.polygon = JSON.stringify(LocalStorage.polygon)
		return LocalStoragePolygon
	}
	static start() {
		LocalStoragePolygon
			.clear()
			.init()
	}
}