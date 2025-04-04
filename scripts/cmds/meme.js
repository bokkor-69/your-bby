const axios = require("axios");

module.exports.config = {
  name: "meme",
  version: "2.0",
  role: 0,
  author: "Bokkor",
  description: "Meme Generator",
  category: "𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥",
  premium: true,
  guide: "{pn} [text]",
  countDown: 15,
};

module.exports.onStart = async ({ event, args, api }) => {
  const apiURL = "https://www.noobz-api.rf.gd/api/meme"; // Updated API URL

  try {
    const text = args.join(" ") || "random"; // If no text is given, fetch a random meme
    const startTime = Date.now();
    
    const waitMessage = await api.sendMessage("𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐦𝐞𝐦𝐞, 𝐩𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭... 😆", event.threadID);
    api.setMessageReaction("⌛", event.messageID, () => {}, true);

    const response = await axios.get(`${apiURL}?text=${encodeURIComponent(text)}`);
    if (!response.data || !response.data.url) {
      throw new Error("Invalid response from API");
    }
    
    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    api.setMessageReaction("✅", event.messageID, () => {}, true);
    api.unsendMessage(waitMessage.messageID);

    api.sendMessage({
      body: `𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐦𝐞𝐦𝐞 😆\n(𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐢𝐧 ${timeTaken} 𝐬𝐞𝐜𝐨𝐧𝐝𝐬)`,
      attachment: await axios.get(response.data.url, { responseType: "stream" }).then(res => res.data)
    }, event.threadID);
    
  } catch (e) {
    api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
  }
};