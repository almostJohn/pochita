/**+
 * @param {string} name
 * @param {string} id
 * @param {boolean}
 */
function emojiFormatter(name, id, isAnimated = true) {
	if (isAnimated) {
		return `<a:${name}:${id}>`;
	}

	return `<${name}:${id}>`;
}

module.exports = { emojiFormatter };
