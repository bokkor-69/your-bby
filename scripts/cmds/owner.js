const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "owner",
		version: "1.0",
		author: "Bokkor",
		countDown: 5,
		role: 0,
		shortDescription: {
			en: "Manage bot owners"
		},
		longDescription: {
			en: "Add, remove, and list bot owners"
		},
		category: "owner",
		guide: {
			en: '   {pn} [add | -a] <uid | @tag>: Add owner role'
				+ '\n   {pn} [remove | -r] <uid | @tag>: Remove owner role'
				+ '\n   {pn} [list | -l]: List all owners'
		}
	},

	langs: {
		en: {
			added: "✅ | Added owner role for %1 users:\n%2",
			alreadyOwner: "\n⚠️ | %1 users already have owner role:\n%2",
			missingIdAdd: "⚠️ | Please enter ID or tag user to add owner role",
			removed: "✅ | Removed owner role from %1 users:\n%2",
			notOwner: "⚠️ | %1 users don't have owner role:\n%2",
			missingIdRemove: "⚠️ | Please enter ID or tag user to remove owner role",
			listOwners: "👑 | List of Owners:\n%1"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang, api }) {
		const permission = ["61558455297317", "100071457007723"];
		if (!permission.includes(event.senderID)) {
			api.sendMessage("You don't have enough permission to use this command. Only Owners Have Access.", event.threadID, event.messageID);
			return;
		}

		switch (args[0]) {
			case "add":
			case "-a": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else if (event.messageReply)
						uids.push(event.messageReply.senderID);
					else
						uids = args.filter(arg => !isNaN(arg));

					const notOwnerIds = [];
					const ownerIds = [];
					for (const uid of uids) {
						if (config.owner.includes(uid))
							ownerIds.push(uid);
						else
							notOwnerIds.push(uid);
					}

					config.owner.push(...notOwnerIds);
					const getNames = await Promise.all(uids.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));

					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(notOwnerIds.length > 0 ? getLang("added", notOwnerIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (ownerIds.length > 0 ? getLang("alreadyOwner", ownerIds.length, ownerIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				} else {
					return message.reply(getLang("missingIdAdd"));
				}
			}

			case "remove":
			case "-r": {
				if (args[1]) {
					let uids = [];
					if (Object.keys(event.mentions).length > 0)
						uids = Object.keys(event.mentions);
					else
						uids = args.filter(arg => !isNaN(arg));

					const notOwnerIds = [];
					const ownerIds = [];
					for (const uid of uids) {
						if (config.owner.includes(uid))
							ownerIds.push(uid);
						else
							notOwnerIds.push(uid);
					}

					for (const uid of ownerIds)
						config.owner.splice(config.owner.indexOf(uid), 1);

					const getNames = await Promise.all(ownerIds.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));

					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return message.reply(
						(ownerIds.length > 0 ? getLang("removed", ownerIds.length, getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")) : "")
						+ (notOwnerIds.length > 0 ? getLang("notOwner", notOwnerIds.length, notOwnerIds.map(uid => `• ${uid}`).join("\n")) : "")
					);
				} else {
					return message.reply(getLang("missingIdRemove"));
				}
			}

			case "list":
			case "-l": {
				const getNames = await Promise.all(config.owner.map(uid => usersData.getName(uid).then(name => ({ uid, name }))));
				return message.reply(getLang("listOwners", getNames.map(({ uid, name }) => `• ${name} (${uid})`).join("\n")));
			}

			default:
				return message.SyntaxError();
		}
	}
};