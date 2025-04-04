const axios = require('axios');
const fs = require('fs-extra');

module.exports = {
    config: {
        name: "replicate",
        version: "1.0.0",
        role: 0,
        author: "ASIF",
        description: "𝗚𝗲𝗻𝗲𝗿𝗮𝘁𝗲 𝗶𝗺𝗮𝗴𝗲 𝗶𝗻 𝗿𝗲𝗽𝗹𝗶𝗰𝗮𝘁𝗲",
        category: "𝗔𝗜",
        guide: "{pn} [prompt]",
        countDown: 5,
    },

    onStart: async function ({ api, event, args, message }) {

        api.setMessageReaction("👀", event.messageID, (err) => {}, true);

        if (!args[0]) return api.sendMessage("❎ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝚞𝚜𝚎: 𝚛𝚎𝚙𝚕𝚒𝚌𝚊𝚝𝚎 [ 𝚙𝚛𝚘𝚖𝚙𝚝 ]", event.threadID, event.messageID);

       const p = await api.sendMessage("⏳ | 𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚒𝚗𝚐 𝚒𝚖𝚊𝚐𝚎, 𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝_", event.threadID);
        try {
            const prompt = args.join(' ');
            const res = await axios.get(`https://gen-img-two.vercel.app/replicate?prompt=${encodeURIComponent(prompt)}`);
            const img = res.data[0].url;
            const filePath = __dirname + '/cache/replicate.jpg';
            const image = (await axios.get(img, { responseType: "arraybuffer" })).data;
            fs.writeFileSync(filePath, Buffer.from(image, 'binary'));
message.unsend(p.messageID);
            api.sendMessage({
                body: `✅ | 𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚎𝚍 𝚒𝚖𝚊𝚐𝚎 𝚏𝚘𝚛 𝚙𝚛𝚘𝚖𝚙𝚝: ${prompt}`,
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => fs.unlinkSync(filePath));
        } catch (err) {
            return api.sendMessage(err, event.threadID);
        }
    },

   };