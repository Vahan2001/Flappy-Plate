const { Telegraf } = require("telegraf");

const token = "7884229685:AAEXyg07duhA7IA62_BAmOnziDq36w_5TZI";
const url = "https://flappy-plate.vercel.app/";

const bot = new Telegraf(token);

bot.start((ctx) => {
  ctx.reply("Добро пожаловать!", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Начать игру",
            url: url,
          },
        ],
      ],
    },
  });
});

bot.launch();
