import chalk from "chalk";

export const logger = {
	error(...args) {
		console.log(chalk.red(...args));
	},
	info(...args) {
		console.log(chalk.cyan(...args));
	},
	warn(...args) {
		console.log(chalk.yellow(...args));
	},
	success(...args) {
		console.log(chalk.green(...args));
	},
};
