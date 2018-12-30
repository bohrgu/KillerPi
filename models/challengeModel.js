var Sequelize = require('sequelize');
var sequelize = new Sequelize('sqlite:./Killer.db')


var ChallengeModel = sequelize.define('challenge', {
	uuid: {
		field: 'UUID',
		type: Sequelize.STRING,
		primaryKey: true
	},
	description: {
		field: 'DESCRIPTION',
		type: Sequelize.STRING
	}
}, {
	timestamps: false,
	freezeTableName: true
})

// Export model
module.exports = ChallengeModel