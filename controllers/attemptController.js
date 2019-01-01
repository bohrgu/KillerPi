const uuidv4 = require('uuid/v4')
var GameModel = require('../models/gameModel')
var PlayerModel = require('../models/playerModel')
var ContractModel = require('../models/contractModel')
var AttemptModel = require('../models/attemptModel')
var Sequelize = require('sequelize')
var sequelize = new Sequelize('sqlite:./Killer.db')
const Op = Sequelize.Op;
var mailer = require('../utils/mailer')

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

// Display attempt kill form on GET
exports.attemptKillForm = function(req, res) {
    if (!req.query.gameUuid || !req.query.playerUuid) {
        res.redirect('/')
        return
    }

    var getGame = function(){
        return GameModel.findOne({
            where: {
                uuid: req.query.gameUuid
            }
        })
        .catch(err => {
            res.render('shitHappens')
        })
    }

    var getContract = function(){
        return ContractModel.findOne({
            where: {
                gameUuid: req.query.gameUuid,
                killerUuid: req.query.playerUuid,
                status: 'ACTIVE'
            }
        })
        .catch(err => {
            res.render('shitHappens')
        })
    }

    var getPlayer = function(){
        return PlayerModel.findOne({
            where: {
                uuid: req.query.playerUuid
            }
        })
        .catch(err => {
            res.render('shitHappens')
        })
    }

    var getVictims = function(){
        return PlayerModel.findAll({
            where: {
                gameUuid: req.query.gameUuid,
                uuid: {
                    [Op.ne]: req.query.playerUuid
                }
            }
        })
        .catch(err => {
            res.render('shitHappens')
        })
    }

    sequelize.Promise.join(getGame(), getContract(), getPlayer(), getVictims(), function(game, contract, player, victims){
        if (game.status!=='ACTIVE') {
            res.render('info', { 
                title: 'No active game',
                message: 'This game is outdated or not active yet.'
            })
        }
        else if (contract) {
            res.render('info', { 
                title: 'No active contract',
                message: 'Seems like you\'re dead dude.'
            })
        }
        else {
            res.render('attemptKillForm', {
                player: player,
                victims: victims
            })
        }
    })
}

// Handle attempt kill on POST
exports.attemptKillPost = [
    // Validate fields.
    body('killerCode').isLength({ min: 4, max: 4 }).trim().withMessage('Killer code must be 4 characters.')
    .isNumeric().withMessage('Killer code must be numeric.'),
    body('victimUuid').isLength({ min: 2 }).trim().withMessage('Victim uuid must be specified and contain at least 2 characters.'),
    body('victimCode').isLength({ min: 4, max: 4 }).trim().withMessage('Victim code must be 4 characters.')
    .isNumeric().withMessage('Victim code must be numeric.'),

    // Sanitize fields.
    sanitizeBody('killerCode').trim().escape(),
    sanitizeBody('victimUuid').trim().escape(),
    sanitizeBody('victimCode').trim().escape(),

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
            // TODO: check killer code first
            // TODO: check contract existence and victim code
            ContractModel.findOne({
                where: {
                    gameUuid: req.query.gameUuid,
                    killerUuid: req.query.playerUuid,
                    victimUuid: req.body.victimUuid,
                    status: 'ACTIVE'
                }
            })
            .then(contract => {
                var status = 'FAILURE'
                if (contract) {
                    status = 'SUCCESS'
                }
                var nowISO8601 = new Date().toISOString().split('.')[0]+'Z'
                var uuid = uuidv4()

                // Create a AttemptModel object with escaped and trimmed data.
                AttemptModel.create({
                    uuid: uuid,
                    creationDate: nowISO8601,
                    gameUuid: req.query.gameUuid,
                    killerUuid: req.query.playerUuid,
                    victimUuid: req.body.victimUuid,
                    status: status
                })
                .then(result => {
                    if (result.status === 'SUCCESS') {
                        // TODO: update killer contract and copy victim contract
                        res.render('info', { 
                            title: 'Boom',
                            message: 'This guy is dead, you will get a new contract soon.'
                        })
                    }
                    else {
                        res.render('info', { 
                            title: 'Bad attempt',
                            message: 'There are no visible contract with this guy or the personnal codes are wrong, be careful, the game can kill you ...'
                        })
                    }
                })
                .catch(err => {
                    res.render('shitHappens')
                })
            })
            .catch(err => {
                res.render('shitHappens')
            })
        }
    }
    ]
