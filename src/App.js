import React, { useEffect } from "react";
import Game from "./components/Game/game.js";

function App() {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready(); // Инициализация Telegram WebApp

    tg.MainButton.setParams({
      text: "End Game",
      color: "#ff5c5c",
    });

    tg.MainButton.onClick(() => {
      tg.close(); // Закрыть WebApp при нажатии кнопки
    });

    return () => {
      tg.MainButton.offClick(); // Убираем обработчик при размонтировании
    };
  }, []);

  const handleGameEnd = (timeSpent) => {
    console.log(`Game ended! Time spent: ${timeSpent} seconds`);
    const tg = window.Telegram.WebApp;

    tg.sendData(JSON.stringify({ timeSpent })); // Отправляем данные о времени в Telegram WebApp
  };

  return (
    <div>
      <header>
        <h1>Telegram Canvas Game</h1>
      </header>
      <main>
        <Game difficulty={1} onGameEnd={handleGameEnd} />
      </main>
    </div>
  );
}

export default App;
