const axios = require('axios');

module.exports.config = {
  name: "gpt",
  aliases: [],
  version: "1.0.0",
  role: 0,
  author: "Bokkor",
  description: "Sonnet-3.7 AI with multiple conversation",
  usePrefix: true,
  guide: "[message]",
  category: "AI",
  countDown: 5,
};

module.exports.onStart = async function ({ api, args, event }) {
  try {
    const author = event.senderID;
    const prompt = args.join(" ").toLowerCase();

    if (!args[0]) {
      return api.sendMessage(
        "Please provide a question to answer\n\nExample:\n!gpt hi",
        event.threadID,
        event.messageID
      );
    }

    if (prompt) {
      const response = await axios.get(`https://renzweb.onrender.com/api/sonnet-3.7?prompt=${encodeURIComponent(prompt)}&uid=${author}`);
      const replyText = response.data.response;

      await api.sendMessage({ body: replyText }, event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: 'reply',
          messageID: info.messageID,
          author,
          link: replyText
        });
      }, event.messageID);
    }
  } catch (error) {
    console.log(`Failed to get an answer: ${error.message}`);
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};

module.exports.onReply = async function ({ api, event, Reply }) {
  const { author } = Reply;
  if (author != event.senderID) return;

  if (event.type == "message_reply") {
    const reply = event.body.toLowerCase();
    if (isNaN(reply)) {
      try {
        const response = await axios.get(`https://renzweb.onrender.com/api/sonnet-3.7?prompt=${encodeURIComponent(reply)}&uid=${author}`);
        const replyText = response.data.response;

        await api.sendMessage(replyText, event.threadID, (errr, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: 'reply',
            messageID: info.messageID,
            author: event.senderID,
            link: replyText
          });
        }, event.messageID);
      } catch (err) {
        console.log(err.message);
        api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
      }
    }
  }
};