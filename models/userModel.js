var Sequelize = require('sequelize');
var sequelize = new Sequelize('sqlite:./Killer.db')


var UserModel = sequelize.define('game', {
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
	firstName: {
		field: 'FIRST_NAME',
		type: Sequelize.STRING
	},
	lastName: {
		field: 'LAST_NAME',
		type: Sequelize.STRING
	},
	email: {
		field: 'EMAIL',
		type: Sequelize.STRING
	},
	code: {
		field: 'CODE',
		type: Sequelize.STRING
	}
}, {
	timestamps: false,
	freezeTableName: true
})

// Export model
module.exports = UserModel