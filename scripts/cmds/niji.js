const axios = require("axios");
const { getStreamFromURL } = global.utils;

module.exports = {
    config: {
        name: "niji",
        aliases: ["nijijourney", "art"],
        version: "1.0",
        author: "rehat--",
        countDown: 0,
        role: 0,
        description: "𝗧𝗲𝘅𝘁 𝘁𝗼 𝗜𝗺𝗮𝗴𝗲",
        category: "𝗔𝗜",
        guide: {
            en: "{pn} prompt --ar [ratio] or reply an image\n\n Example: {pn} 1girl, cute face, masterpiece, best quality --ar 16:9\n[ default 1:1 ]"
        }
    },

    onStart: async function({ api, args, message, event }) {
        try {
            let prompt = "";
            let imageUrl = "";
            let aspectRatio = ""; 

            const aspectIndex = args.indexOf("--ar");
            if (aspectIndex !== -1 && args.length > aspectIndex + 1) {
                aspectRatio = args[aspectIndex + 1];
                args.splice(aspectIndex, 2); 
            }

            if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0 && ["photo", "sticker"].includes(event.messageReply.attachments[0].type)) {
                imageUrl = encodeURIComponent(event.messageReply.attachments[0].url);
            } else if (args.length === 0) {
              message.reply(formatFont("❎ | Please provide a prompt or reply to an image."));
                return;
            }
            
            if (args.length > 0) {
                prompt = args.join(" ");
            }
          message.reaction("⏳", event.messageID);
           const processingMessage = await message.reply(formatFont("⛵ | Initializing your request"));
            
            let apiUrl = `https://project-niji.onrender.com/api/v1/generate?prompt=${encodeURIComponent(prompt)}.&aspectRatio=${aspectRatio}&apikey=rehat`;
            if (imageUrl) {
                apiUrl += `&imageUrl=${imageUrl}`;
            }

            const response = await axios.post(apiUrl);
            const img = response.data.url;
            const formattedBody = formatFont(`
🕊 | Your Imagination Is Created 🌟
  ✅ | Download Link: `) + img;
            await message.reply({
                body: formattedBody,
                attachment: await getStreamFromURL(img)
            });
       message.unsend(processingMessage.messageID);
        } catch (error) {
            console.error(error);
            message.reply(formatFont("❌ |An error occurred."));
        }
    }
};
function formatFont(text) {
  const fontMapping = {
    a: "𝚊", b: "𝚋", c: "𝚌", d: "𝚍", e: "𝚎", f: "𝚏", g: "𝚐", h: "𝚑", i: "𝚒", j: "𝚓", k: "𝚔", l: "𝚕", m: "𝚖",
    n: "𝚗", o: "𝚘", p: "𝚙", q: "𝚚", r: "𝚛", s: "𝚜", t: "𝚝", u: "𝚞", v: "𝚟", w: "𝚠", x: "𝚡", y: "𝚢", z: "𝚣",
    A: "𝙰", B: "𝙱", C: "𝙲", D: "𝙳", E: "𝙴", F: "𝙵", G: "𝙶", H: "𝙷", I: "𝙸", J: "𝙹", K: "𝙺", L: "𝙻", M: "𝙼",
    N: "𝙽", O: "𝙾", P: "𝙿", Q: "𝚀", R: "𝚁", S: "𝚂", T: "𝚃", U: "𝚄", V: "𝚅", W: "𝚆", X: "𝚇", Y: "𝚈", Z: "𝚉"
  };

  let formattedText = "";
  for (const char of text) {
    if (char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }

  return formattedText;
}