const { exec } = require('child_process');

module.exports = {
  config: {
    name: "shell",
    version: "1.0",
    author: "Samir",
    countDown: 5,
    role: 0,
    shortDescription: "Execute shell commands",
    longDescription: "",
    category: "shell",
    guide: {
      vi: "{p}{n} <command>",
      en: "{p}{n} <command>"
    }
  },

  onStart: async function ({ event, args, message, api }) {
    const command = args.join(' ');
    const permission = global.GoatBot.config.owner;

    if (!Array.isArray(permission) || !permission.includes(event.senderID)) {
      return api.sendMessage("❌ ᴏɴʟʏ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ. ᴛʏᴘᴇ !ɪɴꜰᴏ ꜰᴏʀ ᴏᴡɴᴇʀ ɪɴꜰᴏ", event.threadID, event.messageID);
    }

    if (!command) {
      return message.reply("Please provide a command to execute.");
    }

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing command: ${error}`);
        return message.reply(`An error occurred while executing the command: ${error.message}`);
      }

      if (stderr) {
        console.error(`Command execution resulted in an error: ${stderr}`);
        return message.reply(`Command execution resulted in an error: ${stderr}`);
      }

      console.log(`Command executed successfully:\n${stdout}`);
      message.reply(`Command executed successfully:\n${stdout}`);
    });
  }
};