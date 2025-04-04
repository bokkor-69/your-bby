const { config } = global.GoatBot;

module.exports = {
    config: {
        name: "viplist",
        version: "1.0",
        author: "NTKhang (Modified by Bokkor)",
        countDown: 5,
        role: 0,
        shortDescription: {
            en: "Show VIP user list"
        },
        longDescription: {
            en: "Displays a list of all users who have VIP roles."
        },
        category: "box chat",
        guide: {
            en: "{pn}: Show all VIP users"
        }
    },

    onStart: async function ({ message, usersData, getLang }) {
        if (!config.vipUser || config.vipUser.length === 0) {
            return message.reply("⚠️ | No VIP users found.");
        }

        const getNames = await Promise.all(
            config.vipUser.map(uid => usersData.getName(uid).then(name => `• ${name} (${uid})`))
        );
        
        return message.reply(`👑 | VIP Users List:\n${getNames.join("\n")}`);
    }
};