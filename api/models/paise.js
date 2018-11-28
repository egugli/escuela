'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaiseSchema = Schema({

	id: String,
	name: String,
	orden: String
});

module.exports = mongoose.model('Paise', PaiseSchema);