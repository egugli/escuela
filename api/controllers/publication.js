'use strict'


var fs = require('fs');   // manejo de archivos
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');
var moment = require('moment');

// modelos
var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');


function probando(req, res){
	res.status(200).send({message: 'Hola desde /probando'});

}

function savePublication(req, res){
	var params = req.body;

	if(!params.text) return res.status(500).send({message: 'Texto es obligatorio'});

	var publication = new Publication();
	publication.text = params.text;
	publication.file = null;
	publication.user = req.user.sub;
	publication.created_at = moment().unix()

	publication.save((err, publicationStored) => {
		if(err) return res.status(500).send({message: 'Error al guardar publicacion'});

		if(!publicationStored) return res.status(404).send({message: 'Publicacion no se guardo'});

		return res.status(200).send({publication: publicationStored});

	});
}

//lista todas publicaciones de usuarios que sigo
function getPublications(req, res){

	var page = 1;
	if (req.params.page){
		page = req.params.page;
	}
	var itemsPerPage = 4;

	Follow.find({user: req.user.sub}).populate('followed').exec((err, follows) => {
		if(err) return res.status(500).send({message: 'Error al devolver el seguimiento'});

		//array de los id en claro de los usuaios que sigo
		var follows_clean = [];

		follows.forEach((follow) => {
			follows_clean.push(follow.followed);
		});
//		console.log(follows_clean);

		Publication.find({user: {"$in": follows_clean}}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
				if(err) return res.status(500).send({message: 'Error al devolver publicaciones'});

				if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

				return res.status(200).send({
					total_items: total,
					pages: Math.ceil(total/itemsPerPage),
					page: page,
					items_per_page: itemsPerPage,
					publications

				});
		});

	})
}


function getPublicationsUser(req, res){

	var page = 1;
	if (req.params.page){
		page = req.params.page;
	}
	var itemsPerPage = 4;
	var user = req.user.sub;
	if(req.params.user){
		user = req.params.user
	}

//		console.log(follows_clean);

		Publication.find({user: user}).sort('-created_at').populate('user').paginate(page, itemsPerPage, (err, publications, total) => {
				if(err) return res.status(500).send({message: 'Error al devolver publicaciones'});

				if(!publications) return res.status(404).send({message: 'No hay publicaciones'});

				return res.status(200).send({
					total_items: total,
					pages: Math.ceil(total/itemsPerPage),
					page: page,
					items_per_page: itemsPerPage,
					publications

				});
		});

	
}

function getPublication(req, res){
	var publicationId = req.params.id;

	Publication.findById(publicationId, (err, publication) => {
		if(err) return res.status(500).send({message: 'Error al buscar publicacion'});

		if(!publication) return res.status(404).send({message: 'No existe publicacion'});

				return res.status(200).send({
					publication
				});

	});
}

function deletePublication(req, res){
//  PROBAR BIEN PORQUE NO PROBE POR FALTA DE PUBLICACIONEs (Clase 43)
	var publicationId = req.params.id;

	Publication.find({'user': req.user.sub, '_id': publicationId}).remove (err => {
		if(err) return res.status(500).send({message: 'Error al borrar publicacion'});

		//if(!publicationRemoved) return res.status(404).send({message: 'No se borró la publicacion'});

				return res.status(200).send({
					message: 'Publication eliminada'
				});
	});
}

function uploadImage(req, res){
	var publicationId = req.params.id;
	var file_name = 'No subido';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1]



		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){


			Publication.findOne({'user': req.user.sub, '_id': publicationId}).exec((err, publication) => {

				if(publication){
					Publication.findByIdAndUpdate(publicationId, {file: file_name}, {new:true}, (err, publicationUpdated) => {
						if(err)  return res.status(500).send({message: 'Error en la peticion de user update'});

						if(!publicationUpdated) return  res.status(404).send({message: 'Publicacion no encontrada'});

						return  res.status(200).send({publication: publicationUpdated});				

					});
				} else {
					
					return removeFilesOfUploads(res, file_path, 'Sin permiso para borrar' );
				}
			});
		} else {
			return removeFilesOfUploads(res, file_path, 'Tipo de archivo inválido, fichero borrado' );
		}


	} else //req.files
		{
			return  res.status(200).send({message: 'No se han subido archivos'});
		}
}

function removeFilesOfUploads(res, file_path, message){
			fs.unlink(file_path,(err) => {

				return	res.status(200).send({message: message});

			});	
}

function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/publications/'+imageFile;

/*	fs.exists(path_file, function(exists){
		if (exists){
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(404).send({message: 'La imagen no existe'});
		}
	})*/
	fs.access(path_file, (err) => {
		if (!err){
			res.sendFile(path.resolve(path_file));
		} else {
			res.status(404).send({message: 'La imagen no existe'});
		}
	})	
}


module.exports = {
	probando,
	savePublication,
	getPublications,
	getPublication,
	deletePublication,
	uploadImage,
	getImageFile,
	getPublicationsUser
}