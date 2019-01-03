'use strict';
module.exports = (sequelize, DataTypes) => {
	var Challenge = sequelize.define('Challenge', {
		uuid: {
			field: 'UUID',
			type: DataTypes.STRING,
			primaryKey: true
		},
		description: {
			field: 'DESCRIPTION',
			type: DataTypes.STRING
		}
	}, {
		timestamps: false,
		freezeTableName: true
	})

	return Challenge;
};