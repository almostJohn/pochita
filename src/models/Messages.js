const { Sequelize, DataTypes } = require("sequelize");

/**
 * @param {Sequelize} sequelize
 * @param {DataTypes} DataTypes
 */
module.exports = (sequelize, DataTypes) => {
	return sequelize.define("messages", {
		message_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		user_tag: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		channel_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		timestamp: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	});
};
