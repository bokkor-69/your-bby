module.exports = {
  config: {
    name: "pp",
    aliases: ["pfp"],
    version: "1.1",
    author: "NIB",
    countDown: 5,
    role: 0,
    shortDescription: "PROFILE image",
    longDescription: "PROFILE image",
    category: "image",
    guide: {
      en: "{pn} @tag or provide user UID"
    }
  },

  langs: {
    vi: {
      noTag: "Bạn phải tag người bạn muốn tát"
    },
    en: {
      noTag: "You must tag the person you want to get profile picture of"
    }
  },

  onStart: async function ({ event, message, usersData, args, getLang }) {
    let avt;
    const uid1 = event.senderID;
    let uid2;

    // Check if the user provided a tag or UID
    if (event.type == "message_reply") {
      avt = await usersData.getAvatarUrl(event.messageReply.senderID);
    } else {
      uid2 = Object.keys(event.mentions)[0]; // Get the mentioned user ID

      if (!uid2 && args.length === 0) {
        avt = await usersData.getAvatarUrl(uid1); // If no tag and no UID, use sender's UID
      } else {
        if (uid2) {
          avt = await usersData.getAvatarUrl(uid2); // If a tag is given, get that user's avatar
        } else if (args[0]) {
          const userID = args[0]; // Assume the first argument is a UID
          avt = await usersData.getAvatarUrl(userID); // Get avatar by UID
        }
      }
    }

    if (!avt) {
      return message.reply(getLang("noTag"));
    }

    message.reply({
      body: "",
      attachment: await global.utils.getStreamFromURL(avt)
    });
  }
};