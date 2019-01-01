var express = require('express')
var router = express.Router()
var gameController = require('../controllers/gameController')

router.get('/', gameController.gameGetAll)
router.get('/create', gameController.gameCreationForm)
router.post('/create', gameController.gameCreationPost)
router.get('/:uuid', gameController.gameGetOne)
router.post('/:uuid/activate', gameController.gameActivationPost)
router.post('/:uuid/invite', gameController.gameInvitationPost)
router.get('/:uuid/join', gameController.gameJoinForm)
router.post('/:uuid/join', gameController.gameJoinPost)

module.exports = router