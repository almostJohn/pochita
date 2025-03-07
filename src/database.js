const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "database.sqlite",
	logging: false,
});

const Users = require("./models/Users.js")(sequelize, DataTypes);

(async () => {
	try {
		await sequelize.sync({ alter: true });
		console.log("Database Synced Success");
	} catch (error) {
		console.error(error);
	}
})();

module.exports = { sequelize, Users };
