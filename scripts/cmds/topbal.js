module.exports = {
    config: {
      name: "top",
      version: "1.0",
      author: "Bokkor",
      role: 0,
      shortDescription: {
        en: "Top 15 Rich Users"
      },
      longDescription: {
        en: "Shows the top 15 richest users in a formatted way."
      },
      category: "group",
      guide: {
        en: "{pn}"
      }
    },
    onStart: async function ({ api, args, message, event, usersData }) {
      function formatNumber(num) {
        if (num >= 1e15) return (num / 1e15).toFixed(2) + "Q$";
        if (num >= 1e12) return (num / 1e12).toFixed(2) + "T$";
        if (num >= 1e9) return (num / 1e9).toFixed(2) + "B$";
        if (num >= 1e6) return (num / 1e6).toFixed(2) + "M$";
        if (num >= 1e3) return (num / 1e3).toFixed(2) + "K$";
        return num + "$";
      }
  
      const allUsers = await usersData.getAll();
      const topUsers = allUsers.sort((a, b) => b.money - a.money).slice(0, 15);
  
      const topUsersList = topUsers.map((user, index) => 
        ` ${index + 1}.  ${user.name} \n     ➥ ${formatNumber(user.money)}\n`
      );
  
      const messageText = `👑 | 𝐓𝐨𝐩 𝟏𝟓 𝐑𝐢𝐜𝐡𝐞𝐬𝐭 𝐔𝐬𝐞𝐫𝐬:\n\n${topUsersList.join('\n')}`;
  
      message.reply(messageText);
    }
  };
  