const axios = require('axios');

// API URLs
const tOrDApiUrl = "https://t-d-bokkor.vercel.app";  // Updated API URL
const adminUID = '61558455297317';

module.exports = {
  config: {
    name: "tord",
    version: "1.2.3",
    author: "ʙᴏᴋᴋᴏʀ",
    role: 0,
    description: "{pn} - Truth or Dare game",
    category: "games",
    countDown: 5,
    guide: {
      en: "{pn} t | d | add <new question> | rmv <question> | count <t|d> | list <t|d>"
    }
  },

  onStart: async function ({ message, event, args, api }) {
    try {
      const command = args[0];
      const userID = event.senderID;

      // ✅ Add new question (anyone can add)
      if (command === 'add') {
        if (!args[1]) {
          return api.sendMessage("⚠ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ɴᴇᴡ ᴛʀᴜᴛʜ ᴏʀ ᴅᴀʀᴇ ǫᴜᴇsᴛɪᴏɴ!", event.threadID, event.messageID);
        }

        const newDare = args.slice(2).join(' ');

        if (args[1] === "t") {
          await axios.get(`${tOrDApiUrl}/add/t?t=${encodeURIComponent(newDare)}`);
          return api.sendMessage(`✅ | ɴᴇᴡ ǫᴜᴇsᴛɪᴏɴ ᴀᴅᴅᴇᴅ "Truth" : ${newDare}`, event.threadID, event.messageID);
        } else if (args[1] === "d") {
          await axios.get(`${tOrDApiUrl}/add/d?d=${encodeURIComponent(newDare)}`);
          return api.sendMessage(`✅ | ɴᴇᴡ ǫᴜᴇsᴛɪᴏɴ ᴀᴅᴅᴇᴅ "Dare" : ${newDare}`, event.threadID, event.messageID);
        }
      }

      // ✅ "tord rmv" - Remove a question
      if (command === 'rmv') {
        if (!args[1]) {
          return api.sendMessage("⚠ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ǫᴜᴇsᴛɪᴏɴ ᴛᴏ ʀᴇᴍᴏᴠᴇ!", event.threadID, event.messageID);
        }
        const questionToRemove = args.slice(2).join(' ');

        if (args[1] === "t") {
          await axios.get(`${tOrDApiUrl}/rmv/t?t=${encodeURIComponent(questionToRemove)}`);
          return api.sendMessage(`✅ | ǫᴜᴇsᴛɪᴏɴ ʀᴇᴍᴏᴠᴇᴅ "Truth" : ${questionToRemove}`, event.threadID, event.messageID);
        } else if (args[1] === "d") {
          await axios.get(`${tOrDApiUrl}/rmv/d?d=${encodeURIComponent(questionToRemove)}`);
          return api.sendMessage(`✅ | ǫᴜᴇsᴛɪᴏɴ ʀᴇᴍᴏᴠᴇᴅ "Dare" : ${questionToRemove}`, event.threadID, event.messageID);
        }
      }

      // ✅ "tord count" - Get count of questions
      if (command === 'count') {
        if (args[1] !== 't' && args[1] !== 'd') {
          return api.sendMessage("⚠ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ᴛʏᴘᴇ (ᴛ|ᴅ)", event.threadID, event.messageID);
        }
        const response = await axios.get(`${tOrDApiUrl}/count/${args[1]}`);
        const count = response.data.count;
        const message = `${args[1] === 't' ? 'Truth' : 'Dare'} questions count: ${count}`;
        return api.sendMessage(message, event.threadID, event.messageID);
      }

      // ✅ "tord list" - Get list of questions
      if (command === 'list') {
        if (args[1] !== 't' && args[1] !== 'd') {
          return api.sendMessage("⚠ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴠᴀʟɪᴅ ᴛʏᴘᴇ (ᴛ|ᴅ)", event.threadID, event.messageID);
        }
        const response = await axios.get(`${tOrDApiUrl}/count/${args[1]}`);
        const questions = response.data.questions.join('\n');
        return api.sendMessage(`${args[1] === 't' ? 'Truth' : 'Dare'} questions list: \n${questions}`, event.threadID, event.messageID);
      }

      // ✅ "tord t" - Get a Truth question
      if (command === 't') {
        const response = await axios.get(`${tOrDApiUrl}/t`);
        const question = response.data.question || "❌ |ɴᴏ ǫᴜᴇsᴛɪᴏɴ ғᴏᴜɴᴅ!";
        return api.sendMessage(`✨🐣 |ᴛʀᴜᴛʜ ǫᴜᴇsᴛɪᴏɴ: ${question}`, event.threadID, event.messageID);
      }

      // ✅ "tord d" - Get a Dare question
      if (command === 'd') {
        const response = await axios.get(`${tOrDApiUrl}/d`);
        const { question } = response.data || "❌ |ɴᴏ ǫᴜᴇsᴛɪᴏɴ ғᴏᴜɴᴅ!";
        return api.sendMessage(`💥😎 |ᴅᴀʀᴇ ᴄʜᴀʟʟᴇɴɢᴇ: ${question}`, event.threadID, event.messageID);
      }

      // ✅ Any Reply Detection
      if (event.type === "message_reply") {
        return api.sendMessage("✅ |ᴄᴏɴɢʀᴀᴛᴜʟᴀᴛɪᴏɴs!", event.threadID, event.messageID);
      }

      // ❌ Invalid Command
      return api.sendMessage(
        "⚠ |ɪɴᴠᴀʟɪᴅ ᴄᴏᴍᴍᴀɴᴅ! ᴜsᴇ:\n- ᴛᴏʀᴅ ᴛ (ᴛʀᴜᴛʜ ǫᴜᴇsᴛɪᴏɴ)\n- ᴛᴏʀᴅ ᴅ (ᴅᴀʀᴇ ǫᴜᴇsᴛɪᴏɴ)\n- ᴛᴏʀᴅ ᴀᴅᴅ <ɴᴇᴡ ǫᴜᴇsᴛɪᴏɴ> (ᴇᴠᴇʀʏᴏɴᴇ ᴄᴀɴ ᴀᴅᴅ)\n- ᴛᴏʀᴅ ʀᴍᴠ <question>\n- ᴛᴏʀᴅ ᴄᴏᴜɴᴛ ᴛ/ᴅ\n- ᴛᴏʀᴅ ʟɪsᴛ ᴛ/ᴅ", 
        event.threadID, event.messageID
      );

    } catch (error) {
      await api.sendMessage(`❌ |Error: ${error.message}`, event.threadID, event.messageID);
    }
  }
};
