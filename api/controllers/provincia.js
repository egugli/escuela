	'use strict'

//var path = require('path');
//var fs = require('fs');   // manejo de archivos
var mongoosePaginate = require('mongoose-pagination');

// modelos
var Provincia = require('../models/provincia');


function saveProvincia (req, res){
	var params = req.body;
//	console.log(params);
	var provincia = new Provincia();
	provincia.id = params.id;
	provincia.name = params.name;

	provincia.save((err, provinciaStored) => {
		if (err) return res.status(500).send({message: 'Error en guardar provincia'});

		if (!provinciaStored) return res.status(500).send({message: 'provincia no guardado'});

		return res.status(200).send({provincia: provinciaStored});
	});

	//res.status(200).send({message: 'Hola desde follows'});
}
function updateProvincia (req, res){
	var provinciaId = req.params.id;
	var update = req.body;
/*	var update2: Provincia();
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
	Provincia.findByIdAndUpdate(provinciaId, update, {new:true}, (err, provinciaUpdated) => {		
		if (err) return res.status(500).send({message: 'Error en guardar provincia'});

		if (!provinciaUpdated) return res.status(500).send({message: 'provincia no guardado'});

		return res.status(200).send({provincia: provinciaUpdated});
	});

	//res.status(200).send({message: 'Hola desde follows'});
}
function deleteProvincia (req, res){
	let provinciaId = req.params.id;
//console.log('params:' + req.params)	;

	Provincia.findByIdAndRemove(provinciaId, (err, provinciaRemoved) =>{
		if (err) return res.status(500).send({message: 'Error al eliminar provincia'});
		if (!provinciaRemoved) return res.status(500).send({message: 'No se pudo eliminar provincia'});
		return res.status(200).send({message: 'provincia eliminada'})
	});

} 

function getProvincia(req, res){
	var provinciaId = req.params.id;
//console.log('entro getrole');
	Provincia.findById(provinciaId, (err, provincia) => {
		if(err)  return res.status(500).send({message: 'Error en la peticion de provincia id'});

		if(!provincia) return  res.status(404).send({message: 'provincia no existe'});
//console.log(role);
				return  res.status(200).send({
					provincia

				});
	});
}

// se cambio por https://www.udemy.com/desarrollar-una-red-social-con-javascript-angular-y-nodejs-mongodb/learn/v4/questions/3400526
function getProvincias(req, res){
//	var identity_user_id = req.user.sub;

	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}
	var itemsPerPage = 10;

	Provincia.find().sort('_id').paginate(page, itemsPerPage, (err, provincias, total) => {
		if(err)  return res.status(500).send({message: 'Error en la peticion de provincias'});
		if(!provincias) return  res.status(404).send({message: 'No hay provincias en BD'});


			return  res.status(200).send({
				provincias,
				total,
				pages: Math.ceil(total/itemsPerPage)				

			});
//		});

	});
}


module.exports = {
	saveProvincia,
	deleteProvincia,
	getProvincia,
	getProvincias,
	updateProvincia

}