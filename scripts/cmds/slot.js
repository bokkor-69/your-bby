module.exports = {
  config: {
    name: "slot",
    version: "1.2",
    author: "xxx",
    countDown: 5,
    shortDescription: {
      en: "Slot game",
    },
    longDescription: {
      en: "Slot game.",
    },
    category: "game",
  },
  langs: {
    en: {
      invalid_amount: "Enter a valid and positive amount to have a chance to win double",
      not_enough_money: "Check your balance if you have that amount",
      spin_message: "Spinning...",
      win_message: "• 𝐁𝐚𝐛𝐲, 𝐘𝐨𝐮 𝐰𝐨𝐧 $%1",
      lose_message: "• 𝐁𝐚𝐛𝐲, 𝐘𝐨𝐮 𝐥𝐨𝐬𝐭 $%1",
      spin_count: ">🎀",
      wrong_use_message: "❌ | WRONG use: Please enter a valid and positive number as your bet amount.",
      time_left_message: "❌ | 𝐘𝐨𝐮 𝐡𝐚𝐯𝐞 𝐫𝐞𝐚𝐜𝐡𝐞𝐝 𝐲𝐨𝐮𝐫 𝐬𝐥𝐨𝐭 𝐥𝐢𝐦𝐢𝐭. 𝐏𝐥𝐞𝐚𝐬𝐞 𝐭𝐫𝐲 𝐚𝐠𝐚𝐢𝐧 𝐢𝐧 %1𝐡 %2𝐦.",
    },
  },
  onStart: async function ({ args, message, event, usersData, getLang, api }) {
    const { senderID } = event;
    const maxlimit = 15;
    const slotTimeLimit = 12 * 60 * 60 * 1000;
    const currentTime = new Date();
    const userData = await usersData.get(senderID);

    if (!userData.data.slots) {
      userData.data.slots = { count: 0, firstSlot: currentTime.getTime() };
    }

    const timeElapsed = currentTime.getTime() - userData.data.slots.firstSlot;
    if (timeElapsed >= slotTimeLimit) {
      userData.data.slots = { count: 0, firstSlot: currentTime.getTime() };
    }

    if (userData.data.slots.count >= maxlimit) {
      const timeLeft = slotTimeLimit - timeElapsed;
      const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      return api.sendMessage(getLang("time_left_message", hoursLeft, minutesLeft), event.threadID, event.messageID);
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount) || amount <= 0) {
      return api.sendMessage(getLang("wrong_use_message"), event.threadID, event.messageID);
    }
    if (userData.money < amount) {
      return api.sendMessage(getLang("not_enough_money"), event.threadID, event.messageID);
    }

    userData.data.slots.count += 1;
    await usersData.set(senderID, { ...userData });

    const slots = ["❤", "💜", "🖤", "🤍", "🤎", "💙", "💚", "💛"];
    let slot1, slot2, slot3, winnings;

    const probability = Math.random();
    if (probability < 0.3) { // ৩০% জয় সম্ভাবনা
      slot1 = slot2 = slot3 = slots[Math.floor(Math.random() * slots.length)];
      winnings = amount * 2;
    } else {
      slot1 = slots[Math.floor(Math.random() * slots.length)];
      slot2 = slots[Math.floor(Math.random() * slots.length)];
      slot3 = slots[Math.floor(Math.random() * slots.length)];
      winnings = -amount;
    }

    await usersData.set(senderID, { money: userData.money + winnings, data: userData.data });
    const messageText = getSpinResultMessage(slot1, slot2, slot3, winnings, getLang);
    return message.reply(`${getLang("spin_count")}\n${messageText}`);
  },
};

function getSpinResultMessage(slot1, slot2, slot3, winnings, getLang) {
  if (winnings > 0) {
    return getLang("win_message", formatMoney(winnings)) + `\n• 𝐆𝐚𝐦𝐞 𝐑𝐞𝐬𝐮𝐥𝐭𝐬 [ ${slot1} | ${slot2} | ${slot3} ]`;
  } else {
    return getLang("lose_message", formatMoney(-winnings)) + `\n• 𝐆𝐚𝐦𝐞 𝐑𝐞𝐬𝐮𝐥𝐭𝐬 [ ${slot1} | ${slot2} | ${slot3} ]`;
  }
}

function formatMoney(num) {
  const units = ["", "𝐊", "𝐌", "𝐁", "𝐓", "𝐐"];
  let unit = 0;
  while (num >= 1000 && unit < units.length - 1) {
    num /= 1000;
    unit++;
  }
  return Number(num.toFixed(1)) + units[unit];
}
