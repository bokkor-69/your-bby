const axios = require("axios");
const path = require("path");
const fs = require("fs");

module.exports = {
  config: {
    name: "pexels",
    aliases: ["pex"],
    version: "1.0.0",
    author: "Bokkor",
    role: 0,
    countDown: 10,
    longDescription: {
      en: "Search for images on Pexels and fetch specified number of images."
    },
    category: "media",
    guide: {
      en: "{pn} <search query> <number of images>\nExample: {pn} nature - 5"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {
      const keySearch = args.join(" ");
      if (!keySearch.includes("-")) {
        return api.sendMessage(
          `Please enter the search query and number of images\n\nExample:\n{p}pexels nature - 5`,
          event.threadID,
          event.messageID
        );
      }

      const query = keySearch.substr(0, keySearch.indexOf('-')).trim();
      let limit = parseInt(keySearch.split("-").pop()) || 5;
      if (limit > 10) limit = 10;

      const apiUrl = `https://www.noobs-apis.42web.io/pexels?query=${encodeURIComponent(query)}&limit=${limit}&pageNumber=1`;
      const res = await axios.get(apiUrl);
      const images = res.data.imgUrl;
      const imgData = [];

      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      for (let i = 0; i < images.length; i++) {
        try {
          const imgResponse = await axios.get(images[i], {
            responseType: "arraybuffer",
            headers: {
              'User-Agent': 'Mozilla/5.0'
            }
          });
          const imgPath = path.join(cacheDir, `${i + 1}.jpg`);
          await fs.promises.writeFile(imgPath, imgResponse.data, 'binary');
          imgData.push(fs.createReadStream(imgPath));
        } catch (error) {
          console.error(`Error downloading image ${images[i]}:`, error.message);
        }
      }

      await api.sendMessage({
        body: `Here are ${imgData.length} images for: ${query}`,
        attachment: imgData,
      }, event.threadID, event.messageID);

      if (fs.existsSync(cacheDir)) {
        await fs.promises.rm(cacheDir, { recursive: true });
      }

    } catch (error) {
      console.error(error);
      return api.sendMessage(
        `An error occurred: ${error.message}`,
        event.threadID,
        event.messageID
      );
    }
  }
};
