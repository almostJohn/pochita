/**
 * @typedef {import("sequelize").Model<{
 * 	user_id: string;
 * 	birthday: Date;
 * 	vault: number;
 * 	points: number;
 * 	fame: number;
 * }>} Users
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
				primaryKey: true,
			},
			birthday: {
				type: DataTypes.DATEONLY,
				allowNull: true,
			},
			vault: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			points: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
			fame: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
				allowNull: false,
			},
		},
		{
			timestamps: false,
		},
	);
};
