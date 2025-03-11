const { Sequelize, DataTypes } = require("sequelize");

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
	return sequelize.define(
		"users",
		{
			user_id: {
				type: DataTypes.STRING,
				primaryKey: true,
			},
			birthday: {
				type: DataTypes.DATEONLY,
				allowNull: true,
			},
		},
		{
			timestamps: false,
		},
	);
};
