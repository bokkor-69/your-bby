module.exports = {
    config: {
        name: "sendnoti",
        aliases: ["notif", "announcement"],
        version: "2.0",
        author: "Bokkor",
        countDown: 5,
        role: 2,
        description: {
            en: "Send a notification to all threads when the bot starts."
        },
        category: "Utility",
        guide: {
            en: "This command runs automatically on bot startup."
        }
    },

    onStart: async function ({ api, Users }) {
        const allThread = global.data.allThreadID || [];
        const adminName = await Users.getNameUser(global.config.ADMIN_ID);
        const message = `【𝗠𝗲𝘀𝘀𝗮𝗴𝗲 𝗙𝗿𝗼𝗺 𝗔𝗱𝗺𝗶𝗻】\n\nBot has started successfully!\n\n-${adminName}`;

        let success = 0, failed = 0;
        for (let threadID of allThread) {
            try {
                await api.sendMessage(message, threadID);
                success++;
            } catch (e) {
                failed++;
            }
        }
        console.log(`✅ Notification sent to ${success} threads, ❌ failed in ${failed} threads.`);
    }
};