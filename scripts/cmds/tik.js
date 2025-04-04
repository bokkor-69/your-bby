module.exports = {
	config: {
		name: "tik",
		version: "0.0.1",
		role: 0,
		countDown: 0,
		author: "Bokkor",
		shortDescription: "tiktok search videos",
		hasPrefix: false,
		category: "VIDEO",
		aliases: ["tiktoksearch"], // changed from "tik" to "tiktoksearch"
		usage: "[Tiktok <search>]",
		cooldown: 5,
	},

	onStart: async function({ api, event, args }) {
		try {
			// Set initial reaction
			api.setMessageReaction("⏳", event.messageID, (err) => {}, true);

			// Get the search query from arguments
			const searchQuery = args.join(" ");
			if (!searchQuery) {
				// If no search query is provided, notify user
				api.sendMessage("Usage: tiktok <search text>", event.threadID);
				return;
			}

			// Request to the provided API URL with the search query
			const response = await axios.get(`https://renzweb.onrender.com/api/tiktok?query=${encodeURIComponent(searchQuery)}`);
			const videoData = response.data;

			// If no video data found, notify user
			if (!videoData || !videoData.title) {
				api.sendMessage("No videos found for the given search query.", event.threadID);
				return;
			}

			// Prepare the message
			const message = `🎵 𝗧𝗜𝗞𝗧𝗢𝗞\n\n𝗍𝗂𝖽𝗅𝖾 ➪ ${videoData.title}\n𝗂𝗎𝗌𝗋𝗇𝗮𝗆𝗂 ➪ ${videoData.cover}\n`;

			// Set success reaction
			api.setMessageReaction("✅", event.messageID, () => {}, true);

			// Prepare video URL and file path
			const videoUrl = videoData.no_watermark || videoData.watermark;
			const filePath = path.join(__dirname, `/cache/tiktok_video.mp4`);
			const writer = fs.createWriteStream(filePath);

			// Request video stream and save to file
			const videoResponse = await axios({
				method: 'get',
				url: videoUrl,
				responseType: 'stream'
			});

			// Pipe video stream to file
			videoResponse.data.pipe(writer);

			// When writing is finished, send message with video attachment
			writer.on('finish', () => {
				api.sendMessage(
					{ body: message, attachment: fs.createReadStream(filePath) },
					event.threadID,
					() => fs.unlinkSync(filePath) // Delete the video file after sending
				);
			});
		} catch (error) {
			// Log error and notify user
			console.error('Error:', error);
			api.sendMessage("An error occurred while processing the request.", event.threadID);
		}
	}
};