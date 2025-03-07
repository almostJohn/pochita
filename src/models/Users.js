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
			vault: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			fame: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			work_streak: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			last_work: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			timestamps: false,
		},
	);
};
