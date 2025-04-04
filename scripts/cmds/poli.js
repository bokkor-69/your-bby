const axios = require("axios");

module.exports.config = {
  name: "poli",
  version: "1.0",
  role: 0,
  author: "Bokkor",
  description: "Generate AI-based images using Poli API.",
  category: "𝗜𝗠𝗔𝗚𝗘 𝗚𝗘𝗡𝗘𝗥𝗔𝗧𝗢𝗥",
  premium: true,
  guide: "{pn} [prompt] --model Flux-Anime",
  countDown: 15,
};

module.exports.onStart = async function ({ event, args, api }) {
  const apiUrl = "https://mahi-apis.onrender.com/api/poli"; // API URL

  if (args.length === 0) {
    return api.sendMessage("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐩𝐫𝐨𝐦𝐩𝐭 𝐭𝐨 𝐠𝐞𝐧𝐞𝐫𝐚𝐭𝐞 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞!", event.threadID, event.messageID);
  }

  const prompt = args.join(" ");
  const [promptText, model = "Flux-Anime"] = prompt.includes("--model")
    ? prompt.split("--model").map(s => s.trim())
    : [prompt, "Flux-Anime"];

  try {
    const waitMessage = await api.sendMessage("🎨 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐚𝐫𝐭... 𝐏𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭! ⏳", event.threadID);
    
    const response = await axios.get(`${apiUrl}?prompt=${encodeURIComponent(promptText)}&model=${encodeURIComponent(model)}`, { responseType: "stream" });

    api.unsendMessage(waitMessage.messageID);
    
    api.sendMessage({
      body: `✅ 𝐀𝐈-𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐈𝐦𝐚𝐠𝐞 𝐂𝐨𝐦𝐩𝐥𝐞𝐭𝐞!`,
      attachment: response.data,
    }, event.threadID, event.messageID);
    
  } catch (error) {
    console.error(error);
    api.sendMessage(`❌ 𝐄𝐫𝐫𝐨𝐫: ${error.message}`, event.threadID, event.messageID);
  }
};