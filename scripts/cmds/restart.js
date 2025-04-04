const fs = require("fs-extra");

module.exports = {
  config: {
    name: "restart",
    version: "1.1",
    author: "NTKhang",
    countDown: 5,
    role: 2,
    description: {
      vi: "Khởi động lại bot",
      en: "Restart bot"
    },
    category: "Owner",
    guide: {
      vi: "   {pn}: Khởi động lại bot",
      en: "   {pn}: Restart bot"
    }
  },

  langs: {
    vi: {
      restartting: "⚪🔴🟢 ‖ Đang khởi động lại bot..."
    },
    en: {
      restartting: "𝗛𝗲𝗹𝗹𝗼 𝗯𝗼𝘀𝘀 👋\n𝗣𝗹𝗲𝗮𝘀𝗲 𝘄𝗮𝗶𝘁 𝗮 𝗺𝗼𝗺𝗲𝗻𝘁, 𝘁𝗵𝗲 • 𝑻𝒐𝒎 𝑳𝒊𝒕𝒆 🦠 𝗯𝗼𝘁 𝘀𝘆𝘀𝘁𝗲𝗺 𝘄𝗶𝗹𝗹 𝗿𝗲𝘀𝘁𝗮𝗿𝘁 𝗮𝗳𝘁𝗲𝗿 10 𝘀𝗲𝗰𝗼𝗻𝗱𝘀💟"
    }
  },

  onLoad: function ({ api }) {
    const pathFile = `${__dirname}/tmp/restart.txt`;
    if (fs.existsSync(pathFile)) {
      const [tid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
      api.sendMessage(`
✅ | 𝐁𝐨𝐭 𝐫𝐞𝐬𝐭𝐚𝐫𝐭𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥𝐥𝐲...
⏰ | 𝐓𝐢𝐦𝐞: ${(Date.now() - time) / 1000}s
♻ | 𝐁𝐨𝐭 𝐒𝐭𝐚𝐭𝐮𝐬: 𝐀𝐜𝐭𝐢𝐯𝐞 [🟢]`, tid);
      fs.unlinkSync(pathFile);
    }
  },

  onStart: async function ({ event, api, message, getLang }) {
    const permission = global.GoatBot?.config?.owner;
    
    if (!permission || !permission.includes(event.senderID)) {
      return message.reply("❌ ᴏɴʟʏ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ ᴡʟᴛ. ᴛʏᴘᴇ !ɪɴꜰᴏ ꜰᴏʀ ᴏᴡɴᴇʀ ɪɴꜰᴏ ");
    }
    
    const pathFile = `${__dirname}/tmp/restart.txt`;
    fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
    await message.reply(getLang("restartting"));
    process.exit(2);
  }
};
