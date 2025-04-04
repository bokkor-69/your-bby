const axios = require('axios');
const jimp = require("jimp");
const fs = require("fs");

module.exports = {
 config: {
 name: "propose2",
 aliases: ["proposal"],
 version: "1.1",
 author: "Kivv × AceGun",
 countDown: 5,
 role: 0,
 shortDescription: "@mention someone to propose",
 longDescription: "",
 category: "fun",
 guide: "{pn} mention/tag"
 },

 onStart: async function ({ message, event }) {
   try {
     const mention = Object.keys(event.mentions);
     if (mention.length === 0) return message.reply("⚠️ Please mention someone!");

     let one, two;
     if (mention.length === 1) {
       one = event.senderID;
       two = mention[0];
     } else {
       one = mention[1];
       two = mention[0];
     }

     const imagePath = await generateProposalImage(one, two);
     if (fs.existsSync(imagePath)) {
       message.reply({
         body: "「 Please be mine😍❤️ 」",
         attachment: fs.createReadStream(imagePath)
       });
     } else {
       message.reply("⚠️ Failed to generate image, please try again later!");
     }
   } catch (error) {
     console.error(error);
     message.reply("❌ An error occurred, please try again!");
   }
 }
};

async function generateProposalImage(one, two) {
 try {
   const avone = await jimp.read(`https://graph.facebook.com/${one}/picture?width=512&height=512`);
   const avtwo = await jimp.read(`https://graph.facebook.com/${two}/picture?width=512&height=512`);

   avone.circle();
   avtwo.circle();

   const imagePath = "propose.png";
   const background = await jimp.read("https://i.ibb.co/RNBjSJk/image.jpg");

   background.resize(760, 506)
     .composite(avone.resize(90, 90), 210, 65)
     .composite(avtwo.resize(90, 90), 458, 105);

   await background.writeAsync(imagePath);
   return imagePath;
 } catch (err) {
   console.error("Image processing error:", err);
   return null;
 }
}
