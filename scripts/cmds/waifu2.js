const axios = require("axios");

module.exports.config = {
  name: "waifu2",
  version: "1.1",
  role: 0,
  author: "Bokkor",
  description: "Waifu guessing game",
  category: "𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥",
  premium: true,
  guide: "{pn} to get a random waifu image, reply with the waifu's name to win!",
  countDown: 10,
};

let waifuData = {}; // Store waifu names temporarily for each user

module.exports.onStart = async ({ event, args, api }) => {
  const apiURL = "https://www.noobz-api.rf.gd/api/waifu";
  try {
    const searchQuery = args.join(" ") || "random";
    const startTime = Date.now();
    
    const waitMessage = await api.sendMessage("🔍 Searching for waifu... 💕", event.threadID);
    api.setMessageReaction("⌛", event.messageID, () => {}, true);

    const response = await axios.post(apiURL, { search: searchQuery });
    if (!response.data || !response.data.url || !response.data.name) {
      throw new Error("Invalid response from API");
    }
    
    const { url, description, name } = response.data;
    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    
    api.setMessageReaction("✅", event.messageID, () => {}, true);
    api.unsendMessage(waitMessage.messageID);

    const imageStream = await global.utils.getStreamFromURL(url);
    
    api.sendMessage({
      body: `💖 𝐖𝐚𝐢𝐟𝐮 𝐅𝐨𝐮𝐧𝐝! 💖\n${description}\n(𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐢𝐧 ${timeTaken} 𝐬𝐞𝐜𝐨𝐧𝐝𝐬)\n\n⚡ Reply with the waifu's name to win rewards!`,
      attachment: imageStream,
    }, event.threadID, (err, info) => {
      if (!err) {
        waifuData[info.messageID] = name.toLowerCase(); // Store waifu name
      }
    });
  } catch (e) {
    api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
  }
};

module.exports.onReply = async ({ event, api }) => {
  const userReply = event.body.trim().toLowerCase();
  const correctName = waifuData[event.messageReply?.messageID];
  
  if (correctName) {
    if (correctName.includes(userReply)) {
      api.sendMessage(`✅ Correct answer! 🎉\nYou have earned 1000 coins and 121 exp.`, event.threadID);
    } else {
      api.sendMessage(`❌ Wrong answer! Try again next time.`, event.threadID);
    }
    delete waifuData[event.messageReply?.messageID]; // Remove after checking
  }
};