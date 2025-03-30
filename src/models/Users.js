// @ts-check

/**
 * @typedef {Object} UsersAttributes
 * @property {string} user_id
 * @property {string} [reason]
 * @property {string} [old_nickname]
 */

/**
 * @typedef {import("sequelize").Model<UsersAttributes>} UsersModel
 */

/**
 * @param {import("sequelize").Sequelize} sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
	return sequelize.define(
		"users",
		{
			user_id: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true,
			},
			reason: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			old_nickname: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			timestamps: false,
		},
	);
};
