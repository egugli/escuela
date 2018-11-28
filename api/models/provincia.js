'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProvinciaSchema = Schema({

	id: String,
	name: String
});

module.exports = mongoose.model('Provincia', ProvinciaSchema);