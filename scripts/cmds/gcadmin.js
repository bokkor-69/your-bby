module.exports = {
  config: {
    name: "gcadmin",
    aliases: ['groupadmin', 'admingc', 'admingroup'],
    version: "1.0",
    author: "Vex_kshitiz",
    countDown: 5,
    role: 1,
    shortDescription: "gc admin management",
    longDescription: "gc admin management",
    category: "box",
    guide: {
      en: "{p}{n} add uid or mention / remove uid or mention",
    }
  },

  onStart: async function ({ api, event, args }) {
    const permission = global.GoatBot.config.owner;
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("❌ ᴏɴʟʏ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ. ᴛʏᴘᴇ !ɪɴꜰᴏ ꜰᴏʀ ᴏᴡɴᴇʀ ɪɴꜰᴏ", event.threadID);
    }
    
    const command = args[0];
    const target = args.slice(1).join(" ");
    const threadID = event.threadID;

    switch (command) {
      case "add":
        await addAdmin(api, event, threadID, target);
        break;
      case "remove":
        await removeAdmin(api, event, threadID, target);
        break;
      default:
        api.sendMessage("Invalid command! Usage: " + this.config.guide.en, threadID);
    }
  }
};

async function addAdmin(api, event, threadID, target) {
  try {
    const userID = await resolveUserID(api, event, target);
    await api.changeAdminStatus(threadID, userID, true);
    api.sendMessage(`${userID} has been added as an admin.`, threadID);
  } catch (error) {
    console.error("Error adding admin:", error);
    api.sendMessage("Failed to add user as admin. Please check if the user exists or the input is correct.", threadID);
  }
}

async function removeAdmin(api, event, threadID, target) {
  try {
    const userID = await resolveUserID(api, event, target);
    await api.changeAdminStatus(threadID, userID, false);
    api.sendMessage(`${userID} has been removed from admin position.`, threadID);
  } catch (error) {
    console.error("Error removing admin:", error);
    api.sendMessage("Failed to remove user from admin position. Please check if the user exists or the input is correct.", threadID);
  }
}

async function resolveUserID(api, event, target) {
  let userID;
  if (target.startsWith('@')) {
    const { mentions } = event;
    for (const mentionID in mentions) {
      if (mentions[mentionID].replace("@", "") === target.slice(1)) {
        userID = mentionID;
        break;
      }
    }
    if (!userID) {
      throw new Error("User not found!");
    }
  } else {
    userID = target;
  }
  return userID;
}
