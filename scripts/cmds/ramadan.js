const axios = require('axios');
const moment = require('moment-timezone');

module.exports = {
    config: {
        name: "ramadan",
        aliases: ["ifter", "iftar", "sahri", "sehri", "seheri"],
        version: "1.0",
        author: "RUBISH",
        countDown: 5,
        role: 0,
        description: {
            vi: "Lấy thời gian Iftar cho một thành phố",
            en: "Get detailed Iftar time for a city."
        },
        category: "Tools",
        guide: {
            vi: "{pn} <tên thành phố>",
            en: "{pn} <cityName> - <color>"
        }
    },

    onStart: async function ({ message, api, args, event }) {
        let [cityName, color] = args.join(' ').trim().split(/\s*-\s*/);
      
        if(!cityName){
          message.reply("❎ | Please enter a cityName or use help to see usage.");
        }
        try {
            const response = await axios.get(`${global.GoatBot.config.API.DIPTO}/iftar?name=${encodeURIComponent(cityName)}&color=${color || 'white'}`);
            const iftarInfo = response.data;

            if (!iftarInfo) {
                return api.sendMessage("❎ | Iftar time not found or invalid response.", event.threadID);
            }

            const currentDate = moment().tz('Asia/Dhaka');

            const nextIftarTime = moment.tz(`${currentDate.format('YYYY-MM-DD')} ${iftarInfo.iftar_time}`, 'YYYY-MM-DD hh:mm A', 'Asia/Dhaka');
            if (nextIftarTime.isBefore(currentDate)) {
                nextIftarTime.add(1, 'day');
            }
            const iftarTimeRemaining = nextIftarTime.diff(currentDate, 'minutes');
            const iftarRemainingHours = Math.floor(Math.abs(iftarTimeRemaining) / 60);
            const iftarRemainingMinutes = Math.abs(iftarTimeRemaining) % 60;
            const iftarRemainingFormatted = `${iftarTimeRemaining < 0 ? '-' : ''}${iftarRemainingHours} hours ${iftarRemainingMinutes} min`;

            const nextSahriTime = moment.tz(`${currentDate.format('YYYY-MM-DD')} ${iftarInfo.sher_itime}`, 'YYYY-MM-DD hh:mm A', 'Asia/Dhaka');
            if (nextSahriTime.isBefore(currentDate)) {
                nextSahriTime.add(1, 'day');
            }
            const sahriTimeRemaining = nextSahriTime.diff(currentDate, 'minutes');
            const sahriRemainingHours = Math.floor(Math.abs(sahriTimeRemaining) / 60);
            const sahriRemainingMinutes = Math.abs(sahriTimeRemaining) % 60;
            const sahriRemainingFormatted = `${sahriTimeRemaining < 0 ? '-' : ''}${sahriRemainingHours} hours ${sahriRemainingMinutes} min`;

            const formattedResponse = `
‡   𝙸𝙵𝚃𝙰𝚁 𝙰𝙽𝙳 𝚂𝙴𝙷𝚁𝙸 𝚃𝙸𝙼𝙴   ‡
﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
◈ 𝙲𝚒𝚝𝚢: ${iftarInfo.city}
◈ 𝙳𝚊𝚝𝚎: ${moment(currentDate).tz('Asia/Dhaka').format('D MMMM YYYY')} 
◈ 𝙳𝚊𝚢: ${moment(currentDate).tz('Asia/Dhaka').format('dddd')}
﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
▣ 𝚁𝚊𝚖𝚊𝚍𝚊𝚗: ${iftarInfo.ramadan}
▣ 𝙸𝚏𝚝𝚊𝚛 𝚃𝚒𝚖𝚎: ${iftarInfo.iftar_time}
▣ 𝚂𝚎𝚑𝚛𝚒 𝚃𝚒𝚖𝚎: ${iftarInfo.sher_itime}
﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
▣ 𝙸𝚏𝚝𝚊𝚛 𝚁𝚎𝚖𝚊𝚒𝚗𝚒𝚗𝚐: ${iftarRemainingFormatted}
▣ 𝚂𝚎𝚑𝚛𝚒 𝚁𝚎𝚖𝚊𝚒𝚗𝚒𝚗𝚐: ${sahriRemainingFormatted}
﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
▣ 𝙵𝚊𝚓𝚛 𝚃𝚒𝚖𝚎: ${iftarInfo.fazar_time}
▣ 𝚂𝚞𝚗𝚜𝚎𝚝 𝚃𝚒𝚖𝚎: ${iftarInfo.sunset}
▣ 𝙳𝚑𝚞𝚑𝚛 𝚃𝚒𝚖𝚎: ${iftarInfo.oju_time_sokal}
▣ 𝙰𝚜𝚛 𝚃𝚒𝚖𝚎: ${iftarInfo.oju_time_bikal}
▣ 𝙼𝚊𝚐𝚑𝚛𝚒𝚋 𝚃𝚒𝚖𝚎: ${iftarInfo.iftar_time}
▣ 𝙸𝚜𝚑𝚊: ${iftarInfo.oju_time_sondha}
﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏
◈ 𝙲𝚞𝚛𝚛𝚎𝚗𝚝 𝚃𝚒𝚖𝚎 - ${moment(currentDate).tz('Asia/Dhaka').format('hh:mm A')}
    ≔  𝐀𝐬𝐬𝐚𝐥𝐚𝐦𝐮 𝐀𝐥𝐚𝐢𝐤𝐮𝐦  ≕
﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏﹏`;

            await api.sendMessage({
                body: formattedResponse,
                attachment: await global.utils.getStreamFromURL(iftarInfo.url)
            }, event.threadID);
        } catch (error) {
            console.error('❎ | Error fetching iftar data:', error);
            api.sendMessage("❎ | An error occurred while processing the request.", event.threadID);
        }
    }
};