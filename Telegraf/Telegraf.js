const { Telegraf } = require("telegraf");
const bot = new Telegraf("YOUR_BOT_TOKEN");

// Обработка данных, отправленных из WebApp
bot.on("web_app_data", (ctx) => {
  const { timeSpent } = JSON.parse(ctx.webAppData.data);
  ctx.reply(`Вы потратили на игру ${timeSpent} секунд!`);
});

bot.launch();
