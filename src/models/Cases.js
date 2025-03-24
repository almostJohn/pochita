// @ts-check

/**
 * @typedef {"ban" | "unban" | "timeout" | "kick" | "timeout end"} ActionType
 */

/**
 * @typedef {Object} CasesAttributes
 * @property {number} case_id
 * @property {string} user_id
 * @property {string} user_tag
 * @property {string | undefined} [mod_id]
 * @property {string | undefined} [mod_tag]
 * @property {string | undefined} [reason]
 * @property {ActionType} action
 * @property {Date | undefined} [action_expiration]
 * @property {string | undefined} [reference]
 */

/**
 * @typedef {import("sequelize").Model<CasesAttributes>} CasesModel
 */

/**
 * @param {import("sequelize").Sequelize} sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
	return sequelize.define(
		"cases",
		{
			case_id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			user_tag: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			mod_id: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			mod_tag: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			reason: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			action: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			action_expiration: {
				type: DataTypes.DATE,
				allowNull: true,
			},
			reference: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			timestamps: false,
		},
	);
};
