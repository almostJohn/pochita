/**
 * @param {number} n
 */
function getOrdinal(n) {
	if (typeof n !== "number" || !Number.isInteger(n)) {
		return;
	}

	return new Intl.PluralRules("en", { type: "ordinal" }).select(n) === "one"
		? `${n}st`
		: new Intl.PluralRules("en", { type: "ordinal" }).select(n) === "two"
		? `${n}nd`
		: new Intl.PluralRules("en", { type: "ordinal" }).select(n) === "few"
		? `${n}rd`
		: `${n}th`;
}

exports.getOrdinal = getOrdinal;
