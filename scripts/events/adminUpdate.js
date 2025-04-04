const fs = require("fs");

module.exports = {
  config: {
    name: "adminUpdate",
    version: "1.0.2",
    author: "Adapted from Mirai Team",
    category: "events",
    eventType: [
      "log:thread-admins",
      "log:thread-name",
      "log:user-nickname",
      "log:thread-icon",
      "log:thread-color",
      "log:reaction" // Added reaction event type
    ],
    envConfig: {
      sendNoti: true,
    },
  },

  onStart: async ({ event, api, threadsData, getLang }) => {
    const { threadID, logMessageType, logMessageData } = event;
    const threadData = await threadsData.get(threadID);

    try {
      switch (logMessageType) {
        case "log:thread-admins": {
          if (logMessageData.ADMIN_EVENT === "add_admin") {
            threadData.adminIDs.push({ id: logMessageData.TARGET_ID });
            if (module.exports.config.envConfig.sendNoti) {
              api.sendMessage(
                `[ ${logMessageData.TARGET_NAME} ] দেখ এডমিন দিছি মাতাব্বরি করিস না কিন্তু😒`,
                threadID
              );
            }
          } else if (logMessageData.ADMIN_EVENT === "remove_admin") {
            threadData.adminIDs = threadData.adminIDs.filter(
              (admin) => admin.id !== logMessageData.TARGET_ID
            );
            if (module.exports.config.envConfig.sendNoti) {
              api.sendMessage(
                `[ Breaking News ]\n\nDear - [ ${logMessageData.TARGET_NAME} ]গ্রুপ এডমিন থেকে লাথি মেরে বের করে দেওয়া হলো 😌😝`,
                threadID
              );
            }
          }
          break;
        }

        case "log:user-nickname": {
          // Ensure nickname is updated correctly
          threadData.nicknames[logMessageData.participant_id] = logMessageData.nickname;
          api.sendMessage(
            `এহহহ আবার Nickname ও লাগায় দেহা যায় 😼\n\n🆔 User ID : ${logMessageData.participant_id}\n New Nickname : ${logMessageData.nickname.length === 0 ? "original name" : logMessageData.nickname}`,
            threadID
          );
          break;
        }

        case "log:thread-icon": {
          const iconPath = __dirname + "/emoji.json";
          let preIcon = {};
          if (fs.existsSync(iconPath)) {
            preIcon = JSON.parse(fs.readFileSync(iconPath));
          }
          threadData.threadIcon = logMessageData.thread_icon || "👍";
          preIcon[threadID] = threadData.threadIcon;
          fs.writeFileSync(iconPath, JSON.stringify(preIcon));
          api.sendMessage(
            `কোন ভালা মানুষের বাচ্চায় গ্রুপ ইমোজি টা চেঞ্জ করলো রে 😐\n\n ${preIcon[threadID] || ""}`,
            threadID
          );
          break;
        }

        case "log:thread-color": {
          threadData.threadColor = logMessageData.thread_color || "🌤";
          api.sendMessage(
            `» [ GROUP UPDATE ]\n\n» ${event.logMessageBody.replace("Theme", "color")}`,
            threadID
          );
          break;
        }

        case "log:thread-name": {
          threadData.threadName = logMessageData.name || "No name";
          api.sendMessage(
            `কোন ভালা মানুষের বাচ্চায় জানি গ্রুপের নাম টা চেঞ্জ কইরা দিলো 🤦🏻‍♂️\n\nNew Group Name : ${threadData.threadName}`,
            threadID
          );
          break;
        }

        case "log:reaction": {
          // Handle reaction changes here
          const { TARGET_ID, REACTION } = logMessageData;
          api.sendMessage(
            `রিয়েকশন পরিবর্তন হয়েছে 😑\n\nUser ID: ${TARGET_ID}\nReaction: ${REACTION}`,
            threadID
          );
          break;
        }
      }

      await threadsData.set(threadID, threadData);
    } catch (error) {
      console.error(error);
    }
  },
};
