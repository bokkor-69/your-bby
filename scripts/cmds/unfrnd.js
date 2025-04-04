const { findUid } = global.utils;
const regExCheckURL = /^(http|https):\/\/[^ "]+$/;

module.exports = {
    config: {
        name: "unfriend",
        aliases: ["unfrienduser"],
        version: "2.0",
        author: "ASIF",
        countDown: 1,
        role: 2,
        description: {
            en: "𝗨𝗻𝗳𝗿𝗶𝗲𝗻𝗱 𝗮 𝗨𝘀𝗲𝗿 𝗯𝘆 𝗨𝗜𝗗"
        },
        category: "𝗢𝗪𝗡𝗘𝗥",
        guide: {
            en: "{pn} [userId/messageReply/mention/linkFB] - Must be user needs to be friend with bot."
        }
    },

    onStart: async function ({ api, args, message, event}) {
        const permission = global.GoatBot.config.owner;
        if (!permission.includes(event.senderID)) {
            return message.reply("❌ ᴏɴʟʏ ʙᴏᴛ ᴏᴡɴᴇʀ ᴄᴀɴ ᴜsᴇ. ᴛʏᴘᴇ !ɪɴꜰᴏ ꜰᴏʀ ᴏᴡɴᴇʀ ɪɴꜰᴏ ");
        }
        const [userId] = args;
        const mention = Object.keys(event.mentions);
        let userID = '';
        if(!userId && event.mentions.length == 1) {
            userID = mention[0];
        }else if (!userId && event.type == 'message_reply') {
            userID = event.messageReply.senderID;
        }else if (args[0].match(regExCheckURL)) {
            try {
            userID = await findUid(userId);
            }
            catch (e) {
            console.log(e.message)
            }
        }else {
            userID = userId;
        }
        if(!userID){                    
            return message.reply("❎ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝙿𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚄𝚜𝚎𝚛𝙸𝙳")
        }
        try {
            await api.unfriend(userID); 
            return message.reply(`✅ | 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚄𝚗𝚏𝚛𝚒𝚎𝚗𝚍𝚎𝚍 𝚄𝚜𝚎𝚛: ${userID}`);

        } catch (error) {
            console.log(error);
            return message.reply(`❎ | 𝙴𝚛𝚛𝚘𝚛: ${error.message}`);
        }
    }
};
