const axios = require("axios");
const fs = require("fs");
const path = require("path");

const cacheFolder = path.join(__dirname, "cache");
if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);

module.exports = {
  config: {
    name: "sing",
    aliases: ["singaudio"],
    version: "3.0",
    author: "Bokkor",
    description: "Search and play audio of a song.",
    category: "Music",
    guide: "{pn} <song name>",
  },

  onStart: async function ({ api, event, args }) {
    try {
      if (!args.length) {
        return api.sendMessage("❌ | Please enter a song name to search.", event.threadID, event.messageID);
      }

      const query = encodeURIComponent(args.join(" "));
      const res = await axios.get(`https://mahi-apis.onrender.com/api/sing?query=${query}`);

      if (!res.data || !res.data.download_url) {
        return api.sendMessage("❌ | No audio found for this song.", event.threadID, event.messageID);
      }

      const { title, duration, upload_date, download_url } = res.data;
      const fileName = `karaoke_${Date.now()}.mp3`;
      const filePath = path.join(cacheFolder, fileName);

      const audioStream = await axios.get(download_url, { responseType: "stream" });
      const writer = fs.createWriteStream(filePath);
      audioStream.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: `✅𝙃𝙚𝙧𝙚'𝙨 𝙮𝙤𝙪𝙧 𝙨𝙤𝙣𝙜 𝙗𝙖𝙗𝙮  🎶\n\n📌 𝐓𝐢𝐭𝐥𝐞: ${title}\n⏳ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧: ${duration}\n📅 𝐔𝐩𝐥𝐨𝐚𝐝𝐞𝐝: ${upload_date}`,
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          event.messageID
        );
      });

      writer.on("error", () => {
        api.sendMessage("❌ | Failed to download the audio file.", event.threadID, event.messageID);
      });
    } catch (err) {
      console.error("❌ Error in sing command:", err);
      api.sendMessage("❌ | An error occurred while processing your request.", event.threadID, event.messageID);
    }
  },
};
