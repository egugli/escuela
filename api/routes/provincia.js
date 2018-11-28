'use strict'

var express = require('express');
var ProvinciaController = require('../controllers/provincia');  

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
//var multipart =  require('connect-multiparty');
//var md_upload = multipart({uploadDir: './uploads/users'});

api.post('/provincia', md_auth.ensureAuth, ProvinciaController.saveProvincia);
api.delete('/provincia/:id', md_auth.ensureAuth, ProvinciaController.deleteProvincia);
api.get('/provincia/:id', md_auth.ensureAuth, ProvinciaController.getProvincia);
api.put('/update-provincia/:id', md_auth.ensureAuth, ProvinciaController.updateProvincia);
api.get('/provincias/:page?', md_auth.ensureAuth, ProvinciaController.getProvincias);


module.exports = api;