import TelegramBot from 'node-telegram-bot-api';

import dotenv from 'dotenv';
import { createAIReply } from './openai.js';
import { db } from './firebase.js';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
  deleteDoc,
} from 'firebase/firestore';
import { fetchBibleVerse } from './bible.js';
import cron from 'node-cron';

//TELEGRAM BOT
dotenv.config();
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg, match) => {
  if (msg.chat.type === 'group') {
    return;
  } else {
  }
  sendMessage(
    msg.chat.id,
    msg,
    `Hi ${msg.from.first_name} ${
      msg.from.last_name ? msg.from.last_name : ''
    }, nice to meet you :)
I am an AI, you can chat freely with me!
To motivate you, I will send you a random bible verse everyday.
But if you are in crisis right now, please call 1-767, the Samaritans of Singapore will help you 24/7.

Don't forget to be happy today :D
    `
  );
  const isExist = await checkExist(msg.chat.id);
  if (!isExist) {
    const docRef = await setDoc(
      doc(db, 'users', msg.chat.username),
      {
        chatId: msg.chat.id,
        first_name: msg.chat.first_name,
        last_name: msg.chat.last_name ? msg.chat.last_name : 'N/A',
        username: msg.chat.username,
        timestamp: msg.date,
      },
      { merge: true }
    );
  }
  const bibleVerse = await fetchBibleVerse();
  sendMessage(
    msg.chat.id,
    msg,
    `"${bibleVerse[0]}"

- ${bibleVerse[1]} ${bibleVerse[2]}:${bibleVerse[3]}`
  );
});

bot.onText(/\/stop/, async (msg, match) => {
  if (msg.chat.type === 'group') {
    return;
  }
  sendMessage(
    msg.chat.id,
    msg,
    `Hi ${msg.from.first_name} ${msg.from.last_name ? msg.from.last_name : ''}.
I hope my help was useful for you.
If you have any feedback for me, please say it to me.
Don't forget to be happy today :D
    `
  );
  const isExist = checkExist(msg.chat.id);
  if (isExist) {
    const docRef = await deleteDoc(doc(db, 'cities', msg.chat.id));
  }
});

bot.onText(/\/new/, async (msg, match) => {
  if (msg.chat.type === 'group') {
    return;
  }
  const bibleVerse = await fetchBibleVerse();
  sendMessage(
    msg.chat.id,
    msg,
    `"${bibleVerse[0]}"

- ${bibleVerse[1]} ${bibleVerse[2]}:${bibleVerse[3]}`
  );
});

bot.on('message', async (msg, match) => {
  if (msg.text[0] == '/') {
    return;
  }
  const AIReply = await createAIReply(msg.text);
  sendMessage(msg.chat.id, msg, AIReply);
});

const sendMessage = (chatId, msg, outgoing) => {
  bot.sendMessage(
    1707158311,
    `From: @${msg.from.username}, 
Incoming: "${msg.text}", 
Outgoing: "${outgoing}"`
  );
  bot.sendMessage(msg.chat.id, outgoing);
};

const sendBibleToAll = async (id) => {
  const data = await getDocs(collection(db, 'users'));
  const usersList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  const bibleVerse = await fetchBibleVerse();
  usersList.forEach((user) => {
    bot.sendMessage(
      user.chatId,
      `"${bibleVerse[0]}"

- ${bibleVerse[1]} ${bibleVerse[2]}:${bibleVerse[3]}`
    );
  });
};

//firebase
const checkExist = async (id) => {
  const data = await getDocs(collection(db, 'users'));
  const usersList = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
  let exist = false;
  usersList.forEach((user) => {
    if (user.chatId === id) {
      exist = true;
      return true;
    }
  });
  if (exist) {
    return true;
  }
  return false;
};

cron.schedule(
  '* * 9 * * *',
  async () => {
    await sendBibleToAll();
  },
  { timezone: 'Asia/Singapore' }
);
