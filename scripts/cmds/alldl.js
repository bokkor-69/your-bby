const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: 'Alldl',
    category: 'alldl',
    author: 'Nyx'
  },
  onStart: async ({}) => {
    
  },
  onChat: async ({ args, message, api }) => {
    const url = args.join(' ');
    if (
      url.startsWith("https://vt.tiktok.com") ||
      url.startsWith("https://vm.tiktok.com") ||
      url.startsWith("https://www.tiktok.com/") ||
      url.startsWith("https://www.facebook.com") ||
      url.startsWith("https://fb.watch") ||
      url.startsWith("https://www.instagram.com/") ||
      url.startsWith("https://www.instagram.com/p/") ||
      url.startsWith("https://x.com/") ||
      url.startsWith("https://twitter.com/") ||
      url.startsWith("https://pin.it/")
    ) {
      const loadingMessage = await message.reply('Downloading video, please wait...');
      try {
        const { data } = await axios.get(`https://www.noobz-api.rf.gd/api/alldl?url=${url}`);
        const downloadLink = data.downloadLink; 
        const tempFilePath = path.join(__dirname, 'temp_video.mp4');
        const writer = fs.createWriteStream(tempFilePath);
        const videoResponse = await axios({ url: downloadLink, responseType: 'stream' });
        videoResponse.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
        await message.reply({
          body: 'Here is your video:',
          attachment: fs.createReadStream(tempFilePath)
        });
        await api.unsendMessage(loadingMessage.messageID);
        fs.unlink(tempFilePath, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
      } catch (error) {
        console.error('Error downloading video:', error);
        await message.reply('Failed to download the video.');
        await api.unsendMessage(loadingMessage.messageID);
      }
    } else if (url.startsWith("https://youtube.com/") || url.startsWith("https://youtu.be/")) {
      const loadingMessage = await message.reply('Downloading YouTube video, please wait...');
      try {
        const { data } = await axios.get(`https://fastapi-nyx-production.up.railway.app/y?url=${encodeURIComponent(url)}&type=mp4`);
        const videoUrl = data.url;
        const tempFilePath = path.join(__dirname, 'nyx_video.mp4');
        const writer = fs.createWriteStream(tempFilePath);
        const videoResponse = await axios({ url: videoUrl, responseType: 'stream' });
        videoResponse.data.pipe(writer);
        
        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
        await message.reply({
          body: 'Here is your YouTube video:',
          attachment: fs.createReadStream(tempFilePath)
        });
        await api.unsendMessage(loadingMessage.messageID);
        fs.unlink(tempFilePath, (err) => {
          if (err) console.error('Error deleting temp file:', err);
        });
      } catch (error) {
        console.error('Error downloading YouTube video:', error);
        await message.reply('Failed to download the YouTube video.');
        await api.unsendMessage(loadingMessage.messageID);
      }
    }
  }
};