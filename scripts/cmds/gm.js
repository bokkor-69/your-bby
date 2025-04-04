const axios = require("axios");

module.exports = {
  config: {
    name: "gemi",
    version: "1.1",
    author: "Dipto",
    description: "Smart AI Command",
    countDown: 5,
    role: 0,
    category: "AI",
    guide: {
      en: "{pn} text | photo reply | clear",
    },
  },

  onStart: async ({ api, args, event }) => {
    const baseURL = "https://www.noobs-api.rf.gd/dipto/";
    const senderID = "123"; // ইউজারের ID

    //--------- Clear History ---------//
    if (args[0] === "clear") {
      try {
        await axios.get(`${baseURL}gemini_2_5_pro?text=clear&senderID=${senderID}`);
        return api.sendMessage("✅ Chat history cleared!", event.threadID, event.messageID);
      } catch (error) {
        return api.sendMessage(`❌ Error clearing history: ${error.message}`, event.threadID, event.messageID);
      }
    }

    //--------- Image Analysis ---------//
    if (event.type === "message_reply" && event.messageReply.attachments?.[0]?.url) {
      const imageUrl = encodeURIComponent(event.messageReply.attachments[0].url);
      try {
        const res = await axios.get(`${baseURL}gemini_2_5_pro?text=Describe+this&url=${imageUrl}&senderID=${senderID}`);
        console.log("API Response:", res.data); // Debugging

        if (res.data && res.data.response) {
          return api.sendMessage(res.data.response, event.threadID, event.messageID);
        } else {
          return api.sendMessage("❌ AI did not return a valid response.", event.threadID, event.messageID);
        }
      } catch (error) {
        return api.sendMessage(`❌ Error analyzing image: ${error.message}`, event.threadID, event.messageID);
      }
    }

    //--------- Text Chat ---------//
    const prompt = args.join(" ");
    if (!prompt) {
      return api.sendMessage("❌ Please provide a message or reply with an image.", event.threadID, event.messageID);
    }
    try {
      const res = await axios.get(`${baseURL}llama_3_70b?text=${encodeURIComponent(prompt)}&senderID=${senderID}`);
      console.log("API Response:", res.data); // Debugging

      if (res.data && res.data.response) {
        return api.sendMessage(res.data.response, event.threadID, event.messageID);
      } else {
        return api.sendMessage("❌ AI did not return a valid response.", event.threadID, event.messageID);
      }
    } catch (error) {
      return api.sendMessage(`❌ Error processing request: ${error.message}`, event.threadID, event.messageID);
    }
  },
};
