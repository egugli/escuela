'use strict'

//var path = require('path');
//var fs = require('fs');   // manejo de archivos
var mongoosePaginate = require('mongoose-pagination');

// modelos
var Paise = require('../models/paise');


function savePaise (req, res){
	var params = req.body;
//	console.log(params);
	var paise = new Paise();
	paise.id = params.id;
	paise.name = params.name;
	paise.orden = params.orden;

	paise.save((err, paiseStored) => {
		if (err) return res.status(500).send({message: 'Error en guardar pais'});

		if (!paiseStored) return res.status(500).send({message: 'pais no guardado'});

		return res.status(200).send({paise: paiseStored});
	});

	//res.status(200).send({message: 'Hola desde follows'});
}
function updatePaise (req, res){
	var paisId = req.params.id;
	var update = req.body;
/*	var update2: Pais();
	this.update2._id=req.params.id;
	this.update2.id=req.params.id;
	this.update2._id=req.params.id;*/
//	console.log('datos req params'+JSON.stringify(req.params));
//	console.log('datos body'+JSON.stringify(req.body));
//  console.log('datos upd'+JSON.stringify(update));
//	var role = new Role();
//	role.rol = params.rol;
//	role.role_name = params.role_name;

//	role.save((err, roleStored) => {
	Paise.findByIdAndUpdate(paisId, update, {new:true}, (err, paiseUpdated) => {		
		if (err) return res.status(500).send({message: 'Error en guardar pais'});

		if (!paiseUpdated) return res.status(500).send({message: 'pais no guardado'});

		return res.status(200).send({paise: paiseUpdated});
	});

	//res.status(200).send({message: 'Hola desde follows'});
}
function deletePaise (req, res){
	let paisId = req.params.id;
//console.log('params:' + req.params)	;

	Paise.findByIdAndRemove(paisId, (err, paiseRemoved) =>{
		if (err) return res.status(500).send({message: 'Error al eliminar pais'});
		if (!paiseRemoved) return res.status(500).send({message: 'No se pudo eliminar pais'});
		return res.status(200).send({message: 'pais eliminado'})
	});

} 

function getPaise(req, res){
	var paisId = req.params.id;
//console.log('entro getrole');
	Paise.findById(paisId, (err, paise) => {
		if(err)  return res.status(500).send({message: 'Error en la peticion de pais id'});

		if(!paise) return  res.status(404).send({message: 'pais no existe'});
//console.log(role);
				return  res.status(200).send({
					paise

				});
	});
}

// se cambio por https://www.udemy.com/desarrollar-una-red-social-con-javascript-angular-y-nodejs-mongodb/learn/v4/questions/3400526
function getPaises(req, res){
//	var identity_user_id = req.user.sub;

	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}
	var itemsPerPage = 10;

	Paise.find().sort('orden').paginate(page, itemsPerPage, (err, paises, total) => {
//		Paise.find().paginate(page, itemsPerPage, (err, paises, total) => {
		if(err)  return res.status(500).send({message: 'Error en la peticion de paises'});
		if(!paises) return  res.status(404).send({message: 'No hay paises en BD'});


			return  res.status(200).send({
				paises,
				total,
				pages: Math.ceil(total/itemsPerPage)				

			});
//		});

	});
}


module.exports = {
	savePaise,
	deletePaise,
	getPaise,
	getPaises,
	updatePaise

}