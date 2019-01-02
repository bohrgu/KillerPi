const uuidv4 = require('uuid/v4')
var Player = require('../models/player')
var Contract = require('../models/contract')
var Challenge = require('../models/challenge')
var Game = require('../models/game')
var mailer = require('../utils/mailer')
var Sequelize = require('sequelize')
var sequelize = new Sequelize('sqlite:./Killer.db')
var baseURL = require('../utils/baseURL')

exports.generateContracts = function(gameUuid) {
    var getPlayers = function(){
        return Player.findAll({
            where: {
                gameUuid: gameUuid
            }
        })
        .catch(err => {
            console.error('contractController: Failed to get players to generate contracts: ' + gameUuid + '\n' + err)
        })
    }

    var getChallenges = function(){
        return Challenge.findAll()
        .catch(err => {
            console.error('contractController: Failed to get challenges.\n' + err)
        })
    }

    sequelize.Promise.join(getPlayers(), getChallenges(), function(players, challenges){
        if (players.length > 0 && challenges.length > 0) {
            shuffle(players)
            var i
            for (i = 0; i < players.length; i++) {
                var challengeRandomIndex = Math.floor(Math.random() * challenges.length)
                var challengeUuid = challenges[challengeRandomIndex].uuid
                var killerUuid = players[i].uuid
                var victimUuid = players[(i+1)%players.length].uuid
                exports.createAndSendContract(gameUuid, killerUuid, victimUuid, challengeUuid)
            }
        }
        else {
            console.error('contractController: No players or no challenges.')
        }
    })
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}

exports.deleteActiveContracts = function(gameUuid) {
    Contract.update({
        status: 'REVOKED',
    }, {
        where: {
            gameUuid: gameUuid,
            status: 'ACTIVE'
        },
        returning: true
    })
    .then(result => {
        console.error('contractController: Succeed to revoke all active contracts associated with game: ' + gameUuid)
    })
    .catch(err => {
        console.error('contractController: Failed to revoke all active contracts associated with game: ' + gameUuid + '\n' + err)
    })
}

exports.createAndSendContract = function(gameUuid, killerUuid, victimUuid, challengeUuid) {
    var uuid = uuidv4()
    var nowISO8601 = new Date().toISOString().split('.')[0]+'Z'

    Contract.create({
        uuid: uuid,
        creationDate: nowISO8601,
        gameUuid: gameUuid,
        killerUuid: killerUuid,
        victimUuid: victimUuid,
        challengeUuid: challengeUuid,
        status: 'ACTIVE'
    })
    .then(contract => {
        sendContractEmail(contract)
    })
    .catch(err => {
        console.error('contractController: Failed to create contract.\n' + err)
    })
}

function sendContractEmail(contract) {
    var getGame = function(){
        return Game.findOne({
            where: {
                uuid: contract.gameUuid
            }
        })
        .catch(err => {
            console.error('contractController: Failed to retrieve game info.\n' + err)
        })
    }

    var getKiller = function(){
        return Player.findOne({
            where: {
                uuid: contract.killerUuid
            }
        })
        .catch(err => {
            console.error('contractController: Failed to retrieve killer info.\n' + err)
        })
    }

    var getVictim = function(){
        return Player.findOne({
            where: {
                uuid: contract.victimUuid
            }
        })
        .catch(err => {
            console.error('contractController: Failed to retrieve victim info.\n' + err)
        })
    }

    var getChallenge = function(){
        return Challenge.findOne({
            where: {
                uuid: contract.challengeUuid
            }
        })
        .catch(err => {
            console.error('contractController: Failed to retrieve challenge info.\n' + err)
        })
    }

    sequelize.Promise.join(getGame(), getKiller(), getVictim(), getChallenge(), function(game, killer, victim, challenge){
        if (game && killer && victim && challenge) {
            // Create email message
            var attemptURL = baseURL.baseURL + '/attempts?gameUuid=' + contract.gameUuid + '&playerUuid=' + contract.killerUuid
            var message = 'Bonjour ' + killer.firstName + ',\
            \n\nCe mail concerne la partie de killer \"' + game.name + '\".\
            \n\nPour remplir ton nouveau contrat tu vas devoir tuer ' + victim.firstName + ' ' + victim.lastName + ' en le/la faisant ' + challenge.description + '\
            \n\nUne fois que tu auras rempli ce contrat tu pourras le valider via ce lien:\
            \n' + attemptURL + '\
            \nPour le valider il te faudra ton code personnel (garde le secret): ' + killer.code + '\
            \nAinsi que le code personnel de ' + victim.firstName + ' ' + victim.lastName + ' (qu\'il faudra sélectionner dans la liste).\
            \nDonc ne revèle ton code personnel que si quelqu\'un te tue !\
            \n\nSee ya soon.'
            
            mailer.sendMail(killer.email, 'Vous avez un nouveau contrat', message)
            .then(function(info) {
                console.error('contractController: A contract email was sent to ' + killer.email + '\n' + err)
            }).catch(function(err) {
                console.error('contractController: There was an issue while sending contract email to ' + killer.email + '\n' + err)
            })
        }
        else {
            console.error('contractController: Inconsistent data for game, killer, victim or challenge. Cannot create contract email.')
        }
    })
}

exports.fulfillContract = function(gameUuid, killerUuid, victimUuid, victimStatus) {
    // Get victim contract to transfer a copy to the killer
    Contract.findOne({
        where : {
            gameUuid: gameUuid,
            killerUuid: victimUuid,
            status: 'ACTIVE'
        }
    })
    .then(contract => {
        // Update victim contract with the given status
        var updateVictimContract = function(){
            return Contract.update({
                status: victimStatus
            }, {
                where: {
                    uuid: contract.uuid
                },
                returning: true
            })
            .catch(err => {
                console.error('contractController: Failed to update victim contract (gameUuid: ' + gameUuid + ' , killerUuid: ' + victimUuid + ')\n' + err)
            })
        }

        // Update killer contract with fulfilled status
        var updateKillerContract = function(){
            return Contract.update({
                status: 'FULFILLED'
            }, {
                where: {
                    gameUuid: gameUuid,
                    killerUuid: killerUuid,
                    status: 'ACTIVE'
                },
                returning: true
            })
            .catch(err => {
                console.error('contractController: Failed to update killer contract (gameUuid: ' + gameUuid + ' , killerUuid: ' + victimUuid + ')\n' + err)
            })
        }

        sequelize.Promise.join(updateVictimContract(), updateKillerContract(), function(victimResult, killerResult){
            if (victimResult[1] == 1 && killerResult[1] == 1) {
                // Copy and transfer victim contract to the killer as his new contract
                exports.createAndSendContract(gameUuid, killerUuid, contract.victimUuid, contract.challengeUuid)
            }
            else {
                console.error('contractController: Inconsistent number of updated contracts')
            }
        })
    })
    .catch(err => {
        console.error('contractController: Failed to get active contract (gameUuid: ' + gameUuid + ' , killerUuid: ' + victimUuid + ')\n' + err)
    })
}
