

module.exports = {
  config: {
    name: "help",
    aliases: ["h"],
    version: "1.0",
    author: "Custom Bot",
    usePrefix: false,
    countDown: 5,
    role: 0,
    shortDescription: {
      en: "Displays a list of commands or details for a specific command"
    },
    longDescription: {
      en: "Provides a list of all available commands or detailed information about a specific command"
    },
    category: "info",
    guide: {
      en: "help [command_name]"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const { threadID, messageID } = event;
    const { commands, aliases } = global.GoatBot;

    const totalCommands = commands.size;

    if (args.length === 0) {
      const categories = {};
      let responseMessage = "✨ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐋𝐢𝐬𝐭 ✨\n\n";

      for (const [name, cmd] of commands) {
        if (!categories[cmd.config.category]) {
          categories[cmd.config.category] = [];
        }
        categories[cmd.config.category].push(name);
      }

      for (const [category, cmds] of Object.entries(categories)) {
        responseMessage += `\n📂 ${category.toUpperCase()}\n`;
        responseMessage += cmds.map((cmd) => `⭓ ${cmd}`).join("\n") + "\n";
      }

      responseMessage += `\n✨ 𝐂𝐮𝐫𝐫𝐞𝐧𝐭𝐥𝐲, 𝐭𝐡𝐞 𝐛𝐨𝐭 𝐡𝐚𝐬 [${totalCommands}] 𝐜𝐨𝐦𝐦𝐚𝐧𝐝𝐬 𝐭𝐡𝐚𝐭 𝐜𝐚𝐧 𝐛𝐞 𝐮𝐬𝐞𝐝\n✨ 𝐔𝐬𝐞 𝐡𝐞𝐥𝐩 ( ᴄᴏᴍᴍᴀɴᴅ ɴᴀᴍᴇ ) 𝐟𝐨𝐫 𝐦𝐨𝐫𝐞 𝐝𝐞𝐭𝐚𝐢𝐥𝐬 𝐨𝐧 𝐚 𝐬𝐩𝐞𝐜𝐢𝐟𝐢𝐜 𝐜𝐨𝐦𝐦𝐚𝐧𝐝 \nʙᴏᴋᴋᴏʀ`;

      return api.sendMessage(responseMessage, threadID, messageID);
    }

    // Show details for a specific command
    const commandName = args[0].toLowerCase();
    const command = commands.get(commandName) || commands.get(aliases.get(commandName));

    if (!command) {
      return api.sendMessage(`❌ Command "${commandName}" not found.`, threadID, messageID);
    }

    const config = command.config;
    const guide = config.guide?.en || "No usage guide available.";
    const description = config.longDescription?.en || "No description available.";
    const response = `✨ 𝐂𝐨𝐦𝐦𝐚𝐧𝐝 𝐃𝐞𝐭𝐚𝐢𝐥𝐬 ✨\n\n` +
      `🌟 𝐍𝐚𝐦𝐞: ${config.name}\n` +
      `🔀 𝐀𝐥𝐢𝐚𝐬𝐞𝐬: ${config.aliases ? config.aliases.join(", ") : "None"}\n` +
      `📜 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐭𝐢𝐨𝐧: ${description}\n` +
      `🛠️ 𝐔𝐬𝐚𝐠𝐞: ${guide}\n` +
      `🗂️ 𝐕𝐞𝐫𝐬𝐢𝐨𝐧: ${config.version || "1.0"}\n` +
      `✍️ 𝐀𝐮𝐭𝐡𝐨𝐫: ${config.author || "Unknown"}\n` +
      `⏳ 𝐂𝐨𝐨𝐥𝐝𝐨𝐰𝐧: ${config.countDown || 0}s\n` +
      `🔑 𝐑𝐞𝐪𝐮𝐢𝐫𝐞𝐝 𝐑𝐨𝐥𝐞: ${config.role || 0}\n`;

    return api.sendMessage(response, threadID, messageID);
  }
};

