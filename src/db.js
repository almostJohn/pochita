// @ts-check

import "dotenv/config.js";
import { DataTypes, Sequelize } from "sequelize";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sequelize = new Sequelize(
	process.env.DB_NAME ?? "database",
	process.env.DB_USERNAME ?? "username",
	process.env.DB_PASSWORD ?? "password",
	{
		host: "localhost",
		dialect: "sqlite",
		logging: false,
		storage: "database.sqlite",
	},
);

const { default: UsersModel } = await import(
	pathToFileURL(path.join(__dirname, "./models/Users.js")).href
);

const { default: ModerationActionsModel } = await import(
	pathToFileURL(path.join(__dirname, "./models/ModerationActions.js")).href
);

/** @type {import("sequelize").ModelStatic<import("./models/Users.js").UsersModel>} */
export const Users = UsersModel(sequelize, DataTypes);

/** @type {import("sequelize").ModelStatic<import("./models/ModerationActions.js").ModerationActionModel>} */
export const ModerationActions = ModerationActionsModel(sequelize, DataTypes);

Users.hasMany(ModerationActions, { foreignKey: "user_id" });
ModerationActions.belongsTo(Users, { foreignKey: "user_id" });

(async () => {
	try {
		console.log("Started database synching");
		await sequelize.sync({ alter: true });
		console.log("Successfully synced database");
	} catch (error_) {
		const error = /** @type {Error} */ (error_);
		console.error(error, error.message);
	}
})();
