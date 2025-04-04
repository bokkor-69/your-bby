module.exports = {
  config: {
    name: "set",
    aliases: ['ap'],
    version: "1.0",
    author: "Loid Butter",
    role: 0,
    description: {
      en: "Set coins and experience points for a user as desired"
    },
    category: "economy",
    guide: {
      en: "{pn} set [money|exp] [amount]"
    }
  },

  onStart: async function ({ args, event, api, usersData }) {
    const permission = global.GoatBot.config.owner;
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("❌ ᴏɴʟʏ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ. ᴛʏᴘᴇ !ɪɴꜰᴏ ꜰᴏʀ ᴏᴡɴᴇʀ ɪɴꜰᴏ ", event.threadID);
    }

    const query = args[0];
    const amount = parseInt(args[1]);

    if (!query || isNaN(amount)) {
      return api.sendMessage("❎ | Invalid command arguments. Usage: {pn} [money|exp] [amount]", event.threadID);
    }

    const { senderID, threadID } = event;

    let targetUser;
    if (event.type === "message_reply") {
      targetUser = event.messageReply.senderID;
    } else {
      const mention = Object.keys(event.mentions);
      targetUser = mention[0] || senderID;
    }

    const userData = await usersData.get(targetUser);
    if (!userData) {
      return api.sendMessage("❎ | User not found.", threadID);
    }

    const name = await usersData.getName(targetUser);

    if (query.toLowerCase() === 'exp') {
      await usersData.set(targetUser, {
        ...userData,
        exp: amount
      });

      return api.sendMessage(`✅ | Set experience points to ${amount} for ${name}.`, threadID);
    } 
    else if (query.toLowerCase() === 'money') {
      await usersData.set(targetUser, {
        ...userData,
        money: amount
      });

      return api.sendMessage(`✅ | Set coins to ${amount} for ${name}.`, threadID);
    } 
    else {
      return api.sendMessage("❎ Invalid query. Use 'exp' to set experience points or 'money' to set coins.", threadID);
    }
  }
};
