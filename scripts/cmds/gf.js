const axios = require('axios');

module.exports = {
  config: {
    name: "gf",
    version: "1.0.0",
    author: "ʙᴏᴋᴋᴏʀ",
    countdown: 5,
    role: 0,
    description: {
      en: "give gf"
    },
    category: "fun",
    guide: {
      en: "{n}"
    }
  },

  onStart: async function () {},

  onChat: async function ({ api, event, message }) {
    const input = event.body;
    if (input && (
      input.trim().toLowerCase().includes('gf de') || 
      input.trim().toLowerCase().includes('bot gf de') || 
      input.trim().toLowerCase().includes('need gf')
    )) {
      try {
        api.setMessageReaction("⏳", event.messageID, (err) => {}, true);

        // Fetching data from the API
        const response = await axios.get('https://gf-bokkor.onrender.com/gf');
        
        if (response.data && response.data.message) {
          const resMessage = response.data.message;
          const resLink = response.data.link; // Assuming the link is in response.data.link
          
          api.setMessageReaction("✅", event.messageID, (err) => {}, true);
          
          // Append the link to the message
          await message.reply({ body: `${resMessage}\nLink: ${resLink}` });
        } else {
          throw new Error('Invalid response format from API');
        }

      } catch (error) {
        console.error('Error fetching data:', error.message, error.response?.data || '');
        await message.reply('Error fetching data. Please try again later.');
      }
    }
  }
};
