const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = "https://remini-bokkor.onrender.com/"; // ✅ API ঠিক করা হয়েছে

module.exports.config = {
  name: "remini2",
  aliases: ["4k", "remini"],
  category: "enhanced",
  author: "Romim"
};

module.exports.onStart = async function ({ api, event }) {
  try {
    // চেক করা হচ্ছে যে মেসেজে কোনো ছবি আছে কি না
    if (!event.messageReply || !event.messageReply.attachments || !event.messageReply.attachments[0]) {
      return api.sendMessage("❌ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐫𝐞𝐩𝐥𝐲 𝐭𝐨 𝐚𝐧 𝐢𝐦𝐚𝐠𝐞 𝐰𝐢𝐭𝐡 𝐭𝐡𝐞 𝐜𝐨𝐦𝐦𝐚𝐧𝐝.", event.threadID, event.messageID);
    }

    // ছবির URL পাওয়া
    const imageUrl = event.messageReply.attachments[0].url;
    const apiUrl = `${baseApiUrl}remini?url=${encodeURIComponent(imageUrl)}`;

    console.log(`🔍 Fetching enhanced image from: ${apiUrl}`);

    // API থেকে ছবি নিয়ে আসা
    const imageResponse = await axios.get(apiUrl, { responseType: 'arraybuffer' });

    if (!imageResponse || !imageResponse.data) {
      throw new Error("Failed to receive valid image response.");
    }

    // ফাইল পাথ তৈরি করা হচ্ছে
    const filePath = path.join(__dirname, "enhanced_image.jpg");

    // ছবি ফাইল সেভ করা হচ্ছে
    fs.writeFileSync(filePath, imageResponse.data);

    // ছবি পাঠানো হচ্ছে
    api.sendMessage({
      body: "✅ 𝐇𝐞𝐫𝐞 𝐢𝐬 𝐲𝐨𝐮𝐫 𝐞𝐧𝐡𝐚𝐧𝐜𝐞𝐝 𝐩𝐡𝐨𝐭𝐨!",
      attachment: fs.createReadStream(filePath)
    }, event.threadID, event.messageID);

    // ফাইল ডিলিট করা হচ্ছে
    fs.unlinkSync(filePath);

  } catch (e) {
    console.error(`❌ Error: ${e.message}`);
    api.sendMessage(`❌ Error: ${e.message}`, event.threadID, event.messageID);
  }
};