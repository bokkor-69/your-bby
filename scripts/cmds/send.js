module.exports = {
  config: {
    name: "send",
    version: "1.4",
    author: "Riley",
    role: 0,
    shortDescription: "Give coins to another user",
    category: "Economy",
    guide: "{p}send <@mention/user_id> <amount>",
  },
  onStart: async function ({ api, event, args, usersData }) {
    const { senderID, messageReply, mentions, threadID } = event;
    const userData = await usersData.get(senderID);

    let recipientID;
    if (Object.keys(mentions).length > 0) {
      recipientID = Object.keys(mentions)[0]; // Mention করা ইউজার
    } else if (messageReply) {
      recipientID = messageReply.senderID; // রিপ্লাই করা ইউজার
    } else {
      recipientID = args[0]; // ডিরেক্ট UID ইনপুট
    }

    if (!recipientID) {
      return api.sendMessage("Please mention a user, reply to their message, or enter their ID.", threadID);
    }

    // সর্বশেষ আর্গুমেন্টকে amount হিসেবে ধরা
    const amount = parseInt(args[args.length - 1]);
    
    if (isNaN(amount) || amount <= 0) {
      return api.sendMessage("Please enter a valid amount.", threadID);
    }

    if (userData.money < amount) {
      return api.sendMessage("Not enough money to give.", threadID);
    }

    const recipientData = await usersData.get(recipientID);
    const recipientName = recipientData.name || "User";

    userData.money -= amount;
    recipientData.money += amount;

    await usersData.set(senderID, userData);
    await usersData.set(recipientID, recipientData);

    function formatNumber(num) {
      if (num >= 1e12) return (num / 1e12).toFixed(1) + 't';
      if (num >= 1e9) return (num / 1e9).toFixed(1) + 'b';
      if (num >= 1e6) return (num / 1e6).toFixed(1) + 'm';
      if (num >= 1e3) return (num / 1e3).toFixed(1) + 'k';
      return num;
    }

    api.sendMessage(`✅ | Successfully sent ${formatNumber(amount)}$ to ${recipientName}.`, threadID);
  },
};