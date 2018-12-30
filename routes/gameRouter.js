var express = require('express')
var router = express.Router()
var gameController = require('../controllers/gameController')


router.get('/', gameController.gameGetAll)
router.get('/create', gameController.gameCreationForm)
router.post('/create', gameController.gameCreationPost)
router.get('/:uuid', gameController.gameGetOne)

module.exports = router