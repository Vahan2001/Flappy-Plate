import React, { useEffect } from "react";
import Game from "./components/Game/game";

function App() {
  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();

    tg.MainButton.setParams({
      text: "End Game",
      color: "#ff5c5c",
    });

    tg.MainButton.onClick(() => {
      tg.close();
    });

    return () => {
      tg.MainButton.offClick();
    };
  }, []);

  const handleGameEnd = (timeSpent) => {
    console.log(`Game ended! Time spent: ${timeSpent} seconds`);
    const tg = window.Telegram.WebApp;

    tg.sendData(JSON.stringify({ timeSpent }));
  };

  return (
    <div>
      <main>
        <Game difficulty={1} onGameEnd={handleGameEnd} />
      </main>
    </div>
  );
}

export default App;
