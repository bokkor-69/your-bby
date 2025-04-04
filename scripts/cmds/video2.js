const fs = require("fs-extra");
const axios = require('axios');
const ytdl = require("@distube/ytdl-core");

module.exports = {
  config: {
    name: "video2",
    aliases: ["vdo"],
    version: "1.4.0",
    author: "Samir Œ",
    countDown: 5,
    role: 0,
    category: "media",
  },

  onStart: async function ({ api, event, message, args }) {
    try {
      let videox;
      
      if (args.length > 0) {
        videox = args.join(" ");
      } else {
        return api.sendMessage("Please provide a video title.", event.threadID, event.messageID);
      }

      const originalMessage = await message.reply(`𝐒𝐞𝐚𝐫𝐜𝐡𝐢𝐧𝐠 𝐟𝐨𝐫 ${videox} 𝐖𝐚𝐢𝐭 𝐁𝐛𝐲 😘✨`);
      const searchResponse = await axios.get(`https://mahi-apis.onrender.com/api/ytsearch?query=${encodeURIComponent(videox)}`);

      if (!searchResponse.data.items || searchResponse.data.items.length === 0) {
        return api.sendMessage("No videos found.", event.threadID, event.messageID);
      }

      const video = searchResponse.data.items[0]; // প্রথম ভিডিও নেওয়া হচ্ছে
      const videoUrl = video.url;

      const stream = ytdl(videoUrl, { filter: "audioandvideo" });

      const fileName = `${event.senderID}.mp4`;
      const filePath = __dirname + `/cache/${fileName}`;

      stream.pipe(fs.createWriteStream(filePath));

      stream.on('response', () => {
        console.info('[DOWNLOADER]', 'Starting download now!');
      });

      stream.on('info', (info) => {
        console.info('[DOWNLOADER]', `Downloading video: ${info.videoDetails.title}`);
      });

      stream.on('end', () => {
        console.info('[DOWNLOADER] Downloaded');

        if (fs.statSync(filePath).size > 87380608) {
          fs.unlinkSync(filePath);
          return api.sendMessage('❌ | The file is larger than 25MB and cannot be sent.', event.threadID);
        }

        const replyMessage = {
          body: `✅𝐇𝐞𝐫𝐞 𝐘𝐨𝐮𝐫 𝐕𝐢𝐝𝐞𝐨 𝐁𝐛𝐲 | Title: ${video.title}\n⏳ | Duration: ${video.duration}`,
          attachment: fs.createReadStream(filePath)
        };

        api.unsendMessage(originalMessage.messageID);

        api.sendMessage(replyMessage, event.threadID, () => {
          fs.unlinkSync(filePath);
        });
      });
    } catch (error) {
      console.error('[ERROR]', error);
      api.sendMessage('❌ | Video data not available.', event.threadID);
    }
  }
};