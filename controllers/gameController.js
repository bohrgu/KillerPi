var GameModel = require('../models/gameModel')
const uuidv4 = require('uuid/v4')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

// Display a list of all Games
exports.gameGetAll = function(req, res) {
	res.send('NOT IMPLEMENTED: Game GET all')
}

// Display Game creation form on GET
exports.gameCreationForm = function(req, res) {
	res.render('gameForm')
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
            	game: req.body, errors: errors.array() 
            })
            return
        }
        else {
        	var endDateISO8601 = new Date(req.body.endDate).toISOString().split('.')[0]+'Z'
        	var nowISO8601 = new Date().toISOString().split('.')[0]+'Z'
        	var code = Math.floor(Math.random() * 9000 + 1000)

            // Create a GameModel object with escaped and trimmed data.
            GameModel.create({
            	uuid: uuidv4(),
            	creationDate: nowISO8601,
            	name: req.body.name,
            	ownerEmail: req.body.ownerEmail,
            	endDate: endDateISO8601,
            	status: 'PENDING',
            	code: code.toString()
            })
            .then(result => {
            	res.send('Game creation success, code: ' + code)
            })
            .catch(err => {
            	res.send('Game creation failure')
            })
        }
    }
    ]

// Display detail page for a specific Game
exports.gameGetOne = function(req, res) {
	res.send('NOT IMPLEMENTED: Game GET one ' + req.params.uuid)
}
