'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

// cargar rutas
var user_routes = require('./routes/user');
var follow_routes = require('./routes/follow');
var publication_routes = require('./routes/publication');
var message_routes = require('./routes/message');
var role_routes = require('./routes/role');
var provincia_routes = require('./routes/provincia');
var pais_routes = require('./routes/pais');



// middlewares dd bodyparser (midleware es que se ejecuta antes de la peticion)

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


// configurrar cabeceras y cors => permite peticiones desde otros dominios
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});


// configurar rutas body-parser

app.use('/api', user_routes);
app.use('/api', follow_routes);
app.use('/api', publication_routes);
app.use('/api', message_routes);
app.use('/api', role_routes);
app.use('/api', provincia_routes);
app.use('/api', pais_routes);


module.exports = app;
