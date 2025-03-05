const { GuildMember, roleMention } = require("discord.js");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime.js");
const duration = require("dayjs/plugin/duration.js");

dayjs.extend(relativeTime);
dayjs.extend(duration);

/** @param {GuildMember} guildMember */
function getInfoOnMemberRank(guildMember) {
	const joinedDuration = dayjs.duration(
		dayjs().diff(dayjs(guildMember.joinedTimestamp)),
	);
	const monthsJoined = joinedDuration.asMonths();

	let rank = "";

	switch (true) {
		case monthsJoined < 1:
			rank = "Not qualified yet for roles/ranks in this server";
			break;
		case monthsJoined < 3:
			rank = "Can now claim the `Campfire Ember` role";
			break;
		case monthsJoined < 6:
			rank = "Can now claim the `Trail Walker` role";
			break;
		case monthsJoined < 12:
			rank = "Can now claim the `Forest Explorer` role";
			break;
		case monthsJoined < 24:
			rank = "Can now claim the `Camp Guide` role";
			break;
		case monthsJoined < 36:
			rank = "Can now claim the `Bonfire Guardian` role";
			break;
	}

	return rank;
}

exports.getInfoOnMemberRank = getInfoOnMemberRank;
