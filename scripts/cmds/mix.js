const axios = require("axios");

module.exports = {
	config: {
		name: "mix",
		version: "1.3",
		author: "NTKhang",
		countDown: 5,
		role: 0,
		description: {
			en: "Mix 2 emoji together"
		},
		guide: {
			en: "   {pn} <emoji1> <emoji2>"
				+ "\n   Example:  {pn} 🤣 🥰"
		},
		category: "fun"
	},

	langs: {
		en: {
			error: "Sorry, emoji %1 and %2 can't mix",
			success: "Emoji %1 and %2 mix %3 images"
		}
	},

	onStart: async function ({ message, args, getLang }) {
		const readStream = [];
		const emoji1 = args[0];
		const emoji2 = args[1];

		if (!emoji1 || !emoji2)
			return message.SyntaxError();

		const generate1 = await generateEmojimix(emoji1, emoji2);

		if (generate1)
			readStream.push(generate1);

		if (readStream.length == 0)
			return message.reply(getLang("error", emoji1, emoji2));

		message.reply({
			body: getLang("success", emoji1, emoji2, readStream.length),
			attachment: readStream
		});
	}
};



async function generateEmojimix(emoji1, emoji2) {
	try {
		const { data: response } = await axios.get(`https://mostakim.onrender.com/emojimix?emoji1=${emoji1}&emoji2=${emoji2}`, {
						responseType: "stream"
		});
		response.path = `emojimix${Date.now()}.png`;
		return response;
	}
	catch (e) {
		return null;
	}
}