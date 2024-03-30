import { deleteCursor } from "https://ball-trap.onrender.com/delete-cursor/scripts/socketDeleteCursor.js";
import { creationBall } from "https://ball-trap.onrender.com/creation-ball/scripts/socketCreationBall.js";
import { createOrUpdateCursor } from "https://ball-trap.onrender.com/create-or-update-cursor/scripts/socketCreateOrUpdateCursor.js";
import { createOrUpdateScoreBoard } from "https://ball-trap.onrender.com/create-or-update-scoreboard/scripts/socketCreateOrUpdateScoreBoard.js";
import { removeBall } from "https://ball-trap.onrender.com/remove-ball/scripts/socketRemoveBall.js";

function socketEvents() {
  const socket = io();
  socket.on("cursorDestroyed", (cursorData) => {
    deleteCursor(cursorData);
  });
  socket.on("ballCreation", (ballData) => {
    creationBall(ballData);
  });

  socket.on("removeBall", (ballData) => {
    removeBall(ballData)
  })
  
  socket.on("createOrUpdateCursor", (cursorDataFromServ) => {
    createOrUpdateCursor(cursorDataFromServ);
  });
  socket.on("createAndUpdateScoreBoard", (scoreBoardData, scoreLimit) => {
    createOrUpdateScoreBoard(scoreBoardData, scoreLimit);
  });

  setTimeout(() => {
    socket.emit("playerNameForCursorName", {
      pseudo: localStorage.getItem("playerName"),
    });
    socket.emit("playerNameForScoreBoard", {
      pseudo: localStorage.getItem("playerName"),
    });
  }, 500);

  window.addEventListener("mousemove", (e) => {
    socket.emit("mouseCoor", {
      x: e.clientX,
      y: e.clientY,
    });
  });

  window.addEventListener("click", function (e) {
    if(e.target.id === 'ball') {
      socket.emit("updateScore", {
        pseudo: localStorage.getItem("playerName"),
        score: 5,
      });
    }
  });
}

export { socketEvents };
