const fs = require('fs');
const axios = require('axios');

// Function to load quiz data from quiz.json file
const loadQuizData = () => {
  try {
    const data = fs.readFileSync('./quiz.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading quiz data", err);
    return [];
  }
};

// Function to save quiz data into quiz.json file
const saveQuizData = (data) => {
  fs.writeFileSync('./quiz.json', JSON.stringify(data, null, 2));
};

module.exports = {
  config: {
    name: "quiz",
    aliases: ["qz"],
    version: "1.0",
    author: "Dipto",
    countDown: 0,
    role: 0,
    category: "game",
    guide: "{p}quiz2 \n{pn}quiz2 bn \n{p}quiz2 en",
  },

  onStart: async function ({ api, event, usersData, args }) {
    const input = args.join('').toLowerCase() || "bn";
    let timeout = 300;
    let category = "bangla";
    if (input === "bn" || input === "bangla") {
      category = "bangla";
    } else if (input === "en" || input === "english") {
      category = "english";
    }

    try {
      const response = await axios.get(
        `https://api.example.com/quiz?category=${category}`,
      );

      const quizData = response.data; // Assuming you get the quiz data here
      const { question, correctAnswer, options } = quizData;
      const { a, b, c, d } = options;
      const namePlayerReact = await usersData.getName(event.senderID);

      // Save the new quiz to the quiz.json file
      const allQuizzes = loadQuizData();
      allQuizzes.push({
        question,
        correctAnswer,
        options,
        category,
      });
      saveQuizData(allQuizzes);

      const quizMsg = {
        body: `\n╭──✦ ${question}\n├‣ 𝗔) ${a}\n├‣ 𝗕) ${b}\n├‣ 𝗖) ${c}\n├‣ 𝗗) ${d}\n╰──────────────────‣\n𝚁𝚎𝚙𝚕𝚢 𝚝𝚘 𝚝𝚑𝚒𝚜 𝚖𝚎𝚜𝚜𝚊𝚐𝚎 𝚠𝚒𝚝𝚑 𝚢𝚘𝚞𝚛 𝚊𝚗𝚜𝚠𝚎𝚛.`,
      };

      api.sendMessage(
        quizMsg,
        event.threadID,
        (error, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            type: "reply",
            commandName: this.config.name,
            author: event.senderID,
            messageID: info.messageID,
            dataGame: quizData,
            correctAnswer,
            nameUser: namePlayerReact,
            attempts: 0
          });
          setTimeout(() => {
            api.unsendMessage(info.messageID);
          }, timeout * 1000);
        },
        event.messageID,
      );
    } catch (error) {
      console.error("❌ | Error occurred:", error);
      api.sendMessage(error.message, event.threadID, event.messageID);
    }
  },

  onReply: async ({ event, api, Reply, usersData }) => {
    const { correctAnswer, nameUser, author } = Reply;
    if (event.senderID !== author)
      return api.sendMessage(
        "Who are you bby🐸🦎",
        event.threadID,
        event.messageID
      );
    const maxAttempts = 2;

    switch (Reply.type) {
      case "reply": {
        let userReply = event.body.toLowerCase();
        if (Reply.attempts >= maxAttempts) {
          await api.unsendMessage(Reply.messageID);
          const incorrectMsg = `🚫 | ${nameUser}, you have reached the maximum number of attempts (2).\nThe correct answer is: ${correctAnswer}`;
          return api.sendMessage(incorrectMsg, event.threadID, event.messageID);
        }
        if (userReply === correctAnswer.toLowerCase()) {
          api.unsendMessage(Reply.messageID)
            .catch(console.error);
          let rewardCoins = 500;
          let rewardExp = 121;
          let userData = await usersData.get(author);
          await usersData.set(author, {
            money: userData.money + rewardCoins,
            exp: userData.exp + rewardExp,
            data: userData.data,
          });
          let correctMsg = `✅ | Correct answer baby\nYou earned ${rewardCoins} coins 💰 & ${rewardExp} exp 🌟`;
          api.sendMessage(correctMsg, event.threadID, event.messageID);
        } else {
          Reply.attempts += 1;
          global.GoatBot.onReply.set(Reply.messageID, Reply);
          api.sendMessage(
            `❌ | Wrong answer baby\nYou have ${maxAttempts - Reply.attempts} attempts left.\nTry Again!`,
            event.threadID,
            event.messageID,
          );
        }
        break;
      }
      default:
        break;
    }
  },

  addQuiz: async function({ args, api, event }) {
    const [question, correctAnswer, ...options] = args;
    const category = "bangla"; // or dynamic category as needed

    const newQuiz = {
      question,
      correctAnswer,
      options: {
        a: options[0],
        b: options[1],
        c: options[2],
        d: options[3],
      },
      category,
    };

    const allQuizzes = loadQuizData();
    allQuizzes.push(newQuiz);
    saveQuizData(allQuizzes);

    api.sendMessage("New quiz added successfully!", event.threadID);
  },
};
