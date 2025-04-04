module.exports = {
  config: {
    name: "spy",
    version: "1.4",
    author: "Shikaki",
    countDown: 60,
    role: 0,
    shortDescription: "🔍 Get detailed user info & avatar",
    longDescription: "Fetch user details, avatar, bio, nickname, birthday date, and last photo upload date by mentioning or providing user ID/profile link",
    category: "image",
  },

  onStart: async function ({ event, message, usersData, api, args }) {
    let uid;
    const uid1 = event.senderID;
    const uid2 = Object.keys(event.mentions)[0];

    if (args[0]) {
      if (/^\d+$/.test(args[0])) {
        uid = args[0];
      } else {
        const match = args[0].match(/profile\.php\?id=(\d+)/);
        if (match) {
          uid = match[1];
        }
      }
    }

    if (!uid) {
      uid = event.type === "message_reply" ? event.messageReply.senderID : uid2 || uid1;
    }

    api.getUserInfo(uid, async (err, userInfo) => {
      if (err) {
        return message.reply("❌ Failed to retrieve user information.");
      }

      const avatarUrl = await usersData.getAvatarUrl(uid);

      // Gender Mapping
      let genderText;
      switch (userInfo[uid].gender) {
        case 1:
          genderText = "👩 Girl";
          break;
        case 2:
          genderText = "👨 Boy";
          break;
        default:
          genderText = "⚪ Unknown";
      }

      // Additional User Information
      const nickname = userInfo[uid].vanity || "❌ Not Available";
      const bio = userInfo[uid].about || "❌ Not Available";
      const lastPhotoUpload = userInfo[uid].lastPhotoUpload || "❌ Unknown";
      const birthday = userInfo[uid].birthday || "❌ Not Available";

      // Construct User Information
      const userInformation = `🎭 𝗨𝘀𝗲𝗿 𝗜𝗻𝗳𝗼 🎭\n\n` +
        `🆔 𝗜𝗗        :  ${uid}\n` +
        `📛 𝗡𝗮𝗺𝗲      :  ${userInfo[uid].name}\n` +
        `🔗 𝗣𝗿𝗼𝗳𝗶𝗹𝗲 𝗨𝗥𝗟 :  ${userInfo[uid].profileUrl}\n` +
        `🚻 𝗚𝗲𝗻𝗱𝗲𝗿    :  ${genderText}\n` +
        `👑 𝗨𝘀𝗲𝗿 𝗧𝘆𝗽𝗲  :  ${userInfo[uid].type}\n` +
        `🤝 𝗜𝘀 𝗙𝗿𝗶𝗲𝗻𝗱  :  ${userInfo[uid].isFriend ? "✅ Yes" : "❌ No"}\n` +
        `🎂 𝗕𝗶𝗿𝘁𝗵𝗱𝗮𝘆 𝗧𝗼𝗱𝗮𝘆 :  ${userInfo[uid].isBirthday ? "🎉 Yes" : "❌ No"}\n` +
        `📅 𝗕𝗶𝗿𝘁𝗵𝗱𝗮𝘆 𝗗𝗮𝘁𝗲  :  ${birthday}\n` +
        `🏷️ 𝗡𝗶𝗰𝗸𝗻𝗮𝗺𝗲  :  ${nickname}\n` +
        `📝 𝗕𝗶𝗼       :  ${bio}\n` +
        `📸 𝗟𝗮𝘀𝘁 𝗣𝗵𝗼𝘁𝗼 𝗨𝗽𝗹𝗼𝗮𝗱 :  ${lastPhotoUpload}`;

      message.reply({
        body: userInformation,
        attachment: await global.utils.getStreamFromURL(avatarUrl)
      });
    });
  }
};
