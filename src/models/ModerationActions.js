// @ts-check

/**
 * @typedef {Object} ModerationActionAttributes
 * @property {number} id
 * @property {string} user_id
 * @property {string} mod_id
 * @property {string} action
 * @property {string} reason
 * @property {Date} created_at
 */

/**
 * @typedef {import("sequelize").Model<ModerationActionAttributes>} ModerationActionModel
 */

/**
 * @param {import("sequelize").Sequelize} sequelize
 * @param {import("sequelize").DataTypes} DataTypes
 */
export default (sequelize, DataTypes) => {
	return sequelize.define("moderation_actions", {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true,
		},
		user_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		mod_id: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		action: {
			type: DataTypes.ENUM(
				"warn",
				"kick",
				"ban",
				"unban",
				"timeout",
				"timeout end",
			),
			allowNull: false,
		},
		reason: {
			type: DataTypes.STRING(1024),
			allowNull: true,
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	});
};
