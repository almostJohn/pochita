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
		},
		{
			timestamps: false,
		},
	);
};
