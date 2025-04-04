const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: 'ringtone',
    author: 'Bokkor',
    usePrefix: false,
    category: 'Music Downloader'
  },
  onStart: async ({ event, api, args, message }) => {
    try {
      const query = args.join(' ') || "aadat"; // Default search keyword "aadat"
      if (!query) return message.reply('Please provide a search query!');

      const searchResponse = await axios.get(`https://api.zetsu.xyz/api/ringtone?q=${encodeURIComponent(query)}`);
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      if (!searchResponse.data.result || searchResponse.data.result.length === 0) {
        return message.reply('❌ No ringtones found!');
      }

      const selectedRingtone = searchResponse.data.result[0];
      const tempFilePath = path.join(__dirname, 'temp_ringtone.m4a');

      if (!selectedRingtone.audio) {
        throw new Error('No audio URL found in response');
      }

      const writer = fs.createWriteStream(tempFilePath);
      const audioResponse = await axios({
        url: selectedRingtone.audio,
        method: 'GET',
        responseType: 'stream'
      });

      audioResponse.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await message.reply({
        body: `🎶 Ringtone: ${selectedRingtone.title}\n🔗 Source: ${selectedRingtone.source}`,
        attachment: fs.createReadStream(tempFilePath)
      });

      fs.unlink(tempFilePath, (err) => {
        if (err) message.reply(`Error deleting temp file: ${err.message}`);
      });

    } catch (error) {
      message.reply(`❌ Error: ${error.message}`);
    }
  }
};