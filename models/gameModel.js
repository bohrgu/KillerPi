var Sequelize = require('sequelize')
var sequelize = new Sequelize('sqlite:./Killer.db')


var GameModel = sequelize.define('game', {
	uuid: {
		field: 'UUID',
		type: Sequelize.STRING,
		primaryKey: true
	},
	creationDate: {
		field: 'CREATION_DATE',
		type: Sequelize.STRING
	},
	name: {
		field: 'NAME',
		type: Sequelize.STRING
	},
	ownerEmail: {
		field: 'OWNER_EMAIL',
		type: Sequelize.STRING
	},
	endDate: {
		field: 'END_DATE',
		type: Sequelize.STRING
	},
	status: {
		field: 'STATUS',
		type: Sequelize.ENUM,
		values: ['PENDING', 'ACTIVE', 'ENDED']
	},
	partyCode: {
		field: 'PARTY_CODE',
		type: Sequelize.STRING
	},
	masterCode: {
		field: 'MASTER_CODE',
		type: Sequelize.STRING
	}
}, {
	timestamps: false,
	freezeTableName: true
})

// Export model
module.exports = GameModel