'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
	name: String,
	surname: String,
//	nick: String,
	email: String,
	password: String,
	image: String,
	role: String,
	domi: String,
	cp: String,
	loca: String,
	provincia: String,
	sexo: String,
	activo: String,
	nacido:String,
	pariente: String	
});

module.exports = mongoose.model('User', UserSchema);