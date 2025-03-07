/**
 * @param {number} number
 */
function addComma(number) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

module.exports = { addComma };
