'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = 3800; //process.env.PORT || 3789; // cualquier puerto

mongoose.Promise = global.Promise; 
mongoose.connect('mongodb://localhost:27017/curso_mean_social', {useMongoClient: true}) 
	.then(() => {
			console.log ('conexion BD Ok');
			//crear servidor
			app.listen( port, () =>{
				console.log("Servidor local en ejecucion");
			});
	})
	.catch(err => console.log(err));