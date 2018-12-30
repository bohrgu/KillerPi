var Sequelize = require('sequelize');
var sequelize = new Sequelize('sqlite:./Killer.db')


var ContractModel = sequelize.define('contract', {
	uuid: {
		field: 'UUID',
		type: Sequelize.STRING,
		primaryKey: true
	},
	creationDate: {
		field: 'CREATION_DATE',
		type: Sequelize.STRING
	},
	gameUuid: {
		field: 'GAME_UUID',
		type: Sequelize.STRING
	},
	killerUuid: {
		field: 'KILLER_UUID',
		type: Sequelize.STRING
	},
	victimUuid: {
		field: 'VICTIM_UUID',
		type: Sequelize.STRING
	},
	challengeUuid: {
		field: 'CHALLENGE_UUID',
		type: Sequelize.STRING
	},
	status: {
		field: 'STATUS',
		type: Sequelize.ENUM,
		values: ['ACTIVE', 'SUCCESS', 'FAILURE', 'ENDED']
	}
}, {
	timestamps: false,
	freezeTableName: true
})

// Export model
module.exports = ContractModel