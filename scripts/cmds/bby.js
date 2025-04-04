const axios = require('axios');

const baseApiUrl = async () => {
  const base = 'https://www.noobs-api.rf.gd/dipto';
  return base;
};

const prefixes = [
  "bby", "janu", "বাবু", "babu", "bbu", "botli", "bot", "baby", "বেবি", "জানু", "বট", "طفل", "بوت", "babe"
];

module.exports = {
  config: {
    name: "bot",
    version: "1.6.9",
    author: "dipto",
    role: 0,
    description: {
      en: "no prefix command.",
    },
    category: "ai",
    guide: {
      en: "just type bby",
    },
  },
  onStart: async function () {},
  
  removePrefix: function (str, prefixes) {
    for (const prefix of prefixes) {
      if (str.startsWith(prefix)) {
        return str.slice(prefix.length).trim();
      }
    }
    return str;
  },

  onReply: async function ({ api, event }) {
    if (event.type == "message_reply") {
      let reply = event.body.toLowerCase();
      reply = this.removePrefix(reply, prefixes) || "bby";

      if (reply) {
        try {
          const response = await axios.get(
            `${await baseApiUrl()}/baby?text=${encodeURIComponent(reply)}&senderID=${event.senderID}&font=1`
          );
          const message = response.data.reply;
          
          if (response.data.react) {
            setTimeout(() => {
              api.setMessageReaction(
                response.data.react,
                event.messageID,
                (err) => {},
                true
              );
            }, 400);
          }
          
          await api.sendMessage(
            message,
            event.threadID,
            (err, info) => {
              global.GoatBot.onReply.set(info.messageID, {
                commandName: "bot",
                type: "reply",
                messageID: info.messageID,
                author: event.senderID,
                text: message,
              });
            },
            event.messageID
          );
        } catch (err) {
          console.log(err.message);
          api.sendMessage("🥹🥹error", event.threadID, event.messageID);
        }
      }
    }
  },

  onChat: async function ({ api, event }) {
    const tl = [
      "babu khuda lagse🥺", "Hop beda😾,Boss বল boss😼", "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘", "🐒🐒🐒",
      "bye", "naw message daw m.me/ewr.bokkor", "mb ney bye", "meww", "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
      "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝘂__😘😘", "𝗜 𝗵𝗮𝘁𝗲 𝘆𝗼𝘂__😏😏", "গোসল করে আসো যাও😑😩", "অ্যাসলামওয়ালিকুম", "কেমন আসো",
      "বলেন sir__😌", "বলেন ম্যাডাম__😌", "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে", "🙂🙂🙂", "এটায় দেখার বাকি সিলো_🙂🙂🙂",
      "𝗕𝗯𝘆 𝗯𝗼𝗹𝗹𝗮 𝗽𝗮𝗽 𝗵𝗼𝗶𝗯𝗼,,😒😒", "𝗧𝗮𝗿𝗽𝗼𝗿 𝗯𝗼𝗹𝗼_🙂", "𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 𝘁𝗼__🥺",
      "𝗕𝗯𝘆 না জানু, বল 😌", "বেশি bby Bbby করলে leave নিবো কিন্তু 😒😒", "__বেশি বেবি বললে কামুর দিমু 🤭🤭", 
      "𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂😂😂", "bolo baby😒", "তোর কথা তোর বাড়ি কেউ শুনে না ,তো আমি কোনো শুনবো ?🤔😂",
      "আমি তো অন্ধ কিছু দেখি না🐸 😎", "আম গাছে আম নাই ঢিল কেন মারো, তোমার সাথে প্রেম নাই বেবি কেন ডাকো 😒🫣", "𝗼𝗶𝗶 ঘুমানোর আগে.! তোমার মনটা কথায় রেখে ঘুমাও.!🤔_নাহ মানে চুরি করতাম 😞😘",
      "𝗕𝗯𝘆 না বলে 𝗕𝗼𝘄 বলো 😘", "দূরে যা, তোর কোনো কাজ নাই, শুধু 𝗯𝗯𝘆 𝗯𝗯𝘆 করিস  😉😋🤣", "এই এই তোর পরীক্ষা কবে? শুধু 𝗕𝗯𝘆 𝗯𝗯𝘆 করিস 😾", 
      "তোরা যে হারে 𝗕𝗯𝘆 ডাকছিস আমি তো সত্যি বাচ্চা হয়ে যাবো_☹😑", "আজব তো__😒", "আমাকে ডেকো না,আমি ব্যাস্ত আসি🙆🏻‍♀️", "𝗕𝗯𝘆 বললে চাকরি থাকবে না", 
      "𝗕𝗯𝘆 𝗕𝗯𝘆 না করে আমার বস মানে,bokkor, bokkor ও তো করতে পারো😑?", "আমার সোনার বাংলা, তারপরে লাইন কি? 🙈", "🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲",
      "হটাৎ আমাকে মনে পড়লো 🙄", "𝗕𝗯𝘆 বলে অসম্মান করচ্ছিছ,😰😿", "আমি তোমার সিনিয়র আপু ওকে 😼সম্মান দেও🙁", "খাওয়া দাওয়া করসো 🙄", 
      "এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈", "আরে আমি মজা করার mood এ নাই😒", "𝗛𝗲𝘆 𝗛𝗮𝗻𝗱𝘀𝗼𝗺𝗲 বলো 😁😁", "আরে Bolo আমার জান, কেমন আসো? 😚",
      "একটা BF খুঁজে দাও 😿", "ফ্রেন্ড রিকোয়েস্ট দিলে ৫ টাকা দিবো 😗", "oi mama ar dakis na pilis 😿", "🐤🐤", "__ভালো হয়ে  যাও 😑😒",
      "এমবি কিনে দাও না_🥺🥺", "ওই মামা_আর ডাকিস না প্লিজ", "৩২ তারিখ আমার বিয়ে 🐤", "হা বলো😒,কি করতে পারি😐😑?", "বলো ফুলটুশি_😘",
      "amr JaNu lagbe,Tumi ki single aso?", "আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺", "তোর বিয়ে হয় নি 𝗕𝗯𝘆 হইলো কিভাবে,,🙄", 
      "আজ একটা ফোন নাই বলে রিপ্লাই দিতে পারলাম না_🙄", "চৌধুরী সাহেব আমি গরিব হতে পারি😾🤭 -কিন্তু বড়লোক না🥹 😫", "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে",
      "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏", "ভুলে জাও আমাকে 😞😞", "দেখা হলে কাঠগোলাপ দিও..🤗", "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺",
      "আগে একটা গান বলো, ☹ নাহলে কথা বলবো না 🥺", "বলো কি করতে পারি তোমার জন্য 😚", "কথা দেও আমাকে পটাবা...!! 😌", 
      "বার বার Disturb করেছিস কোনো 😾, আমার জানু এর সাথে ব্যাস্ত আসি 😋", "আমাকে না দেকে একটু পড়তে বসতেও তো পারো 🥺🥺", 
      "বার বার ডাকলে মাথা গরম হয় কিন্তু 😑😒", "ওই তুমি single না?🫵🤨 😑😒", "বলো জানু 😒", "Meow🐤", "আর কত বার ডাকবা ,শুনছি তো 🤷🏻‍♀️", 
      "কি হলো, মিস টিস করচ্ছো নাকি 🤣", "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈", "আজকে আমার মন ভালো নেই 🙉"
    ];

    const rand = tl[Math.floor(Math.random() * tl.length)];

    let dipto = event.body ? event.body.toLowerCase() : "";
    const words = dipto.split(" ");
    const count = words.length;

    if (event.type !== "message_reply") {
      let messageToSend = dipto;
      messageToSend = this.removePrefix(messageToSend, prefixes);

      if (prefixes.some((prefix) => dipto.startsWith(prefix))) {
        setTimeout(function () {
          api.setMessageReaction("😍", event.messageID, (err) => {}, true);
        }, 400);
        api.sendTypingIndicator(event.threadID, true);

        if (event.senderID == api.getCurrentUserID()) return;

        var msg = {
          body: rand,
        };
        if (count === 1) {
          setTimeout(function () {
            return api.sendMessage(
              msg,
              event.threadID,
              (err, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                  commandName: "bot",
                  type: "reply",
                  messageID: info.messageID,
                  author: event.senderID,
                  link: msg,
                });
              },
              event.messageID
            );
          }, 400);
        } else {
          words.shift();
          const oop = words.join(" ");
          try {
            const response = await axios.get(`${await baseApiUrl()}/baby?text=${encodeURIComponent(oop)}&senderID=${event.senderID}&font=1`);
            const mg = response.data.reply;
            if (response.data.react) {
              setTimeout(function () {
                api.setMessageReaction(
                  response.data.react,
                  event.messageID,
                  (err) => {},
                  true
                );
              }, 500);
            }
            await api.sendMessage(
              { body: mg },
              event.threadID,
              (error, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                  commandName: this.config.name,
                  type: "reply",
                  messageID: info.messageID,
                  author: event.senderID,
                  link: mg,
                });
              },
              event.messageID
            );
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
  },
};
