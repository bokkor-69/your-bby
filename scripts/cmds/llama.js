
const axios = require("axios");

async function llama3(api, event, args, message) {
    try {
        const query = args.join(" ");
        if (!query) {
            return message.reply("Ask me anything... 😌");
        }

        const response = await axios.get(`https://llama3-rasin.vercel.app/rasin/api/llma3?chat=${encodeURIComponent(query)}`);
        
        if (response.data && response.data.response) {
            message.reply(response.data.response);
        } else {
            message.reply("❎");
        }
    } catch (error) {
        console.error("❎ | Error:", error.message);
        message.reply("❎ | An error occurred while processing your request!");
    }
}

const commandConfig = {
    name: "llama",
    aliases: ["llama", "llma"],
    version: "1.0",
    author: "ʙᴏᴋᴋᴏʀ",
    countDown: 5,
    role: 0,
    longDescription: "Chat with LLaMA 3",
    category: "LLAMA-3",
    guide: {
        en: "{p}llama3 {prompt}"
    }
};

module.exports = {
    config: commandConfig,
    handleCommand: llama3,
    onStart: function ({ api, message, event, args }) {
        return llama3(api, event, args, message);
    },
    onReply: function ({ api, message, event, args }) {
        return llama3(api, event, args, message);
    }
};

