const axios = require('axios');

module.exports = {
    config: {
        name: "hdimg",
        aliases: [],
        version: "1.0",
        author: "Dipto",
        countDown: 15,
        role: 0,
        description: "Pinterest Image Search",
        category: "MEDIA",
        guide: {
            en: "{pn} query"
        }
    },

    onStart: async function ({ api, event, args }) {
        const [q, length] = args.join(" ").split("-").map(item => item.trim());

        if (!q || !length) {
            return api.sendMessage("❌ | Please provide query and length.", event.threadID, event.messageID);
        }

        try {
            const w = await api.sendMessage("Please wait...", event.threadID);
            const d = ".io";
            const response = await axios.get(`https://www.noobs-apis.42web${d}/unsplash?q=${encodeURIComponent(q)}&limit=${encodeURIComponent(length)}`);
            const data = response.data.data;

            if (!data || data.length === 0) {
                return api.sendMessage("❌ | No images found.", event.threadID, event.messageID);
            }

            const totalImagesCount = Math.min(data.length, parseInt(length));
            const attachments = await Promise.all(data.map(async (imgURL) => {
                return await global.utils.getStreamFromURL(imgURL);
            }));

            await api.unsendMessage(w.messageID);
            await api.sendMessage({
                body: `✅ | High-quality Image Found\n\nSearch ⇒ ${q}\nTotal Images ⇒ ${totalImagesCount}`,
                attachment: attachments
            }, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            await api.sendMessage(`❌ | Error: ${error.message}`, event.threadID, event.messageID);
        }
    }
};
