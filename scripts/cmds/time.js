const moment = require('moment-timezone');

module.exports = {
  config: {
    name: "time",
    version: "1.4",
    author: "kae",
    countdown: 5,
    role: 0,
    shortDescription: "Displays the current date and time in Bangladesh.",
    longDescription: "",
    category: "misc",
    guide: "{prefix}{name}",
    envConfig: {}
  },

  onStart: async function({ message, args }) {
    const bangladeshTime = moment.tz("Asia/Dhaka").format("h:mm:ss A");
    const bangladeshDate = moment.tz("Asia/Dhaka").format("dddd, DD MMMM YYYY");

    const reply = `🌟 **Today Date & Time in Bangladesh:** 🌟\n` +
      `🗓️ *Date:* **${bangladeshDate}**\n` +
      `⏰ *Time:* **${bangladeshTime}**`;

    message.reply(reply);
  },
  onEvent: async function() {}
};