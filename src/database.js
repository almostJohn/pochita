import { Sequelize, DataTypes } from "sequelize";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "database.sqlite",
	logging: false,
});

const { default: UsersModel } = await import(
	pathToFileURL(path.join(__dirname, "./models/Users.js")).href
);

export const Users = UsersModel(sequelize, DataTypes);

(async () => {
	try {
		await sequelize.sync({ alter: true });
		console.log("Database Synced Success");
	} catch (error) {
		console.error(error);
	}
})();
