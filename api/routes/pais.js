'use strict'

var express = require('express');
var PaiseController = require('../controllers/paise');  

var api = express.Router();
var md_auth = require('../middlewares/authenticated');
//var multipart =  require('connect-multiparty');
//var md_upload = multipart({uploadDir: './uploads/users'});

api.post('/pais', md_auth.ensureAuth, PaiseController.savePaise);
api.delete('/pais/:id', md_auth.ensureAuth, PaiseController.deletePaise);
api.get('/pais/:id', md_auth.ensureAuth, PaiseController.getPaise);
api.put('/update-pais/:id', md_auth.ensureAuth, PaiseController.updatePaise);
api.get('/paises/:page?', md_auth.ensureAuth, PaiseController.getPaises);


module.exports = api;