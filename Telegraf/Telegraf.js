const { Telegraf } = require("telegraf");
const token = "7884229685:AAEXyg07duhA7IA62_BAmOnziDq36w_5TZI"; // Замените на ваш токен
const url = "https://flappy-plate.vercel.app/"; // Ссылка на ваш WebApp

const bot = new Telegraf(token);

// Обработчик команды /start
bot.start((ctx) => {
  ctx.reply("Добро пожаловать!", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Начать игру",
            url: url, // Ссылка на ваш WebApp
          },
        ],
      ],
    },
  });
});

// Запускаем бот
bot.launch();
