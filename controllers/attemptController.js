const uuidv4 = require('uuid/v4')
var Game = require('../models/game')
var Player = require('../models/player')
var Contract = require('../models/contract')
var Attempt = require('../models/attempt')
var contractController = require('./contractController')
var Sequelize = require('sequelize')
var sequelize = new Sequelize('sqlite:./Killer.db')
const Op = Sequelize.Op;
const myLog = require('../utils/myLog')

const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

// Display attempt kill form on GET
exports.attemptKillForm = function(req, res) {
    if (!req.query.gameUuid || !req.query.playerUuid) {
        res.redirect('/')
        return
    }

    var getGame = function(){
        return Game.findOne({
            where: {
                uuid: req.query.gameUuid
            }
        })
        .catch(err => {
            myLog.error('attemptController: Failed to get game.\n' + err)
            res.render('shitHappens')
        })
    }

    var getContract = function(){
        return Contract.findOne({
            where: {
                gameUuid: req.query.gameUuid,
                killerUuid: req.query.playerUuid,
                status: 'ACTIVE'
            }
        })
        .catch(err => {
            myLog.error('attemptController: Failed to get killer contract.\n' + err)
            res.render('shitHappens')
        })
    }

    var getPlayer = function(){
        return Player.findOne({
            where: {
                uuid: req.query.playerUuid
            }
        })
        .catch(err => {
            myLog.error('attemptController: Failed to get killer player.\n' + err)
            res.render('shitHappens')
        })
    }

    var getVictims = function(){
        return Player.findAll({
            where: {
                gameUuid: req.query.gameUuid,
                uuid: {
                    [Op.ne]: req.query.playerUuid
                }
            }
        })
        .catch(err => {
            myLog.error('attemptController: Failed to get the list of possible victims.\n' + err)
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
        else if (!contract) {
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
            Player.findOne({
                where: {
                    gameUuid: req.query.gameUuid,
                    uuid: req.query.playerUuid,
                    code: req.body.killerCode
                }
            })
            .then(player => {
                if (!player) {
                    // Killer entered a wrong personnal code
                    res.render('info', { 
                        title: 'Bad attempt',
                        message: 'There are no visible contract with this guy or the personnal codes are wrong, be careful, the game can kill you ...'
                    })
                }
                else {
                    var getContract = function(){
                        return Contract.findOne({
                            where: {
                                gameUuid: req.query.gameUuid,
                                killerUuid: req.query.playerUuid,
                                victimUuid: req.body.victimUuid,
                                status: 'ACTIVE'
                            }
                        })
                        .catch(err => {
                            myLog.error('attemptController: Failed to get killer contract.\n' + err)
                            res.render('shitHappens')
                        })
                    }

                    var getVictim = function(){
                        return Player.findOne({
                            where: {
                                gameUuid: req.query.gameUuid,
                                uuid: req.body.victimUuid,
                                code: req.body.victimCode
                            }
                        })
                        .catch(err => {
                            myLog.error('attemptController: Failed to get victim player.\n' + err)
                            res.render('shitHappens')
                        })
                    }

                    sequelize.Promise.join(getContract(), getVictim(), function(contract, victim){
                        var status = 'FAILURE'
                        if (contract && victim) {
                            status = 'SUCCESS'
                        }
                        var nowISO8601 = new Date().toISOString().split('.')[0]+'Z'
                        var uuid = uuidv4()

                        // Create a Attempt object with escaped and trimmed data.
                        Attempt.create({
                            uuid: uuid,
                            creationDate: nowISO8601,
                            gameUuid: req.query.gameUuid,
                            killerUuid: req.query.playerUuid,
                            victimUuid: req.body.victimUuid,
                            status: status
                        })
                        .then(result => {
                            if (result.status === 'SUCCESS') {
                                contractController.fulfillContract(req.query.gameUuid, req.query.playerUuid, req.body.victimUuid, 'FAILED')
                                res.render('info', { 
                                    title: 'Boom',
                                    message: 'This guy is dead, you will get a new contract soon. Check your mails.'
                                })
                            }
                            else {
                                // Count previous attempts
                                Attempt.count({
                                    where : {
                                        gameUuid: req.query.gameUuid,
                                        killerUuid: req.query.playerUuid,
                                        status: 'FAILURE'
                                    }
                                })
                                .then(result => {
                                    if (result >= 3) {
                                        // Kill the killer by suicide for too many attempts
                                        Contract.findOne({
                                            where: {
                                                gameUuid: req.query.gameUuid,
                                                victimUuid: req.query.playerUuid,
                                                status: 'ACTIVE'
                                            }
                                        })
                                        .then(contract => {
                                            contractController.fulfillContract(contract.gameUuid, contract.killerUuid, contract.victimUuid, 'SUICIDE')
                                            res.render('info', { 
                                                title: 'Suicide !',
                                                message: 'You tried too many times, so the game killed you.'
                                            })
                                        })
                                        .catch(err => {
                                            myLog.error('attemptController: Failed to get the contract of the killer of the killer (where the killer is the victim).\n' + err)
                                            res.render('shitHappens')
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
                                    myLog.error('attemptController: Failed to get attempts count.\n' + err)
                                    res.render('shitHappens')
                                })
                            }
                        })
                        .catch(err => {
                            myLog.error('attemptController: Failed to insert new attempt into.\n' + err)
                            res.render('shitHappens')
                        })
                    })
                }
            })
            .catch(err => {
                myLog.error('attemptController: Failed to get killer player.\n' + err)
                res.render('shitHappens')
            })
        }
    }
]
