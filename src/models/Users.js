// @ts-check

/**
 * @typedef {Object} UsersAttributes
 * @property {string} user_id
 * @property {Date | undefined} birthday
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
			birthday: {
				type: DataTypes.DATE,
				allowNull: true,
			},
		},
		{
			timestamps: false,
		},
	);
};
