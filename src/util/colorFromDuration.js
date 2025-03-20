import { MAX_TRUST_ACCOUNT_AGE } from "../constants.js";

/**
 * @param {number} duration
 */
export function colorFromDuration(duration) {
	const percent = Math.min(duration / (MAX_TRUST_ACCOUNT_AGE / 100), 100);
	let red;
	let green;
	let blue = 0;

	if (percent < 50) {
		red = 255;
		green = Math.round(5.1 * percent);
	} else {
		green = 255;
		red = Math.round(510 - 5.1 * percent);
	}

	const tintFactor = 0.3;

	red += (255 - red) * tintFactor;
	green += (255 - green) * tintFactor;
	blue += (255 - blue) * tintFactor;

	return (red << 16) + (green << 8) + blue;
}
