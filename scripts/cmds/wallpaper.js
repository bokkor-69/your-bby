const axios = require('axios');

const config = {
  name: "wallpaper",
  version: "1.0",
  author: "Bokkor",
  description: "Search and get wallpapers based on a given query",
  category: "Images",
  commandCategory: "Wallpapers",
  usePrefix: true,
  prefix: true,
  dependencies: {
    "axios": "",
  },
};

const onStart = async ({ message, event, args, commandName }) => {
  const input = args.join(' ') || "naruto"; // Default query "naruto"
  await fetchWallpaper({ message, event, input, commandName });
};

async function fetchWallpaper({ message, event, input, commandName }) {
  try {
    const { data } = await axios.get(
      `https://api.zetsu.xyz/api/wallpaper?q=${encodeURIComponent(input)}`
    );

    if (!data.result || !data.result.length) {
      return message.reply("❌ No wallpapers found!");
    }

    const wallpaper = data.result[0]; // Selecting the first wallpaper

    let responseMessage = "🖼 **Wallpaper Details:**\n\n";
    responseMessage += `📌 **Type:** ${wallpaper.type || "Unknown"}\n`;
    responseMessage += `🖼 **Wallpaper:**\n${wallpaper.image || "N/A"}\n`;

    message.reply({
      body: responseMessage,
      attachment: await axios.get(wallpaper.image, { responseType: 'stream' }).then(res => res.data)
    });

  } catch (e) {
    message.reply(`❌ Error: ${e.message}`);
  }
}

module.exports = {
  config,
  onStart,
  run: onStart,
};