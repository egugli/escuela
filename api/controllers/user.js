'use strict'

// modules
var bcrypt = require('bcrypt-nodejs');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');   // manejo de archivos
var path = require('path');

// modelos
var User = require('../models/user');
var Follow = require('../models/follow');
var Publication = require('../models/publication');

// servicio jwt
var jwt = require('../services/jwt'); 

function home(req, res){
	res.status(200).send({message: 'Hola desde /'});

}
function pruebas(req, res){
	res.status(200).send({message: 'Hola desde /pruebas'});

}


function saveUser(req, res){

	// crear objeto usuario
	var user = new User();

	// recoger parametros peticion
	var params = req.body;


	if (params.password && params.name && params.surname && params.email){
		// asignar valores al usuario
		user.name = params.name;
		user.surname  = params.surname;
//		user.nick = params.nick;
		user.email = params.email;
		user.role = 'ROLE_USER';
		user.image = null;
		user.domi = params.domi;
		user.cp = params.cp;
		user.loca = params.loca
		user.provincia = params.provincia;
		user.sexo = params.sexo;
		user.activo = params.activo;
		user.nacido = params.nacido;


// controlar usuarios duplicados
		User.find({ $or: [
						{email: user.email.toLowerCase()}
//						{nick: user.nick.toLowerCase()}


						]}).exec((err, users) => {

							if (err) return res.status(500).send({message: 'Error en busqueda de usuarios'});

							if(users && users.length >= 1){
								return res.status(200).send({message: 'Usuario ya existe'});
							} else {
// cifra lacontraseña y guarda los datos
							bcrypt.hash(params.password, null, null, (err, hash) => {
									user.password = hash;
									user.save((err, userStored) => {
										if (err) return res.status(500).send({message: 'Error al guardar usuario'});
											
											if (!userStored){
												res.status(404).send({message: 'Usuario no se ha registrado'});
											} else {
												res.status(200).send({user: userStored});
											}
										
									});
							});

							}

						});


		} else {
				res.status(200).send({
			message: 'Introduce los datos correctamente'
		});
		}
}
function loginUser(req, res){

	var params =req.body;

	var email = params.email;
	var password = params.password;

		User.findOne({email: email}, (err, user) => {
			if (err) res.status(500).send({message: 'Error en la peticion'});

			if (user){
				bcrypt.compare(password, user.password, (err, check) => {

					if (check){
						if(params.gettoken){
							//devolver token
							return res.status(200).send({
								
								token: jwt.createToken(user)
							});
						} else {
							// devolver datos usuario
							user.paswword = undefined;
							res.status(200).send({ user });
						}
						

					} else {
							res.status(404).send({
								message: 'Login invalido 1'
							});
					}
				});

			} else {
							res.status(404).send({
								message: 'Login invalido 2'
							});				
			}
		});
}

//}

function getUser(req, res){
	var userId = req.params.id;

	User.findById(userId, (err, user) => {
		if(err)  return res.status(500).send({message: 'Error en la peticion de userid'});

		if(!user) return  res.status(404).send({message: 'Usuario no existe'});

//		Follow.findOne({'user': req.user.sub,'followed': userId}).exec((err, follow) => {
//			if(err)  return res.status(500).send({message: 'Error al comprobar el seguimento'})

//		followThisUser(req.user.sub, userId).then((value) => {
//console.log(user);
				return  res.status(200).send({
					user
//					following: value.following,
//					followed: value.followed
				});
//		}); //followThisUser
				
//	}); //Follow.findOne
	});
}

// se cambio por https://www.udemy.com/desarrollar-una-red-social-con-javascript-angular-y-nodejs-mongodb/learn/v4/questions/3400526
function getUsers(req, res){
	var identity_user_id = req.user.sub;

	var page = 1;

	if(req.params.page){
		page = req.params.page;
	}
	var itemsPerPage = 5;

	User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
		if(err)  return res.status(500).send({message: 'Error en la peticion de users'});
		if(!users) return  res.status(404).send({message: 'No hay usuarios en BD'});

//		followUserIds(identity_user_id).then((value) => {
//	console.log(users);
			return  res.status(200).send({
				users,   // es lo mismo que poner users: users
//				users_following: value.following,
//				users_follow_me: value.followed,
				total,
				pages: Math.ceil(total/itemsPerPage)

			});
//		});

	});
}


//Función Asíncrona para getUsers

