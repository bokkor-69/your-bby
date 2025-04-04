const axios = require('axios');

const config = {
  name: "songlyrics",
  version: "1.0",
  author: "Bokkor",
  description: "Search song lyrics based on given text",
  category: "Music",
  commandCategory: "Lyrics",
  usePrefix: true,
  prefix: true,
  dependencies: {
    "axios": "",
  },
};

const onStart = async ({ message, event, args, commandName }) => {
  const input = args.join(' ') || "aadat";  // Default query "aadat"
  await fetchSongLyrics({ message, event, input, commandName });
};

async function fetchSongLyrics({ message, event, input, commandName }) {
  try {
    const { data } = await axios.get(
      `https://api.zetsu.xyz/api/findsong?lyrics=${encodeURIComponent(input)}`
    );

    if (!data.result || !data.result.status) {
      return message.reply("❌ কোনো গান পাওয়া যায়নি!");
    }

    const song = data.result;

    let lyricsDetails = "🎶 **গানের বিস্তারিত:**\n\n";
    lyricsDetails += `🎤 **গান নাম:** ${song.title || "N/A"}\n`;
    lyricsDetails += `💿 **এলবাম:** ${song.album || "N/A"}\n`;
    lyricsDetails += `🖼️ **এলবাম থাম্বনেইল:** ![image](${song.thumb || "N/A"})\n`;
    lyricsDetails += `📜 **গানের লিরিক্স:**\n${song.lyrics || "N/A"}\n\n`;

    message.reply(lyricsDetails);
  } catch (e) {
    message.reply(`❌ Error: ${e.message}`);
  }
}

module.exports = {
  config,
  onStart,
  run: onStart,
};