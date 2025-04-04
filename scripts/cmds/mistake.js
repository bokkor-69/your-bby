const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "mistake",
    aliases: ["cm"],
    version: "2.0",
    author: "Bokkor",
    countDown: 2,
    role: 0,
    description: "𝗔 𝘀𝗺𝗮𝗹𝗹 𝗺𝗶𝘀𝘁𝗮𝗸𝗲", 
    category: "FUN",
    guide: "{pn} (mention someone/uid/reply to a msg)"
  },

  onStart: async function ({ message, event, args }) {
    const permission = global.GoatBot.config.adminBot;
        if (!permission.includes(event.senderID)) {
            return message.reply("❌ ᴏɴʟʏ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ. ᴛʏᴘᴇ !ɪɴꜰᴏ ꜰᴏʀ ᴏᴡɴᴇʀ ɪɴꜰᴏ ");
        }
    const mention = Object.keys(event.mentions);
    let one;
    if (mention.length == 1) {
      one = mention[0];
    } else if(args[0]) {
      one = args[0];
    }else if(event.messageReply){
      one = event.messageReply.senderID;
    }

    try {
      const imagePath = await bal(one);
      await message.reply({
        body: " The Biggest Mistake in Earth ",
        attachment: fs.createReadStream(imagePath)
      });
    } catch (error) {
      console.error("Error while running command:", error);
      await message.reply("an error occurred");
    }
  }
};
async function bal(one) {
  const avatarone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`);
  const image = await jimp.read("https://i.postimg.cc/2ST7x1Dw/received-6010166635719509.jpg");
  image.resize(512, 512).composite(avatarone.resize(220, 203), 145, 305);
  const imagePath = path.join(__dirname, 'tmp', `${one}.png`);
  await image.writeAsync(imagePath);
  return imagePath;
  }