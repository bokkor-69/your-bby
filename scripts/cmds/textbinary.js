const axios = require("axios");

module.exports.config = {
  name: "textbinary",
  version: "1.0",
  role: 0,
  author: "Bokkor",
  description: "Text to Binary Conversion",
  category: "𝗧𝗘𝗫𝗧 𝗧𝗢 𝗕𝗜𝗡𝗔𝗥𝗬",
  premium: false,
  guide: "{pn} [text]",
  countDown: 10,
};

module.exports.onStart = async ({ event, args, api }) => {
  const dipto = "https://rubish-apihub.onrender.com/rubish//text-binary"; // API URL বাইনারি কনভার্সন করার জন্য
  const apikey = "rubish69"; // API KEY

  try {
    const prompt = args.join(" "); // টেক্সট ইনপুট
    if (!prompt) {
      return api.sendMessage("❌ Please provide some text to convert to binary.", event.threadID, event.messageID);
    }

    const startTime = Date.now();

    const waitMessage = await api.sendMessage("🔄 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐢𝐧𝐠 𝐛𝐢𝐧𝐚𝐫𝐲 𝐜𝐨𝐝𝐞... Please wait...", event.threadID);
    api.setMessageReaction("⌛", event.messageID, () => {}, true);

    const apiurl = `${dipto}?text=${encodeURIComponent(prompt)}&apikey=${apikey}`; // API URL তৈরি
    const response = await axios.get(apiurl); // বাইনারি কনভার্সন API কল করা হচ্ছে

    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2); // সময় হিসেব করা

    api.setMessageReaction("✅", event.messageID, () => {}, true);
    api.unsendMessage(waitMessage.messageID);

    const binaryOutput = response.data.binary; // বাইনারি আউটপুট

    api.sendMessage({
      body: `𝐇𝐞𝐫𝐞'𝐬 𝐲𝐨𝐮𝐫 𝐛𝐢𝐧𝐚𝐫𝐲 𝐜𝐨𝐝𝐞 😘\n(𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐢𝐧 ${timeTaken} 𝐬𝐞𝐜𝐨𝐧𝐝𝐬)\n\n${binaryOutput}`,
    }, event.threadID, event.messageID);
    
  } catch (e) {
    console.error(e);
    api.sendMessage("Error: " + e.message, event.threadID, event.messageID);
  }
};