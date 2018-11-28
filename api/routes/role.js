'use strict'

var express = require('express');
var RoleController = require('../controllers/role');  

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
//var multipart =  require('connect-multiparty');
//var md_upload = multipart({uploadDir: './uploads/users'});

api.post('/role', md_auth.ensureAuth, RoleController.saveRole);
api.delete('/role/:id', md_auth.ensureAuth, RoleController.deleteRole);
api.get('/role/:id', md_auth.ensureAuth, RoleController.getRole);
api.put('/update-role/:id', md_auth.ensureAuth, RoleController.updateRole);
api.get('/roles', md_auth.ensureAuth, RoleController.getRoles);


module.exports = api;