const moment = require("moment-timezone");

module.exports = {
  config: {
    name: "mathgame",
    version: "1.3",
    author: "Bokkor",
    countdown: 5,
    role: 0,
    shortDescription: "A simple math game with rewards and limits!",
    longDescription: "Solve a math problem to earn coins and EXP. Play limit of 15 times per day.",
    category: "games",
    guide: "{prefix}mathgame",
  },

  onStart: async function ({ api, event, usersData }) {
    const { threadID, messageID, senderID } = event;

    // ইউজারের নাম বের করা
    const userInfo = await api.getUserInfo(senderID);
    const userName = userInfo[senderID].name || "Player";

    // গেম খেলার হিসাব রাখা
    const currentDate = moment().format("YYYY-MM-DD");
    const gameData = await usersData.get(senderID, "gameData") || { count: 0, lastPlayed: "" };

    // চেক করা হচ্ছে, আজকের গেম খেলার সীমা পার হয়েছে কিনা
    if (gameData.lastPlayed === currentDate && gameData.count >= 15) {
      const lastPlayedTime = moment(gameData.lastPlayed);
      const remainingTime = moment.duration(lastPlayedTime.add(10, 'hours').diff(moment()));

      const hoursLeft = remainingTime.hours();
      const minutesLeft = remainingTime.minutes();

      return api.sendMessage(`❌ You have reached your limit for today! Try again in ${hoursLeft} hour(s) and ${minutesLeft} minute(s).`, threadID, messageID);
    }

    // ম্যাথ প্রশ্ন তৈরি করা (কঠিন)
    const num1 = Math.floor(Math.random() * 70) + 1; // বড় সংখ্যা
    const num2 = Math.floor(Math.random() * 70) + 1; // বড় সংখ্যা
    const operators = ["+", "-", "*", "/"];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let answer;
    switch (operator) {
      case "+":
        answer = num1 + num2;
        break;
      case "-":
        answer = num1 - num2;
        break;
      case "*":
        answer = num1 * num2;
        break;
      case "/":
        // ভাগের জন্য দুইটি দশমিক স্থান রাখবো
        answer = (num1 / num2).toFixed(2); 
        break;
    }

    // প্রশ্ন পাঠানো
    const mathQuestion = `╭‣ *${userName}* 🎀\n╰‣ Solve this: *${num1} ${operator} ${num2} = ?*`;
    api.sendMessage(mathQuestion, threadID, (err, info) => {
      global.GoatBot.onReply.set(info.messageID, {
        commandName: "mathgame",
        author: senderID,
        correctAnswer: answer,
        messageID: info.messageID, // প্রশ্নের মেসেজ আইডি সংরক্ষণ
      });
    }, messageID);

    // গেম খেলার ডাটা আপডেট
    if (gameData.lastPlayed !== currentDate) {
      gameData.count = 0; // নতুন দিনে গেম খেলার কাউন্ট ০
    }

    gameData.count += 1;
    gameData.lastPlayed = currentDate;
    await usersData.set(senderID, { gameData });
  },

  onReply: async function ({ api, event, Reply, usersData }) {
    const { messageID, threadID, senderID, body } = event;
    const userReply = parseFloat(body); // এখন ভাসমান সংখ্যা সাপোর্ট করবে

    if (isNaN(userReply)) return api.sendMessage("❌ Please enter a valid number!", threadID, messageID);

    if (!Reply || !Reply.correctAnswer) return api.sendMessage("⚠ The game has expired!", threadID, messageID);

    if (Reply.author !== senderID) {
      return api.sendMessage("❌ This is not your question to answer!", threadID, messageID);
    }

    // পুরাতন প্রশ্ন মেসেজ ডিলিট করা হবে
    api.unsendMessage(Reply.messageID);

    if (userReply === parseFloat(Reply.correctAnswer)) {
      // পুরষ্কার নির্ধারণ
      const rewardCoins = 1000;
      const rewardEXP = 25;

      // ব্যালেন্স এবং এক্সপি আপডেট করা হচ্ছে
      const userMoney = await usersData.get(senderID, "money") || 0;
      const userEXP = await usersData.get(senderID, "exp") || 0;

      await usersData.set(senderID, { money: userMoney + rewardCoins, exp: userEXP + rewardEXP });

      return api.sendMessage(`✅ | Correct answer baby!\nYou earned 💰 ${rewardCoins} coins & 🌟 ${rewardEXP} EXP.`, threadID, messageID);
    } else {
      // ভুল উত্তর দিলে শাস্তি
      const penaltyCoins = 500;
      const penaltyEXP = 50;

      const userMoney = await usersData.get(senderID, "money") || 0;
      const userEXP = await usersData.get(senderID, "exp") || 0;

      await usersData.set(senderID, { money: Math.max(0, userMoney - penaltyCoins), exp: Math.max(0, userEXP - penaltyEXP) });

      return api.sendMessage(`❌ | Wrong answer baby!\nYou lost 💰 ${penaltyCoins} coins & 🌟 ${penaltyEXP} EXP.\nThe correct answer was: ${Reply.correctAnswer}`, threadID, messageID);
    }
  }
};