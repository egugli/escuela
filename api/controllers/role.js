	'use strict'

//var path = require('path');
//var fs = require('fs');   // manejo de archivos
var mongoosePaginate = require('mongoose-pagination');

// modelos
var Role = require('../models/role');


function saveRole (req, res){
	var params = req.body;
//	console.log(params);
	var role = new Role();
	role.rol = params.rol;
	role.role_name = params.role_name;

	role.save((err, roleStored) => {
		if (err) return res.status(500).send({message: 'Error en guardar rol'});

		if (!roleStored) return res.status(500).send({message: 'Rol no guardado'});

		return res.status(200).send({role: roleStored});
	});

	//res.status(200).send({message: 'Hola desde follows'});
}
function updateRole (req, res){
	var roleId = req.params.id;
	var update = req.body;
//console.log('datos upd'+update);
//	var role = new Role();
//	role.rol = params.rol;
//	role.role_name = params.role_name;

//	role.save((err, roleStored) => {
	Role.findByIdAndUpdate(roleId, update, {new:true}, (err, roleUpdated) => {		
		if (err) return res.status(500).send({message: 'Error en guardar rol'});

		if (!roleUpdated) return res.status(500).send({message: 'Rol no guardado'});

		return res.status(200).send({role: roleUpdated});
	});

	//res.status(200).send({message: 'Hola desde follows'});
}
function deleteRole (req, res){
	let roleId = req.params.id;
//console.log('params:' + req.params)	;

	Role.findByIdAndRemove(roleId, (err, roleRemoved) =>{
		if (err) return res.status(500).send({message: 'Error al eliminar rol'});
		if (!roleRemoved) return res.status(500).send({message: 'No se pudo eliminar rol'});
		return res.status(200).send({message: 'Rol eliminado'})
	});

} 

function getRole(req, res){
	var roleId = req.params.id;
//console.log('entro getrole');
	Role.findById(roleId, (err, role) => {
		if(err)  return res.status(500).send({message: 'Error en la peticion de role id'});

		if(!role) return  res.status(404).send({message: 'Rol no existe'});
//console.log(role);
				return  res.status(200).send({
					role

				});
	});
}

// se cambio por https://www.udemy.com/desarrollar-una-red-social-con-javascript-angular-y-nodejs-mongodb/learn/v4/questions/3400526
function getRoles(req, res){
//	var identity_user_id = req.user.sub;

//console.log('entro en get roles');

	Role.find({}).exec(function(err, roles)  {
		if(err)  return res.status(500).send({message: 'Error en la peticion de users'});
		if(!roles) return  res.status(404).send({message: 'No hay roles en BD'});


			return  res.status(200).send({
				roles

			});
//		});

	});
}


module.exports = {
	saveRole,
	deleteRole,
	getRole,
	getRoles,
	updateRole

}