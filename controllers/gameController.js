const uuidv4 = require('uuid/v4')
var GameModel = require('../models/gameModel')
var PlayerModel = require('../models/playerModel')
var Sequelize = require('sequelize');
var sequelize = new Sequelize('sqlite:./Killer.db')
var mailer = require('../utils/mailer')

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

// Display a list of all Games
exports.gameGetAll = function(req, res) {
	GameModel.findAndCountAll({
		order: [['name', 'ASC']]
	})
	.then(result => {
		res.render('gameList', { 
			title: 'Games List (' + result.count + ')',
			gamesList: result.rows
		})
	})
	.catch(err => {
		res.render('shitHappens')
	})
}

// Display Game creation form on GET
exports.gameCreationForm = function(req, res) {
	res.render('gameCreationForm')
}

// Handle Game creation on POST
exports.gameCreationPost = [
    // Validate fields.
    body('name').isLength({ min: 2 }).trim().withMessage('Name must be specified and contain at least 2 characters.'),
    body('ownerEmail').isLength({ min: 6 }).trim().withMessage('Organizer email must be specified.')
    .isEmail().withMessage('Organizer email must be a valid email address.'),
    body('endDate').isLength({ min: 10, max: 10 }).trim().withMessage('Date must be written with 10 characters, eg. 2019-01-27.')
    .isISO8601({ strict: true }).withMessage('Invalid end date.')
    .isAfter().withMessage('End date must be in the future.'),

    // Sanitize fields.
    sanitizeBody('name').trim().escape(),
    sanitizeBody('ownerEmail').trim().escape(),
    sanitizeBody('endDate').toDate(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('gameForm', { 
            	game: req.body,
            	errors: errors.array() 
            })
            return
        }
        else {
        	var endDateISO8601 = new Date(req.body.endDate).toISOString().split('.')[0]+'Z'
        	var nowISO8601 = new Date().toISOString().split('.')[0]+'Z'
        	var partyCode = Math.floor(Math.random() * 9000 + 1000)
        	var masterCode = Math.floor(Math.random() * 9000 + 1000)

            // Create a GameModel object with escaped and trimmed data.
            GameModel.create({
            	uuid: uuidv4(),
            	creationDate: nowISO8601,
            	name: req.body.name,
            	ownerEmail: req.body.ownerEmail,
            	endDate: endDateISO8601,
            	status: 'PENDING',
            	partyCode: partyCode.toString(),
            	masterCode: masterCode.toString()
            })
            .then(result => {
            	res.render('info', { 
            		title: 'Game created',
            		message: 'Please note the following codes',
            		details: ['Party code (for players to join):', partyCode, 'Master code (to manage the game):', masterCode]
            	})
            })
            .catch(err => {
            	res.render('shitHappens')
            })
        }
    }
    ]

// Display detail page for a specific Game
exports.gameGetOne = function(req, res) {
	var getGame = function(){
		return GameModel.findOne({
			where: {
				uuid: req.params.uuid
			}
		})
		.catch(err => {
			res.render('shitHappens')
		})
	}

	var getPlayers = function(){
		return PlayerModel.findAll({
			where: {
				gameUuid: req.params.uuid
			}
		})
		.catch(err => {
			res.render('shitHappens')
		})
	}

	sequelize.Promise.join(getGame(), getPlayers(), function(game, players){
		res.render('gameDetail', {
			game: game,
			playersList: players
		})
	})
}

// Handle Game validation on POST
exports.gameActivationPost = [
    // Validate fields.
    body('masterCode').isLength({ min: 4, max: 4 }).trim().withMessage('Mastercode must be 4 characters.')
    .isNumeric().withMessage('Mastercode must be numeric.'),
    
    // Sanitize fields.
    sanitizeBody('masterCode').trim().escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('shitHappens', {
            	errors: errors.array() 
            })
            return
        }
        else {
        	// Send email and update game status
        	GameModel.update({
        		status: 'ACTIVE',
        	}, {
        		where: {
        			uuid: req.params.uuid,
        			masterCode: req.body.masterCode
        		},
        		returning: true
        	})
        	.then(result => {
        		if (result[1] == 1) {
        			res.render('info', { 
        				title: 'Game activated',
        				message: 'Players can now kill each other',
        			})
        		}
        		else {
        			res.render('shitHappens')
        		}
        	})
        	.catch(err => {
        		res.render('shitHappens')
        	})
        }
    }
    ]


// Handle Game invitation on POST
exports.gameInvitationPost = [
    // Validate fields.
    body('email').isLength({ min: 6 }).trim().withMessage('Player email must be specified.')
    .isEmail().withMessage('Player email must be a valid email address.'),
    body('masterCode').isLength({ min: 4, max: 4 }).trim().withMessage('Mastercode must be 4 characters.')
    .isNumeric().withMessage('Mastercode must be numeric.'),
    
    
    // Sanitize fields.
    sanitizeBody('email').trim().escape(),
    sanitizeBody('masterCode').trim().escape(),

	// Process request after validation and sanitization.
	(req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('shitHappens', {
            	errors: errors.array() 
            })
            return
        }
        else {
        	// Send email and update game status
        	GameModel.findOne({
        		where: {
        			uuid: req.params.uuid,
        			masterCode: req.body.masterCode
        		},
        		returning: true
        	})
        	.then(result => {
        		if (result) {
		    		// Send email
		    		var message = 'Hey,\n\nJoin my killer game party at this address :\nhttp://localhost:3000/games/' + result.uuid + '/join\n\nSee ya soon.'
		    		mailer.sendMail(req.body.email, 'Join my party', message)
		    		.then(function(info){
		    			console.log(info)
		    			res.render('info', { 
		    				title: 'Invitation sent',
		    				message: 'An email was sent from killerpi.noreply@gmail.com to ' + req.body.email,
		    				details : ['Tell your friend to check the spam box']
		    			})
		    		}).catch(function(err){
		    			console.log(err)
		    			res.render('shitHappens')
		    		})
		    	}
		    	else {
		    		res.render('shitHappens')
		    	}
		    })
        	.catch(err => {
        		res.render('shitHappens')
        	})
        }
    }
    ]
