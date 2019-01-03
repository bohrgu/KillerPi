const uuidv4 = require('uuid/v4')
var models = require('../models')
var mailer = require('../utils/mailer')
const base64url = require('base64url')
var contractController = require('./contractController')
var baseURL = require('../utils/baseURL')
const myLog = require('../utils/myLog')
var Promise = require('bluebird')

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

// Display a list of all Games
exports.gameGetAll = function(req, res) {
	models.Game.findAndCountAll({
		order: [['name', 'ASC']]
	})
	.then(result => {
		res.render('gameList', { 
			title: 'Games List (' + result.count + ')',
			gamesList: result.rows
		})
	})
	.catch(err => {
        myLog.error('gameController: Failed to get all games and count.\n' + err)
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
        	var uuid = uuidv4()

            // Create a Game object with escaped and trimmed data.
            models.Game.create({
            	uuid: uuid,
            	creationDate: nowISO8601,
            	name: req.body.name,
            	ownerEmail: req.body.ownerEmail,
            	endDate: endDateISO8601,
            	status: 'PENDING',
            	partyCode: partyCode.toString(),
            	masterCode: masterCode.toString()
            })
            .then(result => {
		    		// Create email message
		    		var gameURL = baseURL.baseURL + '/games/'
		    		var message = 'Hey,\n\nYour party "' + req.body.name + '" was created.\
		    		\n\nTo invite players you can use the following management page:\
		    		\n' + gameURL + uuid + '\
		    		\nor you can send them a direct link:\
		    		\n' + gameURL + uuid + '/join\
		    		\nIf you send a direct link you need to send the party code to your guests to allow them to join: ' + partyCode + '\
		    		\n\nAnd you will need your master code to manage your game (keep it secret): ' + masterCode + '\
		    		\n\nWhen all players will have joined, you will be able to start the game from the management page:\
		    		\n' + gameURL + uuid + '\
		    		\n\nSee ya soon.'

		    		// Send confirmation email
		    		mailer.sendMail(req.body.ownerEmail, 'Killer party created', message)

		    		// Present success page
		    		res.render('info', { 
		    			title: 'Game created',
		    			message: 'A confirmation email was sent to your address but you should note the following codes',
		    			details: ['Party code (for players to join):', partyCode, 'Master code (to manage the game):', masterCode]
		    		})
		    	})
            .catch(err => {
                myLog.error('gameController: Failed to insert new game into table.\n' + err)
            	res.render('shitHappens')
            })
        }
    }
    ]

// Display detail page for a specific Game
exports.gameGetOne = function(req, res) {
	var getGame = function(){
		return models.Game.findOne({
			where: {
				uuid: req.params.uuid
			}
		})
		.catch(err => {
            myLog.error('gameController: Failed to get game.\n' + err)
			res.render('shitHappens')
		})
	}

	var getPlayers = function(){
		return models.Player.findAll({
			where: {
				gameUuid: req.params.uuid
			}
		})
		.catch(err => {
            myLog.error('gameController: Failed to get game players.\n' + err)
			res.render('shitHappens')
		})
	}

	Promise.join(getGame(), getPlayers(), function(game, players){
		// TODO: deactivate game if end date is in the past
		res.render('gameDetail', {
			game: game,
			players: players
		})
	})
}

// Handle Game activation on POST
exports.gameActivationPost = [
    // Validate fields.
    body('masterCode').isLength({ min: 4, max: 4 }).trim().withMessage('Master code must be 4 characters.')
    .isNumeric().withMessage('Master code must be numeric.'),
    
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
        	models.Game.update({
        		status: 'ACTIVE',
        	}, {
        		where: {
        			uuid: req.params.uuid,
        			masterCode: req.body.masterCode,
        			status: 'PENDING'
        		}
        	})
        	.then(result => {
        		if (result == 1) {
        			contractController.generateContracts(req.params.uuid)
        			res.render('info', {
        				title: 'Game activated',
        				message: 'Players can now kill each other'
        			})
        		}
        		else {
		    		res.render('info', { 
		    			title: 'Failure',
		    			message: 'Invalid parameters or game already activated.'
		    		})
        		}
        	})
        	.catch(err => {
                myLog.error('gameController: Failed to activate game.\n' + err)
        		res.render('shitHappens')
        	})
        }
    }
    ]

// Handle Game deactivation on POST
exports.gameDeactivationPost = [
    // Validate fields.
    body('masterCode').isLength({ min: 4, max: 4 }).trim().withMessage('Master code must be 4 characters.')
    .isNumeric().withMessage('Master code must be numeric.'),
    
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
        	models.Game.update({
        		status: 'PENDING',
        	}, {
        		where: {
        			uuid: req.params.uuid,
        			masterCode: req.body.masterCode,
        			status: 'ACTIVE'
        		}
        	})
        	.then(result => {
        		if (result == 1) {
        			contractController.deleteActiveContracts(req.params.uuid)
        			res.render('info', {
        				title: 'Game deactivated',
        				message: 'All active contracts were revoked.'
        			})
        		}
        		else {
		    		res.render('info', { 
		    			title: 'Failure',
		    			message: 'Invalid parameters or game already deactivated.'
		    		})
        		}
        	})
        	.catch(err => {
                myLog.error('gameController: Failed to deactivate game.\n' + err)
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
    body('masterCode').isLength({ min: 4, max: 4 }).trim().withMessage('Master code must be 4 characters.')
    .isNumeric().withMessage('Master code must be numeric.'),
    
    
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
        	models.Game.findOne({
        		where: {
        			uuid: req.params.uuid,
        			masterCode: req.body.masterCode
        		}
        	})
        	.then(result => {
        		if (result) {
		    		// Send email
		    		var gameURL = baseURL.baseURL + '/games/'
		    		var base64URLEmail = base64url(req.body.email)
		    		var message = 'Hey,\n\nJoin my killer party by following this link :\
		    		\n' + gameURL + result.uuid + '/join?email=' + base64URLEmail + '&partyCode=' + result.partyCode + '\
		    		\n\nSee ya soon.'
		    		mailer.sendMail(req.body.email, 'Join my killer party', message)
		    		.then(function(info){
		    			res.render('info', { 
		    				title: 'Invitation sent',
		    				message: 'An invitation email was sent to ' + req.body.email,
		    				details : ['Tell your friend to check the spam box']
		    			})
		    		}).catch(function(err){
		    			res.render('info', { 
		    				title: 'Invitation failure',
		    				message: 'There was an issue while sending invitation email to ' + req.body.email
		    			})
		    		})
		    	}
		    	else {
		    		res.render('info', { 
		    			title: 'Wrong code',
		    			message: 'The master code you entered is wrong.'
		    		})
		    	}
		    })
        	.catch(err => {
                myLog.error('gameController: Failed to get game.\n' + err)
        		res.render('shitHappens')
        	})
        }
    }
    ]

