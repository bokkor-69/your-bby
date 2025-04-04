const axios = require("axios");
const fs = require("fs");

module.exports.config = {
  name: "genix",
  version: "1.0.0",
  role: 2,
  author: "Dipto",
  description: "𝗣𝗿𝗼𝗺𝗽𝘁 𝘁𝗼 𝗽𝗵𝗼𝘁𝗼, 𝗽𝗵𝗼𝘁𝗼 𝘁𝗼 𝗽𝗵𝗼𝘁𝗼",
  category: "𝗜𝗠𝗔𝗚𝗘",
  guide: {
    en: `
    {pn} [prompt | reply to a photo] --ratio 16:9
    {pn} [model] [prompt | reply to a photo]`,
  },
  countDown: 10,
};

module.exports.onReply = async function ({ api, event, args, message }) {
  if (event.type == "message_reply") {
    let mod = args[0] || "1";
    let prompt = args.slice(1).join(" ").toLowerCase() || "anime type";
    const url = event.messageReply.attachments[0].url;
    if (isNaN(url)) {
      try {
        api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
        const wait = await message.reply("⏳ | 𝚆𝚊𝚒𝚝 𝙱𝚊𝚋𝚢 <😘");
        const response = await axios.get(`${global.api.dipto}/genix?url=${encodeURIComponent(url)}&prompt=${encodeURIComponent(prompt)}&model=${mod}`);
        const data = response.data.data;
        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
        message.unsend(wait.messageID);
        await api.sendMessage(
          {
            body: "✅ | 𝙷𝚎𝚛𝚎'𝚜 𝚢𝚘𝚞𝚛 𝚙𝚑𝚘𝚝𝚘 <😘",
            attachment: await global.utils.getStreamFromURL(data),
          },
          event.threadID,
          (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              link: data,
            });
          },
          event.messageID
        );
      } catch (error) {
        console.log(error);
        message.reply(`❎ | 𝙴𝚛𝚛𝚘𝚛: ${error.message}`);
      }
    }
  }
};

module.exports.onStart = async function ({ message, api, args, event }) {
  try {
    let mod = args[0] || "1";
    let prompt = args.slice(1).join(" ").toLowerCase() || "anime type";
    if (event.type === "message_reply") {
      const url = event.messageReply.attachments[0].url;
      const wait = message.reply("⏳ | 𝚆𝚊𝚒𝚝 𝙱𝚊𝚋𝚢 <😘");
      try {
        const response = await axios.get(`${global.api.dipto}/genix?url=${encodeURIComponent(url)}&prompt=${prompt}&model=${mod}`
        );
        const link = response.data.data;
        await api.sendMessage(
          {
            body: "✅ | 𝙷𝚎𝚛𝚎'𝚜 𝚢𝚘𝚞𝚛 𝚙𝚑𝚘𝚝𝚘 <😘",
            attachment: await global.utils.getStreamFromURL(link),
          },
          event.threadID,
          (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              link: link,
            });
          },
          event.messageID
        );
        api.unsendMessage(wait.messageID);
      } catch (e) {
        console.log(e);
        message.reply(`❎ | 𝙴𝚛𝚛𝚘𝚛: ${e.message}`);
      }
    } else if (prompt) {
      const prom = args.join(" ");
      const ratio = prom.split("--ratio")[1].trim() || "1:1";
      // const weight = prom.split("--weight")[1].trim() || 0.8;
      api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
      const wait = await message.reply("⏳ | 𝚆𝚊𝚒𝚝 𝙱𝚊𝚋𝚢 <😘");
      const response = await axios.get(`${global.api.dipto}/genix?prompt=${encodeURIComponent(prom)}&ratio=${ratio}`
      );
      const link = response.data.data;
      const filePath = __dirname + `/cache/genix.png`;
      const respo = await axios.get(link, { responseType: "stream" });
      const writer = fs.createWriteStream(filePath);
      respo.data.pipe(writer);
      writer.on("finish", async () => {
        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
        message.unsend(wait.messageID);
        await api.sendMessage(
          {
            body: "✅ | 𝙷𝚎𝚛𝚎'𝚜 𝚢𝚘𝚞𝚛 𝚙𝚑𝚘𝚝𝚘 <😘",
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          (error, info) => {
            global.GoatBot.onReply.set(info.messageID, {
              commandName: this.config.name,
              type: "reply",
              messageID: info.messageID,
              author: event.senderID,
              link: link,
            });
          },
          event.messageID
        );
        fs.unlinkSync(filePath);
      });
    }
  } catch (error) {
    console.error(`Failed to generate: ${error}`);
    message.reply(`❎ | 𝙴𝚛𝚛𝚘𝚛: ${error.message}`);
  }
};