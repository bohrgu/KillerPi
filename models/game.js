'use strict';
module.exports = (sequelize, DataTypes) => {
	var Game = sequelize.define('Game', {
		uuid: {
			field: 'UUID',
			type: DataTypes.STRING,
			primaryKey: true
		},
		creationDate: {
			field: 'CREATION_DATE',
			type: DataTypes.STRING
		},
		name: {
			field: 'NAME',
			type: DataTypes.STRING
		},
		ownerEmail: {
			field: 'OWNER_EMAIL',
			type: DataTypes.STRING
		},
		endDate: {
			field: 'END_DATE',
			type: DataTypes.STRING
		},
		status: {
			field: 'STATUS',
			type: DataTypes.STRING,
			values: ['PENDING', 'ACTIVE', 'ENDED']
		},
		partyCode: {
			field: 'PARTY_CODE',
			type: DataTypes.STRING
		},
		masterCode: {
			field: 'MASTER_CODE',
			type: DataTypes.STRING
		}
	}, {
		timestamps: false,
		freezeTableName: true
	})

	return Game;
};