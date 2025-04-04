const axios = require('axios');

module.exports = {
  config: {
    name: "flame",
    version: "1.0",
    author: "Samir Œ",
    countDown: 5,
    role: 0,
    description: {
      vi: "",
      en: "Create Flame gif image."
    },
    category: "image",
    guide: {
      vi: "{pn} < text >",
      en: "{pn} < text >"
    }
  },

  onStart: async function ({ api, event, args, message }) {
    const text = args.join(" ");
    if (!text) {
      return message.reply("Please provide a Text.");
    }
   
    message.reply("Initializing image, please wait...", async (err, info) => {
      let id = info.messageID;
      try {
        const API = `https://hazeyy-merge-apis-b924b22feb7b.herokuapp.com/api/gen/flame?text=${encodeURIComponent(text)}`;
        const imageStream = await global.utils.getStreamFromURL(API);
        message.unsend(id);
        message.reply({
          body: `  `,
          attachment: imageStream
        }, async (err, info) => {
        });
      } catch (error) {
        console.error(error);
        api.sendMessage(`Error: ${error}`, event.threadID);
      }
    });
  }
};