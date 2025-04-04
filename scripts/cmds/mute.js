module.exports = {
    config: {
        name: "mute",
        aliases: ["mutethread"],
        version: "2.0",
        author: "ASIF",
        countDown: 1,
        role: 2,
        description: {
            en: "𝗠𝘂𝘁𝗲 𝗮 𝗧𝗵𝗿𝗲𝗮𝗱"
        },
        category: "𝗢𝗪𝗡𝗘𝗥",
        guide: {
            en: "{pn} [MuTe Time] | [TID]"
        }
    },

    onStart: async function ({ api, args, message, event}) {
        const [muteTime, tID] = (args.join(' ')).split('|').map(item => item.trim());
        let threadID = '';
        if(!threadID){
            threadID = event.threadID;
        }else if (!threadID && event.type == 'message_reply'){
            threadID = event.messageReply.threadID;
        }else{
            threadID = tID;
        }
        if(!threadID || !muteTime){
            return message.reply("❎ | 𝙿𝚕𝚎𝚊𝚜𝚎 𝙿𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚃𝚑𝚛𝚎𝚊𝚍𝙸𝙳 & 𝙼𝚞𝚝𝚎 𝚃𝚒𝚖𝚎")
        }
        try {
            await api.muteThread(threadID, muteTime); 
            if(muteTime === '0'){
            return message.reply(`✅ | 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚄𝚗𝚖𝚞𝚝𝚎𝚍 𝚃𝚑𝚛𝚎𝚊𝚍: ${threadID}`);
            }else if(muteTime === '-1'){
                return message.reply(`✅ | 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝙼𝚞𝚝𝚎𝚍 𝚃𝚑𝚛𝚎𝚊𝚍: ${threadID}  𝙵𝚘𝚛 - 𝚄𝚗𝚝𝚒𝚕 𝚢𝚘𝚞 𝚌𝚑𝚊𝚗𝚐𝚎 𝚒𝚝.`);
            }else{
                return message.reply(`✅ | 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝙼𝚞𝚝𝚎𝚍 𝚃𝚑𝚛𝚎𝚊𝚍: ${threadID} 𝙵𝚘𝚛 - ${muteTime}𝚜.`);
            }
        } catch (error) {
            console.log(error);
            return message.reply(`❎ | 𝙴𝚛𝚛𝚘𝚛: ${error.message}`);
        }
    }
};
