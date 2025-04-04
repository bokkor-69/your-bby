module.exports = {
	config: {
		name: "spam",
		version: "1.2",
		author: "MILAN",
		countDown: 0,
		role: 0,
		shortDescription: "Spam",
		longDescription: "Spam any text or emoji in a loop",
		category: "goatbot",
		guide: {
			en: "{pn} <Text/Emoji> <Number of times to spam>"
		}
	},  

	onStart: async function ({ api, event, args }) {
		// Owner Permission Check
		const permission = global.GoatBot?.config?.owner;
		if (!permission || !permission.includes(event.senderID)) {
			return api.sendMessage("❌ ᴏɴʟʏ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ. ᴛʏᴘᴇ !ɪɴꜰᴏ ꜰᴏʀ ᴏᴡɴᴇʀ ɪɴꜰᴏ ", event.threadID);
		}

		// Argument Check
		const messageToSpam = args.slice(0, args.length - 1).join(" ").trim(); // Ensure text and emoji are combined
		const spamCount = parseInt(args[args.length - 1]) || 5; // Default 5 times if not provided

		if (!messageToSpam || messageToSpam.length < 1) {
			return api.sendMessage("🔰 | Type the text or emoji that you want to spam.", event.threadID);
		}

		if (spamCount > 50) { 
			return api.sendMessage("❌ | You can spam up to 50 times only!", event.threadID);
		}

		// Loop through and spam messages with delay
		for (let i = 0; i < spamCount; i++) {
			setTimeout(() => {
				api.sendMessage(messageToSpam, event.threadID);
			}, i * 1000); // Delay of 1 sec between messages
		}
	}
};
