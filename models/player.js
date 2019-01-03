'use strict';
module.exports = (sequelize, DataTypes) => {
	var Player = sequelize.define('Player', {
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
		firstName: {
			field: 'FIRST_NAME',
			type: DataTypes.STRING
		},
		lastName: {
			field: 'LAST_NAME',
			type: DataTypes.STRING
		},
		email: {
			field: 'EMAIL',
			type: DataTypes.STRING
		},
		code: {
			field: 'CODE',
			type: DataTypes.STRING
		}
	}, {
		timestamps: false,
		freezeTableName: true
	})

	return Player;
};