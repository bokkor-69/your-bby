const axios = require('axios');  // axios মডিউল ইনপোর্ট

module.exports.config = {
  name: "wiki",
  aliases: [],
  version: "1.0.0",
  role: 0,
  author: "dipto",
  description: "Fetches information from the given query",
  usePrefix: true,
  guide: "[search query]",
  category: "Ai",
  countDown: 5,
};

module.exports.onStart = async function ({ api, args, event }) {
  try {
    const author = event.senderID;  // লেখক/ব্যবহারকারীর ID
    const searchQuery = args.join(" ").toLowerCase();  // অনুসন্ধান কোয়েরি নিচ্ছে

    if (!args[0]) {
      // যদি কোনো অনুসন্ধান কোয়েরি না থাকে, তবে ব্যবহারকারীকে গাইড করবে
      return api.sendMessage(
        "Please provide a search query to get information.\n\nExample:\n!rubish naruto",
        event.threadID,
        event.messageID
      );
    }

    if (searchQuery) {
      // যদি অনুসন্ধান কোয়েরি থাকে, তবে API কল করবে
      const response = await axios.get(`https://rubish-apihub.onrender.com/rubish//wiki?search=${encodeURIComponent(searchQuery)}&apikey=rubish69`);
      
      // রেসপন্স থেকে প্রয়োজনীয় ডেটা নেয়
      const results = response.data.results;

      if (results.length === 0) {
        return api.sendMessage(
          "No results found for your search.",
          event.threadID,
          event.messageID
        );
      }

      // ফলাফল পাঠানো হচ্ছে
      let message = "Here are some results:\n\n";
      results.forEach((result, index) => {
        message += `${index + 1}. **${result.title}**\n${result.intro}\n\n`;
      });

      await api.sendMessage(message, event.threadID, event.messageID);
    }
  } catch (error) {
    // কোনো সমস্যা হলে তা কনসোলে দেখানো হচ্ছে এবং ব্যবহারকারীকে জানানো হচ্ছে
    console.log(`Failed to get information: ${error.message}`);
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};
