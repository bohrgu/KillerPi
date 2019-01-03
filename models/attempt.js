'use strict';
module.exports = (sequelize, DataTypes) => {
	var Attempt = sequelize.define('Attempt', {
		uuid: {
			field: 'UUID',
			type: DataTypes.STRING,
			primaryKey: true
		},
		creationDate: {
			field: 'CREATION_DATE',
			type: DataTypes.STRING
		},
		gameUuid: {
			field: 'GAME_UUID',
			type: DataTypes.STRING
		},
		killerUuid: {
			field: 'KILLER_UUID',
			type: DataTypes.STRING
		},
		victimUuid: {
			field: 'VICTIM_UUID',
			type: DataTypes.STRING
		},
		status: {
			field: 'STATUS',
			type: DataTypes.ENUM,
			values: ['SUCCESS', 'FAILURE']
		}
	}, {
		timestamps: false,
		freezeTableName: true
	})

	return Attempt;
};