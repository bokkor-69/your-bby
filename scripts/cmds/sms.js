const axios = require('axios');

module.exports = {
  config: {
    name: "sms",
    aliases: ["sms-api"],
    version: "1.0",
    author: "RUBISH",
    countDown: 30, 
    role: 0,
    description: "𝗦𝗺𝘀 𝗦𝗲𝗻𝗱𝗲𝗿 𝗚𝗼𝗮𝘁𝗕𝗼𝘁 𝗔𝗽𝗶",
    category: "𝗧𝗢𝗢𝗟𝗦",
    guide : {
    en: "{pn} <number> - <your message>"
    }
  },

  onStart: async function ({ message, args, event }) {
       const fuck = args.join(" ");
    
    const permission = global.GoatBot.config.vipUser;
    if (!permission.includes(event.senderID)) {
      api.sendMessage(fuck, event.threadID, event.messageID);
      return;
    }
    const [phoneNumber, messageText] = args.join(" ").trim().split(/\s*-\s*/);
    if (!phoneNumber || !messageText) {
      return message.reply(`
⚠ | Please enter a number

Example➝ .sms 01819191980-hello`);
    } else {
      
      const obfuscatedNumber = phoneNumber.replace(/(?<=^\d{3})\d{5}(?=\d{2})/g, '***');
      const url = `https://custom-sms-rubish.onrender.com/rubish-sms?number=${phoneNumber}&sms=${messageText}`;
      try {
        const response = await axios.get(url);
        const form = {
          body: `
✅ | 𝑆𝑀𝑆 𝑆𝑒𝑛𝑡 𝑆𝑢𝑐𝑐𝑒𝑠𝑠𝑓𝑢𝑙𝑙𝑦  
𝑁𝑢𝑚𝑏𝑒𝑟: ${obfuscatedNumber}  
𝑀𝑒𝑠𝑠𝑎𝑔𝑒: ${messageText}`
        };
        message.reply(form);
      } catch (error) {
        console.error(error);
        message.reply("❌ | A̷n̷ e̷r̷r̷o̷r̷ o̷c̷c̷u̷r̷r̷e̷d̷ w̷h̷i̷l̷e̷ s̷e̷n̷d̷i̷n̷g̷ t̷h̷e̷ S̷M̷S̷.̷");
      }
    }
  }
};