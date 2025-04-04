const axios = require("axios");
const fs = require("fs");
const path = require("path");

const cacheFolder = path.join(__dirname, "cache");
if (!fs.existsSync(cacheFolder)) fs.mkdirSync(cacheFolder);

module.exports = {
  config: {
    name: "spotify",
    aliases: ["spotifysong"],
    version: "3.0",
    author: "Bokkor",
    description: "Search and play Spotify tracks.",
    category: "Music",
    guide: "{pn} <song name>",
  },

  onStart: async function ({ api, event, args }) {
    try {
      if (!args.length) {
        return api.sendMessage("❌ | Please enter a song name to search.", event.threadID, event.messageID);
      }

      const query = encodeURIComponent(args.join(" "));
      const searchRes = await axios.get(`https://api.zetsu.xyz/search/spotify?q=${query}`);

      if (!searchRes.data.result || !searchRes.data.result.length) {
        return api.sendMessage("❌ | No songs found on Spotify.", event.threadID, event.messageID);
      }

      const track = searchRes.data.result[0]; // Select the first result
      const downloadRes = await axios.get(`https://mahi-apis.onrender.com/api/sing?query=${encodeURIComponent(track.title)}`);

      if (!downloadRes.data || !downloadRes.data.download_url) {
        return api.sendMessage("❌ | Failed to fetch the audio.", event.threadID, event.messageID);
      }

      const { title, duration, upload_date, download_url } = downloadRes.data;
      const fileName = `spotify_${Date.now()}.mp3`;
      const filePath = path.join(cacheFolder, fileName);

      const audioStream = await axios.get(download_url, { responseType: "stream" });
      const writer = fs.createWriteStream(filePath);
      audioStream.data.pipe(writer);

      writer.on("finish", () => {
        api.sendMessage(
          {
            body: `✅ 𝙃𝙚𝙧𝙚'𝙨 𝙮𝙤𝙪𝙧 𝙎𝙥𝙤𝙩𝙞𝙛𝙮 𝙩𝙧𝙖𝙘𝙠 🎶\n\n📌 𝐓𝐢𝐭𝐥𝐞: ${title}\n⏳ 𝐃𝐮𝐫𝐚𝐭𝐢𝐨𝐧: ${duration}\n📅 𝐑𝐞𝐥𝐞𝐚𝐬𝐞𝐝: ${upload_date}`,
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
      console.error("❌ Error in spotify command:", err);
      api.sendMessage("❌ | An error occurred while processing your request.", event.threadID, event.messageID);
    }
  },
};
