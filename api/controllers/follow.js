'use strict'

//var path = require('path');
//var fs = require('fs');   // manejo de archivos
var mongoosePaginate = require('mongoose-pagination');

// modelos
var User = require('../models/user');
var Follow = require('../models/follow');

function saveFollow (req, res){
	var params = req.body;

	var follow = new Follow();
	follow.user = req.user.sub;
	follow.followed = params.followed;

	follow.save((err, followStored) => {
		if (err) return res.status(500).send({message: 'Error en save seguimiento'});

		if (!followStored) return res.status(500).send({message: 'Seguimiento no guardado'});

		return res.status(200).send({follow: followStored});
	});

	//res.status(200).send({message: 'Hola desde follows'});
}

function deleteFollow (req, res){
	var userId = req.user.sub;
	var followId = req.params.id;

	Follow.find({'user': userId, 'followed': followId}).remove(err =>{
		if (err) return res.status(500).send({message: 'Error en dejar de seguir'});

		return res.status(200).send({message: 'Followed eliminado'})
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

function getFollowingUsers (req, res){

	var userId = req.user.sub;
	if (req.params.id && req.params.page){
		userId = req.params.id;
	}

	var page = 1;

	if(req.params.page){
		page = req.params.page;
	} else {
		page = req.params.id;
	}
	var itemsPerPage = 5;

	Follow.find({user: userId}).populate({path: 'followed'}).paginate(page, itemsPerPage, (err, follows, total) => {
		if (err) return res.status(500).send({message: 'Error buscar followers para listar'});

		if(!follows) return res.status(404).send({message: 'No estas siguiendo ningun usuario'});
		followUserIds(req.user.sub).then((value) => {
			return res.status(200).send({
				total: total,
				pages: Math.ceil(total/itemsPerPage),
				follows,
				users_following: value.following,
				users_follow_me: value.followed,
				});
		});
	});
}

function getFollowedgUsers (req, res){

	var userId = req.user.sub;
	if (req.params.id && req.params.page){
		userId = req.params.id;
	}

	var page = 1;

	if(req.params.page){
		page = req.params.page;
	} else {
		pago = req.params.id;
	}
	var itemsPerPage = 5;

	Follow.find({followed: userId}).populate('user').paginate(page, itemsPerPage, (err, follows, total) => {
		if (err) return res.status(500).send({message: 'Error buscar followers para listar'});

		if(!follows) return res.status(404).send({message: 'No te sigue ningun usuario'});

		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			follows
			});
	});
}

// Usuarios listado de usuarios siguientes y seguidos
function getMyFollows(req, res){
	var userId = req.user.sub;
	var find = Follow.find({user: userId});

	if (req.params.followed){
		find = Follow.find({followed: userId});
	}

	find.populate('user followed').exec ((err, follows) => {
		if (err) return res.status(500).send({message: 'Error buscar followers para listar'});

		if(!follows) return res.status(404).send({message: 'No estas siguiendo ningun usuario'});

		return res.status(200).send({
			follows
			});
	});

}
/*
// Usuarios que me siguen
function getFollowBacks(req, res){
	var userId = req.user.sub;

	Follow.find({followed: userId}).populate('user followed').exec ((err, follows) => {
		if (err) return res.status(500).send({message: 'Error buscar followers para listar'});

		if(!follows) return res.status(404).send({message: 'No estas siguiendo ningun usuario'});

		return res.status(200).send({
			follows
			});
	});


}*/
module.exports = {
	saveFollow,
	deleteFollow,
	getFollowingUsers,
	getFollowedgUsers,
	getMyFollows

}