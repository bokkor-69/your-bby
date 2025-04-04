const axios = require('axios');  // axios মডিউল ইনপোর্ট

module.exports.config = {
  name: "gpt2",
  aliases: [],
  version: "1.0.0",
  role: 0,
  author: "Bokkor",
  description: "Gpt4 ai with multiple conversation",
  usePrefix: true,
  guide: "[message]",
  category: "AI",
  countDown: 5,
};

module.exports.onStart = async function ({ api, args, event }) {
  try {
    const author = event.senderID;  // লেখক/ব্যবহারকারীর ID
    const dipto = args.join(" ").toLowerCase();  // প্রশ্নটি নিচ্ছে

    if (!args[0]) {
      // যদি কোনো প্রশ্ন না থাকে, তবে ব্যবহারকারীকে গাইড করবে
      return api.sendMessage(
        "Please provide a question to answer\n\nExample:\n!gpt2 hey",
        event.threadID,
        event.messageID
      );
    }

    if (dipto) {
      // যদি প্রশ্ন থাকে, তবে API কল করবে
      const response = await axios.get(`https://gemini-api-v4.onrender.com/gemini?query=${encodeURIComponent(dipto)}&uid=${author}`);
      
      // রেসপন্স থেকে প্রয়োজনীয় ডেটা নেয়
      const mg = response.data.response;

      // রেসপন্স পাঠানো হচ্ছে
      await api.sendMessage({ body: mg }, event.threadID, (error, info) => {
        global.GoatBot.onReply.set(info.messageID, {
          commandName: this.config.name,
          type: 'reply',
          messageID: info.messageID,
          author,
          link: mg
        });
      }, event.messageID);
    }
  } catch (error) {
    // কোনো সমস্যা হলে তা কনসোলে দেখানো হচ্ছে এবং ব্যবহারকারীকে জানানো হচ্ছে
    console.log(`Failed to get an answer: ${error.message}`);
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};

module.exports.onReply = async function ({ api, event, Reply }) {
  const { author } = Reply;
  if (author != event.senderID) return;

  if (event.type == "message_reply") {
    const reply = event.body.toLowerCase();
    if (isNaN(reply)) {
      try {
        // রেসপন্সের জন্য API কল করা হচ্ছে
        const response = await axios.get(`https://gemini-api-v4.onrender.com/gemini?query=${encodeURIComponent(reply)}&uid=${author}`);
        const ok = response.data.response;

        // রেসপন্স পাঠানো হচ্ছে
        await api.sendMessage(ok, event.threadID, (errr, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName: this.config.name,
            type: 'reply',
            messageID: info.messageID,
            author: event.senderID,
            link: ok
          });
        }, event.messageID);
      } catch (err) {
        console.log(err.message);
        api.sendMessage(`Error: ${err.message}`);
      }
    }
  }
};