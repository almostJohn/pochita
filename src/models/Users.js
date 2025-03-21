/**
 * @typedef {import("sequelize").Model<{
 * 	user_id: string;
 * 	birthday: Date;
 * 	vault: number;
 * 	points: number;
 * 	fame: number;
 * 	pets: {
 * 		name: string;
 * 		type: "rocket" | "mamoth" | "magma" | "bomb" | "trex";
 * 		level: number;
 * 		experience: number;
 * 		hp: number;
 * 		max_hp: number;
 * 		pet_icon_url?: string | undefined;
 * 	} | null;
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
			pets: {
				type: DataTypes.JSON,
				defaultValue: null,
			},
		},
		{
			timestamps: false,
		},
	);
};
