var express = require('express');
var router = express.Router();
var contractController = require('../controllers/contractController')

// SEND contract.
router.get('/:uuid', contractController.sendContract);
router.get('/game/:uuid/allActive', contractController.sendAllActiveContracts);

module.exports = router;