// Display form to join a specific Game on GET
exports.gameJoinForm = function(req, res) {
	models.Game.findOne({
		where: {
			uuid: req.params.uuid
		}
	})
	.then(result => {
		if (result) {
			if (result.status==='PENDING') {
				var email
				if (req.query.email) {
					email = base64url.decode(req.query.email)
				}
				res.render('gameJoinForm', {
					game: result,
					email: email,
					partyCode: req.query.partyCode
				})
			}
			else {
				res.render('info', { 
					title: 'No pending game',
					message: 'This game is outdated or active. You cannot join it.'
				})
			}
		}
		else {
            myLog.error('gameController: No game returned by query.\n')
			res.render('shitHappens')
		}
	})
	.catch(err => {
        myLog.error('gameController: Failed to get game.\n' + err)
		res.render('shitHappens')
	})
}

// Handle Game join request on POST
exports.gameJoinPost = [
    // Validate fields.
    body('firstName').isLength({ min: 2 }).trim().withMessage('First name must be specified and contain at least 2 characters.'),
    body('lastName').isLength({ min: 2 }).trim().withMessage('Last name must be specified and contain at least 2 characters.'),
    body('email').isLength({ min: 6 }).trim().withMessage('Player email must be specified.')
    .isEmail().withMessage('Player email must be a valid email address.'),
    body('partyCode').isLength({ min: 4, max: 4 }).trim().withMessage('Party code must be 4 characters.')
    .isNumeric().withMessage('Party code must be numeric.'),
    
    
    // Sanitize fields.
    sanitizeBody('firstName').trim().escape(),
    sanitizeBody('lastName').trim().escape(),
    sanitizeBody('email').trim().escape(),
    sanitizeBody('partyCode').trim().escape(),

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
        	models.Game.findOne({
        		where: {
        			uuid: req.params.uuid,
        			partyCode: req.body.partyCode
        		}
        	})
        	.then(game => {
        		if (game) {
        			models.Player.findOne({
        				where: {
        					gameUuid: req.params.uuid,
        					email: req.body.email
        				}
        			})
        			.then(player => {
        				if (player) {
        					res.render('info', { 
        						title: 'WTF?',
        						message: 'You already are in this party dummy !'
        					})
        				}
        				else {
        					var nowISO8601 = new Date().toISOString().split('.')[0]+'Z'
        					var playerCode = Math.floor(Math.random() * 9000 + 1000)
        					var uuid = uuidv4()

				            // Create a Player object with escaped and trimmed data.
				            models.Player.create({
				            	uuid: uuid,
				            	creationDate: nowISO8601,
				            	gameUuid: game.uuid,
				            	firstName: req.body.firstName,
				            	lastName: req.body.lastName,
				            	email: req.body.email,
				            	code: playerCode.toString()
				            })
				            .then(result => {
					    		// Create email message
					    		var attemptURL = baseURL.baseURL + '/attempts?gameUuid=' + game.uuid + '&playerUuid=' + uuid
					    		var message = 'Hey,\n\nYou\'ve successfully joined party "' + game.name + '".\
					    		\n\nTo attempt a kill you need to use the following link:\
					    		\n' + attemptURL + '\
					    		\nTo validate a kill you will need your personnal code (keep it secret): ' + playerCode + '\
					    		\nAnd you will need the personnal code of the one you killed.\
					    		\nSo only reveal your personnal code if someone killed you !\
					    		\n\nSee ya soon.'

					    		// Send confirmation email
					    		mailer.sendMail(req.body.email, 'Successfully joined party', message)

					    		// Present success page
					    		res.render('info', { 
					    			title: 'Successfully joined party',
					    			message: 'A confirmation email was sent to your address but you should note the following code',
					    			details: ['Player code (to validate kills):', playerCode, 'Only reveal it if someone killed you', 'Here is the URL to attempt a kill:', attemptURL]
					    		})
					    	})
				            .catch(err => {
                                myLog.error('gameController: Failed to insert new player into table.\n' + err)
				            	res.render('shitHappens')
				            })
				        }
				    })
        			.catch(err => {
                        myLog.error('gameController: Failed to get player for a given email in the given game.\n' + err)
        				res.render('shitHappens')
        			})
        		}
        		else {
                    myLog.error('gameController: No game returned by query.\n')
        			res.render('shitHappens')
        		}
        	})
        	.catch(err => {
                myLog.error('gameController: Failed to get game.\n' + err)
        		res.render('shitHappens')
        	})
        }
    }
    ]
