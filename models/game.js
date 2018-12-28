var Sequelize = require('sequelize');
var sequelize = new Sequelize('sqlite:./Killer.db')


var Game = sequelize.define('game', {
	uuid: {
		field: 'UUID',
		type: Sequelize.STRING,
		primaryKey: true
	},
	name: {
		field: 'NAME',
		type: Sequelize.STRING
	},
	creationDate: {
		field: 'CREATION_DATE',
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
	code: {
		field: 'CODE',
		type: Sequelize.STRING
	}
}, {
	timestamps: false,
	freezeTableName: true
})

// Export model
module.exports = Game