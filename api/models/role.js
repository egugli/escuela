'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoleSchema = Schema({

	rol: String,
	role_name: String
});

module.exports = mongoose.model('Role', RoleSchema);