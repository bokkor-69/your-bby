const axios = require('axios');
const cheerio = require('cheerio');
const shortener = require('isgd');  // URL shortener

const config = {
  name: "news",
  version: "1.7",
  author: "Bokkor",
  description: "Latest news with shortened link (Top 2)",
  category: "News",
  commandCategory: "Latest News",
  usePrefix: true,
  prefix: true,
  dependencies: {
    "axios": "",
    "cheerio": "",
    "isgd": "" // Added URL shortener
  },
};

const onStart = async ({ message, event, args, commandName }) => {
  const input = args.join(' ') || "latest";
  await fetchNews({ message, event, input, commandName });
};

async function fetchNews({ message, event, input, commandName }) {
  try {
    const { data } = await axios.get(
      `https://api.zetsu.xyz/api/gnews?query=${encodeURIComponent(input)}`
    );

    if (!data.status || !data.data.length) {
      return message.reply("❌ কোনো খবর পাওয়া যায়নি!");
    }

    let newsList = "";

    for (let i = 0; i < Math.min(2, data.data.length); i++) {
      const news = data.data[i];
      const newsText = await getNewsText(news.link);
      const shortenedLink = await shortenLink(news.link); // Shortening the link

      newsList += `📢 *${news.title || "শিরোনাম পাওয়া যায়নি"}*\n`;
      newsList += `⏳ *সময়:* ${news.time || "N/A"}\n`;
      newsList += `✍ *লেখক:* ${news.author || "Unknown"}\n`;
      newsList += `📝 *সংবাদ:* ${newsText}\n`;
      newsList += `🔗 *লিংক:* ${shortenedLink}\n\n`;
    }

    message.reply(newsList.trim());
  } catch (e) {
    message.reply(`❌ Error: ${e.message}`);
  }
}

async function getNewsText(url) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    let paragraphs = [];
    $("p").each((index, element) => {
      let text = $(element).text().trim();
      if (text.length > 50) { // Filter out small irrelevant texts
        paragraphs.push(text);
      }
    });

    return paragraphs.slice(0, 3).join(" ") || "⚠️ সংবাদের বিস্তারিত পাওয়া যায়নি!";
  } catch (e) {
    return "⚠️ সংবাদের বিস্তারিত সংগ্রহ করা যায়নি!";
  }
}

async function shortenLink(url) {
  return new Promise((resolve, reject) => {
    shortener.shorten(url, (shortenedUrl) => {
      if (shortenedUrl) {
        resolve(shortenedUrl);
      } else {
        reject("Error shortening the URL");
      }
    });
  });
}

module.exports = {
  config,
  onStart,
  run: onStart,
};
