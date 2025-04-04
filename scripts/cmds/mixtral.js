const axios = require('axios');  // axios মডিউল ইনপোর্ট

module.exports.config = {
  name: "gpt",
  aliases: [],
  version: "1.0.0",
  role: 0,
  author: "Bokkor",
  description: "Mixtral AI chat system",
  usePrefix: true,
  guide: "[message]",
  category: "AI",
  countDown: 5,
};

module.exports.onStart = async function ({ api, args, event }) {
  try {
    const author = event.senderID;  // ব্যবহারকারীর ID
    const userQuery = args.join(" ").toLowerCase();  // প্রশ্ন গ্রহণ করা হচ্ছে

    if (!args[0]) {
      // যদি প্রশ্ন না থাকে, তবে ব্যবহারকারীকে গাইড করবে
      return api.sendMessage(
        "Please provide a message to send\n\nExample:\n!mixtral Hello, how are you?",
        event.threadID,
        event.messageID
      );
    }

    if (userQuery) {
      // API-তে কল করা হচ্ছে
      const response = await axios.get(`https://api.zetsu.xyz/api/mixtral-8b?q=${encodeURIComponent(userQuery)}`);
      
      // API রেসপন্স থেকে ডাটা নেওয়া হচ্ছে
      const botReply = response.data.result;

      // রেসপন্স পাঠানো হচ্ছে
      await api.sendMessage({ body: botReply }, event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: 'reply',
          messageID: info.messageID,
          author,
          link: botReply
        });
      }, event.messageID);
    }
  } catch (error) {
    // কোনো সমস্যা হলে তা কনসোলে দেখানো হচ্ছে এবং ব্যবহারকারীকে জানানো হচ্ছে
    console.log(`Failed to get a response: ${error.message}`);
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};

module.exports.onReply = async function ({ api, event, Reply }) {
  const { author } = Reply;
  if (author != event.senderID) return;

  if (event.type == "message_reply") {
    const replyMessage = event.body.toLowerCase();
    if (isNaN(replyMessage)) {
      try {
        // রেসপন্সের জন্য API কল করা হচ্ছে
        const response = await axios.get(`https://api.zetsu.xyz/api/mixtral-8b?q=${encodeURIComponent(replyMessage)}`);
        const replyText = response.data.result;

        // রেসপন্স পাঠানো হচ্ছে
        await api.sendMessage(replyText, event.threadID, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: 'reply',
            messageID: info.messageID,
            author: event.senderID,
            link: replyText
          });
        }, event.messageID);
      } catch (err) {
        console.log(err.message);
        api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
      }
    }
  }
};