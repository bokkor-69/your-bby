const axios = require("axios");
const dip = "https://rubish-apihub.onrender.com/rubish";
const apiKey = "rubish69";

module.exports.config = {
  name: "imagine",
  version: "1.0",
  role: 2,
  author: "Dipto",
  description: { en: "Imagine AI Image Generator" },
  category: "Image gen",
  guide: "{pn} [prompt]",
  countDown: 15,
};

module.exports.onStart = async ({ message, event, args, api }) => {
  try {
    const prompt = args.join(" ");
    if (!prompt) return message.reply("Please provide a prompt!");

    const waitingMsg = await message.reply("Generating your image... ⏳");
    api.setMessageReaction("⌛", event.messageID, (err) => {}, true);

    // ইমেজ স্ট্রিম আকারে নেওয়া
    const response = await axios.get(
      `${dip}/imagine?prompt=${encodeURIComponent(prompt)}&apikey=${apiKey}`,
      { responseType: "stream" }
    );

    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    message.unsend(waitingMsg.messageID);

    await message.reply({
      body: `Here's your image for: ${prompt}`, 
      attachment: response.data, // ইমেজ স্ট্রিম পাঠানো হচ্ছে
    });

  } catch (e) {
    console.log(e);
    message.reply("Error: " + e.message);
  }
};
