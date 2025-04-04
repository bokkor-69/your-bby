const axios = require('axios');

const config = {
  name: "playstore",
  version: "1.0",
  author: "Bokkor",
  description: "Search Play Store apps by query",
  category: "App Info",
  commandCategory: "Play Store",
  usePrefix: true,
  prefix: true,
  dependencies: {
    "axios": "",
  },
};

const onStart = async ({ message, event, args, commandName }) => {
  const input = args.join(' ') || "facebook";  // Default query "facebook"
  await fetchPlaystoreApps({ message, event, input, commandName });
};

async function fetchPlaystoreApps({ message, event, input, commandName }) {
  try {
    const { data } = await axios.get(
      `https://api.zetsu.xyz/api/playstore?q=${encodeURIComponent(input)}`
    );

    if (!data.result || !data.result.length) {
      return message.reply("❌ কোনো অ্যাপ পাওয়া যায়নি!");
    }

    let appList = "📱 **Play Store Apps:**\n\n";
    data.result.slice(0, 2).forEach((app, index) => {
      appList += `🔹 **অ্যাপের নাম:** ${app.name || "N/A"}\n`;
      appList += `⭐ **রেটিং:** ${app.rate || "N/A"}\n`;
      appList += `👨‍💻 **ডেভেলপার:** ${app.developer || "Unknown"}\n`;
      appList += `🔗 **লিংক:** [পড়ুন](${app.link})\n`;
      appList += `🔸 **ডেভেলপার লিংক:** [${app.developer}](${app.developer_link})\n\n`;
      appList += `🖼️ **ইমেজ:** ![App Image](${app.image})\n\n`;
    });

    message.reply(appList);
  } catch (e) {
    message.reply(`❌ Error: ${e.message}`);
  }
}

module.exports = {
  config,
  onStart,
  run: onStart,
};