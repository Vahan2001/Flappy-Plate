import React, { useEffect, useRef, useState } from "react";
import plateImg from "../../assets/images/IMG_7145.PNG";
import buildingTop1 from "../../assets/images/top/IMG_7133.PNG";
import buildingTop2 from "../../assets/images/top/IMG_7134.PNG";
import buildingTop3 from "../../assets/images/top/IMG_7135.PNG";
import buildingTop4 from "../../assets/images/top/IMG_7138.PNG";
import buildingBottom1 from "../../assets/images/bottom/IMG_7139.PNG";
import buildingBottom2 from "../../assets/images/bottom/IMG_7140.PNG";
import buildingBottom3 from "../../assets/images/bottom/IMG_7142.PNG";
import buildingBottom4 from "../../assets/images/bottom/IMG_7147.PNG";
import buildingBottom5 from "../../assets/images/bottom/IMG_7148.PNG";
import buildingBottom6 from "../../assets/images/bottom/IMG_7149.PNG";
import buildingBottom7 from "../../assets/images/bottom/IMG_7150.PNG";
import buildingBottom8 from "../../assets/images/bottom/IMG_7151.PNG";
import topImage from "../../assets/images/IMG_7137.PNG";

const Game = () => {
  const marginTop = 45;
  const canvasRef = useRef(null);
  const plateImageRef = useRef(new Image());
  const topImageRef = useRef(new Image());

  const [buildings, setBuildings] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [countdown, setCountdown] = useState(3); // New countdown state

  const buildingWidth = 50;
  const gapHeight = 160;
  const gapWidth = 110;
  const speed = 2;
  const plateWidth = 40;
  const plateHeight = 20;
  const plateYRef = useRef(200);
  const plateVelocityRef = useRef(0);
  const gravity = 0.2;
  const lift = -5;
  const animationRef = useRef(null);

  // Загружаем изображения
  plateImageRef.current.src = plateImg;
  topImageRef.current.src = topImage;

  const buildingTopImages = [
    buildingTop1,
    buildingTop2,
    buildingTop3,
    buildingTop4,
  ].map((src) => {
    const img = new Image();
    img.src = src;
    return img;
  });

  const buildingBottomImages = [
    buildingBottom1,
    buildingBottom2,
    buildingBottom3,
    buildingBottom4,
    buildingBottom5,
    buildingBottom6,
    buildingBottom7,
    buildingBottom8,
  ].map((src) => {
    const img = new Image();
    img.src = src;
    return img;
  });

  const generateBuildings = (canvas) => {
    const newBuildings = [];
    const totalBuildings =
      Math.ceil(canvas.width / (buildingWidth + gapWidth)) + 1;

    const startX = canvas.width / 2;

    for (let i = 0; i < totalBuildings; i++) {
      const minBuildingHeight = 50;
      const maxTopHeight = canvas.height / 3;
      const topHeight =
        Math.random() * (maxTopHeight - minBuildingHeight) + minBuildingHeight;
      const bottomHeight = canvas.height - topHeight - gapHeight;

      if (bottomHeight < minBuildingHeight) {
        continue;
      }

      const xPosition = startX + i * (buildingWidth + gapWidth);

      const randomTopImage =
        buildingTopImages[Math.floor(Math.random() * buildingTopImages.length)];

      const randomBottomImage =
        buildingBottomImages[
          Math.floor(Math.random() * buildingBottomImages.length)
        ];

      newBuildings.push({
        x: xPosition,
        topHeight: topHeight,
        bottomHeight: bottomHeight,
        topImage: randomTopImage,
        bottomImage: randomBottomImage,
      });
    }
    return newBuildings;
  };

  useEffect(() => {
    if (!isGameStarted) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const newBuildings = generateBuildings(canvas);
    setBuildings(newBuildings);

    const drawBuildings = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      newBuildings.forEach((building) => {
        if (building.topImage.complete && building.bottomImage.complete) {
          ctx.drawImage(
            building.topImage,
            building.x,
            marginTop,
            buildingWidth,
            building.topHeight
          );

          ctx.drawImage(
            building.bottomImage,
            building.x,
            canvas.height - building.bottomHeight,
            buildingWidth,
            building.bottomHeight
          );
        }
      });
    };

    const drawPlate = () => {
      const plateX = 50;
      const plateY = plateYRef.current;

      ctx.save();
      ctx.translate(plateX + plateWidth / 2, plateY + plateHeight / 2);

      const angle = plateVelocityRef.current < 0 ? -15 : 15;
      ctx.rotate((angle * Math.PI) / 180);

      ctx.drawImage(
        plateImageRef.current,
        -plateWidth / 2,
        -plateHeight / 2,
        plateWidth,
        plateHeight
      );

      ctx.restore();
    };

    const drawTopImage = () => {
      ctx.drawImage(topImageRef.current, 0, 0, canvas.width, 50);
    };

    const checkCollision = () => {
      const plateX = 50;
      const plateY = plateYRef.current;
      const plateBottom = plateY + plateHeight;

      return newBuildings.some((building) => {
        const buildingTop = building.topHeight + marginTop;
        const buildingBottom = canvas.height - building.bottomHeight;

        const isInGap =
          plateBottom > buildingTop && plateY < buildingBottom - gapHeight;

        return (
          building.x < plateX + plateWidth &&
          building.x + buildingWidth > plateX &&
          (plateY < buildingTop || isInGap || plateBottom >= buildingBottom)
        );
      });
    };

    const updatePositions = () => {
      if (isGameOver || countdown > 0) return;

      newBuildings.forEach((building) => {
        building.x -= speed;
      });

      const firstBuilding = newBuildings[0];
      if (firstBuilding.x + buildingWidth < 0) {
        newBuildings.shift();
        const buildingHeight =
          Math.random() * (canvas.height - gapHeight * 2) + gapHeight;
        const lastBuilding = newBuildings[newBuildings.length - 1];
        const xPosition = lastBuilding.x + buildingWidth + gapWidth;

        const randomTopImage =
          buildingTopImages[
            Math.floor(Math.random() * buildingTopImages.length)
          ];

        const randomBottomImage =
          buildingBottomImages[
            Math.floor(Math.random() * buildingBottomImages.length)
          ];

        newBuildings.push({
          x: xPosition,
          topHeight: buildingHeight,
          bottomHeight: canvas.height - buildingHeight - gapHeight,
          topImage: randomTopImage,
          bottomImage: randomBottomImage,
        });

        setScore((prevScore) => prevScore + 1);
      }

      plateVelocityRef.current += gravity;
      plateYRef.current = Math.min(
        plateYRef.current + plateVelocityRef.current,
        canvas.height - plateHeight
      );

      if (plateYRef.current + plateHeight >= canvas.height) {
        setIsGameOver(true);
        cancelAnimationFrame(animationRef.current);
      }

      if (checkCollision()) {
        setIsGameOver(true);
        cancelAnimationFrame(animationRef.current);
      }

      drawBuildings();
      drawPlate();
      drawTopImage();
    };

    const animate = () => {
      updatePositions();
      animationRef.current = requestAnimationFrame(animate);
    };

    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp" || event.key === " ") {
        plateVelocityRef.current = lift;
      }
    };
    const handleTouchStart = (event) => {
      event.preventDefault();
      plateVelocityRef.current = lift;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart);
    animate();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      cancelAnimationFrame(animationRef.current);
    };
  }, [isGameOver, isGameStarted, countdown]);

  const handleStartGame = () => {
    setIsGameStarted(true);
    setIsGameOver(false);
    setScore(0);
    plateYRef.current = 200;
    plateVelocityRef.current = 0;
    startCountdown();
  };

  const startCountdown = () => {
    setCountdown(3);
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (countdown === 0 && isGameStarted) {
      setIsGameStarted(true);
    }
  }, [countdown, isGameStarted]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        width={500}
        height={400}
        style={{ border: "1px solid black", backgroundColor: "gray" }}
      />
      {isGameOver && (
        <div
          style={{
            position: "absolute",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            borderRadius: "20px",
          }}
        >
          <h2 style={{ color: "white", margin: "0" }}>Game Over!</h2>
          <p style={{ color: "white", fontSize: "24px" }}>
            Your Score: {score}
          </p>
          <button
            style={{
              padding: "10px 50px",
              backgroundColor: "rgba(245, 12, 12, 0.7)",
              fontSize: "25px",
              color: "white",
            }}
            onClick={handleStartGame}
          >
            Play Again
          </button>
        </div>
      )}
      {countdown != 0 && isGameStarted && (
        <h2
          style={{
            position: "absolute",
            fontSize: "36px",
            color: "white",
          }}
        >
          {countdown}
        </h2>
      )}
      {!isGameOver && !isGameStarted && (
        <div
          style={{
            position: "absolute",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h2 style={{ color: "white" }}>You have 3 attempts</h2>
          <button
            style={{
              padding: "10px 50px",
              backgroundColor: "rgba(245, 12, 12, 0.7)",
              fontSize: "25px",
              color: "white",
            }}
            onClick={handleStartGame}
          >
            PLAY
          </button>
        </div>
      )}
      {!isGameOver && isGameStarted && (
        <div
          style={{
            backgroundColor: "rgba(245, 12, 12, 0.7)",
            borderRadius: "10px",
            padding: "10px",
            top: "9%",
            position: "absolute",
          }}
        >
          Score: {score}
        </div>
      )}
    </div>
  );
};

export default Game;
