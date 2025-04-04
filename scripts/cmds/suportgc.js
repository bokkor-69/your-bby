module.exports = {
  config: {
    name: "s",
    aliases: ["support"],
    version: "1.1",
    author: "ASIF",
    countDown: 5,
    role: 0,
    description: {
      en: "𝗝𝗼𝗶𝗻 𝘁𝗵𝗲 𝗼𝗳𝗳𝗶𝗰𝗶𝗮𝗹 𝘀𝘂𝗽𝗽𝗼𝗿𝘁 𝗴𝗿𝗼𝘂𝗽 𝗰𝗵𝗮𝘁"
    },
    category: "𝗚𝗢𝗔𝗧𝗕𝗢𝗧",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, args, event, threadsData, message }) {
    const supportGroupThreadID = "9481265011934435"; // Replace with your support group thread ID

    const { messageReply, mentions, senderID, type } = event;

    let uid;
    
    if (args[0]){
      uid = args[0];
    } 
    else if(type == "message_reply" && messageReply) {
      uid = messageReply.senderID;
    } 
    else if(mentions){
      uid = Object.keys(mentions)[0];
    }
    if(!uid){
      return message.reply("❎ | 𝙲𝚊𝚗𝚗𝚘𝚝 𝚐𝚎𝚝 𝚞𝚒𝚍 𝚘𝚏 𝚝𝚑𝚒𝚜 𝚞𝚜𝚎𝚛");
    }
    try {
    if (!uid && senderID){
        name = "You";
      }
      else{
        var name = (await api.getUserInfo(uid))[uid].name;
      }

      const { members } = await threadsData.get(supportGroupThreadID);

      // Check if the user is already a member of the support group
      const userAlreadyInGroup = members.some(
        member => member.userID == uid.toString() && member.inGroup
      );

      if (userAlreadyInGroup) {
        // Reply with a message indicating that the user is already in the group

        return message.reply("⚠️ | 𝙰𝚕𝚛𝚎𝚊𝚍𝚢 𝚒𝚗 𝚐𝚛𝚘𝚞𝚙");
      }

      // Add the user to the support group
      await api.addUserToGroup(uid.toString(), supportGroupThreadID);

      // Reply with a message indicating successful addition

      return message.reply(`✅ | 𝚂𝚞𝚌𝚌𝚎𝚜𝚜𝚏𝚞𝚕𝚕𝚢 𝚊𝚍𝚍𝚎𝚍 ${name} 𝚝𝚘 𝚝𝚑𝚎 𝚐𝚛𝚘𝚞𝚙`);

    } catch (error) {
      // Handle any errors that occur during the process
             console.error("Error adding user to support group:", error);
      return message.reply(`❎ | 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚊𝚍𝚍 ${name} 𝚝𝚘 𝚝𝚑𝚎 𝚐𝚛𝚘𝚞𝚙`);
    }
  }
};