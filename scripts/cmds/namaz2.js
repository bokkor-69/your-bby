const axios = require("axios");

module.exports = {
  config: {
    name: "namaz",
    aliases: ["prayertime", "salat"],
    version: "1.4",
    author: "Bokkor",
    description: "Fetch today's prayer times for a specific district in Bangladesh.",
    category: "utilities",
    guide: {
      en: "{pn} [district_name]",
    },
  },

  onStart: async function ({ api, event, args }) {
    let district = args.join(" ").toLowerCase();
    
    if (!district) {
      return api.sendMessage(
        "❌ | Please provide a **district name**. Example: !namaz Khulna",
        event.threadID,
        event.messageID
      );
    }

    const PRAYER_API_URL = `https://bokkor-namaz.onrender.com/namaz-time/${encodeURIComponent(district)}`;

    try {
      // Fetch prayer times from API
      const response = await axios.get(PRAYER_API_URL);
      const data = response.data;

      if (!data || !data.namaz_times) {
        return api.sendMessage(
          `❌ | Unable to fetch prayer times for ${district}. Please try again later.`,
          event.threadID,
          event.messageID
        );
      }

      const namaz = data.namaz_times;
      const messageBody = `🌙 𝗡𝗮𝗺𝗮𝘇 𝗧𝗶𝗺𝗲𝘀 - ${data.district.charAt(0).toUpperCase() + data.district.slice(1)} 🌙

📿 𝗙𝗮𝗷𝗿:  🕰 ${namaz.fajr}  
🕌 𝗗𝗵𝘂𝗵𝗿:  🕰 ${namaz.dhuhr}  
🌅 𝗔𝘀𝗿:  🕰 ${namaz.asr}  
🌇 𝗠𝗮𝗴𝗵𝗿𝗶𝗯:  🕰 ${namaz.maghrib}  
🌌 𝗜𝘀𝗵𝗮:  🕰 ${namaz.isha}  
📢 𝗝𝘂𝗺𝗺𝗮𝗵:  🕰 ${namaz.jummah}  

⏳  Current Time:  ${data.current_time}  
🔜  Next Namaz:  ${data.next_namaz}  🕰 ${data.next_namaz_time}  
🕰  Time Remaining: ${data.time_remaining}  

━━━━━━━━━━━━━━━  
😘😘 ᴄʀᴇᴀᴛᴇᴅ ʙʏ ʙᴏᴋᴋᴏʀ  
━━━━━━━━━━━━━━━  
      `;
      api.sendMessage(messageBody, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage(
        `⚠️ | An error occurred while fetching prayer times for ${district}. Please try again later.`,
        event.threadID,
        event.messageID
      );
    }
  },
};