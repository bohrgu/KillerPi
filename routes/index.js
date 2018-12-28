var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('sqlite:./Killer.db')
var Challenge = require('../models/challenge')


/* GET home page. */
router.get('/', function(req, res, next) {
	sequelize.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.')

		Challenge.findAll()
		.then(challenges => {
			console.log(challenges[0].description)
			res.render('index', { title: challenges[0].description })
		})
		.catch(err => {
			console.error('Failed to get challenges', err)
			res.render('index', { title: 'Shit happens' })
		})
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err)
		res.render('index', { title: 'Shit happens' })
	})
})

module.exports = router;
