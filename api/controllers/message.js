'use strict'

var moment = require('moment');
var mongoosePaginate = require('mongoose-pagination');

// modelos
var User = require('../models/user');
var Follow = require('../models/follow');
var Message = require('../models/message');

function probando_mess(req, res){
	res.status(200).send({message: 'Hola desde /probando-mess'});

}

function saveMessage(req, res){

	var params = req.body;
	if(!params.text || !params.receiver) return res.status(200).send({message: 'Faltan campos obligatorios'});

	var message = new Message();
	message.emmiter = req.user.sub;
	message.receiver = params.receiver;
	message.text = params.text;
	message.viewed = 'false';
	message.created_at = moment().unix();

	message.save((err, messageStored) => {
		if(err) return res.status(500).send({message: 'Error peticion message'});

		if(!messageStored) return res.status(500).send({message: 'Error al enviar mesage'});

		return res.status(200).send({message: messageStored});

	});

}

function getReceivedMessages(req, res){
	var userId = req.user.sub;

	var page = 1;


	if(req.params.page){
		page = req.params.page;
	}
	var itemsPerPage = 4; 
// ostrara los campos que intresan del populate 
	Message.find({receiver: userId}).populate('emmiter', 'name surname image  _id').paginate(page, itemsPerPage, (err, messages, total) => {
		if(err) return res.status(500).send({message: 'Error peticional buscar messages'});

		if(!messages) return res.status(404).send({message: 'No hay mensajes'});

		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			messages

		})


	});

}

function getEmmitMessages(req, res){
	var userId = req.user.sub;

	var page = 1;


	if(req.params.page){
		page = req.params.page;
	}
	var itemsPerPage = 4; 
// ostrara los campos que intresan del populate 
	Message.find({emmiter: userId}).populate('emmiter receiver', 'name surname image  _id').paginate(page, itemsPerPage, (err, messages, total) => {
		if(err) return res.status(500).send({message: 'Error peticio nal buscar messages'});

		if(!messages) return res.status(404).send({message: 'No hay mensajes'});

		return res.status(200).send({
			total: total,
			pages: Math.ceil(total/itemsPerPage),
			messages

		})


	});

}

function getUnviewedMessages(req, res){
	var userId = req.user.sub;

	Message.count({receiver: userId, viewed:'false' }).exec((err, count) => {
		if(err) return res.status(500).send({message: 'Error peticion al buscar messages no vistos'});

		return res.status(200).send({
			'unviewed': count
		})
	});
}

function setViewedMessages(req, res){
	var userId = req.user.sub;

	Message.update({receiver: userId, viewed: 'false'}, {viewed: 'true'}, {"multi": true}, (err, messagesUpdated) => {
		if(err) return res.status(500).send({message: 'Error peticion al set messages vistos'});

		return res.status(200).send({
			messages: messagesUpdated
		})

	});
}


module.exports = {
	probando_mess,
	saveMessage,
	getReceivedMessages,
	getEmmitMessages,
	getUnviewedMessages,
	setViewedMessages
}