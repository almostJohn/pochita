export const COLOR = /** @type {const} */ ({
	Blurple: 0x5865f2,
	Green: 0x57f287,
	Red: 0xed4245,
	Yellow: 0xfee75c,
	DarkButNotBlack: 0x2f3136,
	Fuchsia: 0xeb459e,
	Purple: 0x9c84ef,
	Teal: 0x45ddc0,
	Orange: 0xf47b67,
});

export const MAX_TRUST_ACCOUNT_AGE = 1_000 * 60 * 60 * 24 * 7 * 4;

export const SLOT_EMOJIS = /** @type {const} */ ([
	"🍒",
	"🍋",
	"🍉",
	"🍇",
	"⭐",
	"7️⃣",
]);

export const ERROR_RESPONSES = /** @type {const} */ ({
	targetUserNotFound: "The given member is not in this guild.",
	targetUserNotOnSystem: "The given member is not yet in the system/database.",
	notOnSystem:
		"You're trying to execute a command, yet you're not in the system/database.",
	globalError: "Something went wrong. Please try again.",
	timedOut: "Action timer ran out.",
	invalidDateFormat: "Invalid date format. Please use `YYYY-MM-DD`",
});

export const PET_NAMES = /** @type {const} */ ({
	rocket: "Rocket",
	mamoth: "Mamoth",
	magma: "Magma",
	bomb: "Bomb",
	trex: "Trex",
});
