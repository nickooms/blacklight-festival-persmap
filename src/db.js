const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/test')

const db = mongoose.connection,

connect = () => new Promise((resolve, reject) => {
	db.on('error', () => reject('connection error'))
	db.once('open', () => resolve())
})

module.exports = { db, connect }