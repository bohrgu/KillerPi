var express = require('express')
var router = express.Router()
var attemptController = require('../controllers/attemptController')

router.get('/', attemptController.attemptKillForm)
router.post('/', attemptController.attemptKillPost)

module.exports = router