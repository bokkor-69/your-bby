const os = require('os');
const process = require('process');
const { formatDuration, intervalToDuration } = require('date-fns');

const botStartTime = Date.now();

module.exports = {
  config: {
    name: "upt",
    aliases: ["uptime", "up"], // পরিবর্তিত আলিয়াস
    author: "ＢＯＫＫＯＲ", // এখানে লেখার জন্য
    description: "Get system and bot uptime information",
    category: "utility",
    usages: "{pn}",
    usePrefix: true,
    role: 0,
  },
  onStart: async ({ api, message, usersData, threadsData }) => {
    const currentTime = Date.now();
    const botUptime = Math.floor((currentTime - botStartTime) / 1000);

    const formatUptime = (seconds) => {
      const uptime = formatDuration(intervalToDuration({ start: 0, end: seconds * 1000 }));
      return uptime;
    };

    const totalUsers = (await usersData.getAll()).length;
    const totalThreads = (await threadsData.getAll()).length;

    const uptimeMessage = `
╭───〔 ⏳ 𝐔𝐩𝐭𝐢𝐦𝐞 〕
├🟢 𝐒𝐭𝐚𝐭𝐮𝐬: 𝐎𝐧𝐥𝐢𝐧𝐞 ✅
├⏰ 𝐔𝐩𝐭𝐢𝐦𝐞: ${formatUptime(botUptime)}
├👥 𝐓𝐨𝐭𝐚𝐥 𝐔𝐬𝐞𝐫𝐬: ${totalUsers}
╰💬 𝐓𝐨𝐭𝐚𝐥 𝐓𝐡𝐫𝐞𝐚𝐝𝐬: ${totalThreads}

Author: ＢＯＫＫＯＲ`;

    await message.reply(uptimeMessage);
  }
};