async function followUserIds(user_id){

	try{
	    //Obejter los usuarios que seguimos          //El select es para mostrar los campos que yo quiera
	    var following = await Follow.find({'user':user_id }).select({'_id':0, '__v':0, 'user': 0}).exec()
	        .then((following) =>{
	            var follows_clean = [];

	            following.forEach((follow) =>{
	                //console.log("followed", follow.followed);
	                //Guardar los usuarios que yo sigo
	                follows_clean.push(follow.followed);
	            });

	            return follows_clean;
	        })
	        .catch((err)=>{
	            return handleError(err);
	        });

	    //Obejter los usuarios que seguimos          //El select es para mostrar los campos que yo quiera
	    var followed = await Follow.find({'followed':user_id }).select({'_id':0, '__v':0, 'followed': 0}).exec()
	        .then((following) =>{
	            var follows_clean = [];

	            following.forEach((follow) =>{
	                //console.log("user", follow.user);
	                //Guardar los usuarios que yo sigo
	                follows_clean.push(follow.user);
	            });

	            return follows_clean;
	        })
	        .catch((err)=>{
	            return handleError(err);
	        });

	    return {
	        following: following,
	        followed: followed
	    }
	}catch(e){
	    console.log(e);
	}
    
}

/*function getCounters(req, res){
	var userId = req.user.sub;
	if(req.params.id){
		userId =req.params.id;
	} else {

	}
	getCountFollow(userId).then((value) => {
			return res.status(200).send(value);
		});

}*/

/*
async function getCountFollow(user_id){
	var following = await Follow.count({"user": user_id}).exec((err,count) => {
			if(err)  return handleError(err);
			return count;
	});

		var followed = await Follow.count({"followed": user_id}).exec((err,count) => {
			if(err)  return handleError(err);
			return count;
	});

		return {
			following: following,
			followed: followed
		}
}*/
/*async function getCountFollow(user_id){
	try{
		var following = await Follow.count({"user":user_id}).exec()
		.then(count=>{
		return count;
		})
		.catch((err)=>{
		return handleError(err);

		});

		var followed = await Follow.count({"followed":user_id}).exec()
		.then(count=>{
		return count;
		})
		.catch((err)=>{
		return handleError(err);
		});

		var publications = await Publication.count({"user":user_id}).exec()
		.then(count=>{
		return count;
		})
		.catch((err)=>{
		return handleError(err);
		});


	return {
	following:following,
	followed:followed,
	publications: publications
	}

	}catch(e){
	console.log(e);
	}
}*/
function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

// borrae propiedad password x seguridad conviene hacer otro metodo para cambiar password
	delete update.password;
	// solo permitir que el usuario cambie sus datos
	//if (userId != req.user.sub) return res.status(500).send({message: 'No tienes permiso para cambiar estos datos'});

// controlar usuarios duplicados
		User.find({ $or: [
						{email: update.email.toLowerCase()}
//						{nick: update.nick.toLowerCase()}
						

						]}).exec((err, users) => {
							var user_isset = false;
							users.forEach((user) => {
								if(user && user._id != userId) user_isset = true;	
							});
							
							if(user_isset) return  res.status(404).send({message: 'Datos de usuario posiblemente duplicados'});	

							User.findByIdAndUpdate(userId, update, {new:true}, (err,userUpdated) => {
								if(err)  return res.status(500).send({message: 'Error en la peticion de user update'});

								if(user_isset) return  res.status(404).send({message: 'Usuario no encontrado'});

								return  res.status(200).send({user: userUpdated});
							});
						});








}


function uploadImage(req, res){
	var userId = req.params.id;
	var file_name = 'No subido';

	if (req.files) {
		var file_path = req.files.image.path;
		var file_split = file_path.split('\\');
		var file_name = file_split[2];

		var ext_split = file_name.split('\.');
		var file_ext = ext_split[1]
// solo permitir que el usuario suba su imagen
		if (userId != req.user.sub) {
			return removeFilesOfUploads(res, file_path,'No tienes permiso para subir imagen');
		}


		if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif'){


			User.findByIdAndUpdate(userId, {image: file_name}, {new:true}, (err, userUpdated) => {
				if(err)  return res.status(500).send({message: 'Error en la peticion de user update'});

				if(!userUpdated) return  res.status(404).send({message: 'Usuario no encontrado'});

				return  res.status(200).send({user: userUpdated});				

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
	var path_file = './uploads/users/'+imageFile;

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
	pruebas,
	home,
	saveUser,
	loginUser,
	getUser,
	getUsers,
	updateUser,
	uploadImage,
	getImageFile
}