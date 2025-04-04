const axios = require("axios");

module.exports.config = {
  name: "waifu",
  version: "1.0",
  role: 0,
  author: "Bokkor",
  description: "Waifu Image Generator",
  category: "𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥",
  premium: true,
  guide: "{pn} [character name]",
  countDown: 10,
};

module.exports.onStart = async ({ event, args, api }) => {
  const apiURL = "https://www.noobz-api.rf.gd/api/waifu";

  try {
    const searchQuery = args.join(" ") || "random";
    const startTime = Date.now();
    
    const waitMessage = await api.sendMessage("🔍 Searching for waifu... 💕", event.threadID);
    api.setMessageReaction("⌛", event.messageID, () => {}, true);

    const postData = { search: searchQuery };
    const response = await axios.post(apiURL, postData);
    if (!response.data || !response.data.url) {
      throw new Error("Invalid response from API");
    }
    
    const { url, description } = response.data;
    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    
    api.setMessageReaction("✅", event.messageID, () => {}, true);
    api.unsendMessage(waitMessage.messageID);

    const imageStream = await global.utils.getStreamFromURL(url);
    
    api.sendMessage({
      body: `💖 𝐖𝐚𝐢𝐟𝐮 𝐅𝐨𝐮𝐧𝐝! 💖\n${description}\n(𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐢𝐧 ${timeTaken} 𝐬𝐞𝐜𝐨𝐧𝐝𝐬)`,
      attachment: imageStream,
    }, event.threadID, event.messageID);
    
  } catch (e) {
    api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
  }
};