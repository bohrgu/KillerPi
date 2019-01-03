'use strict';
module.exports = (sequelize, DataTypes) => {
	var Contract = sequelize.define('Contract', {
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
		challengeUuid: {
			field: 'CHALLENGE_UUID',
			type: DataTypes.STRING
		},
		status: {
			field: 'STATUS',
			type: DataTypes.ENUM,
			values: ['ACTIVE', 'FULFILLED', 'FAILED', 'SUICIDE', 'REVOKED', 'ENDED']
		}
	}, {
		timestamps: false,
		freezeTableName: true
	})

	return Contract;
};