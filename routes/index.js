var express = require('express');
var router = express.Router();
var Sequelize = require('sequelize');
var sequelize = new Sequelize('sqlite:./Killer.db')
var Challenge = require('../models/challenge')
var Game = require('../models/game')


/* GET home page. */
router.get('/', function(req, res, next) {
	sequelize.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.')

		Challenge.findAndCountAll({
			limit: 2
		})
		.then(result => {
			const resultText = result.rows[0].description + ' ' + result.count
			console.log(resultText);-
			res.render('index', { title: resultText })
		})
		.catch(err => {
			console.error('Failed to get challenges', err)
			res.render('index', { title: 'Shit happens' })
		})

		Game.create({
			uuid: 'cd4ab894-93a0-4ddc-a4aa-f83d7518d70f',
			name: 'birthday test',
			creationDate: '2018-12-28T15:38:26Z',
			endDate: '2019-01-07T08:00:00Z',
			status: 'PENDING',
			code: '1664'
		})
	})
	.catch(err => {
		console.error('Unable to connect to the database:', err)
		res.render('index', { title: 'Shit happens' })
	})
})

module.exports = router;
