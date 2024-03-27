import { deleteCursor } from "http://localhost:6500/delete-cursor/scripts/socketDeleteCursor.js";
import { creationBall } from "http://localhost:6500/creation-ball/scripts/socketCreationBall.js";
import { createOrUpdateCursor } from "http://localhost:6500/create-or-update-cursor/scripts/socketCreateOrUpdateCursor.js";
import { createOrUpdateScoreBoard } from "http://localhost:6500/create-or-update-scoreboard/scripts/socketCreateOrUpdateScoreBoard.js";


function socketEvents() {
  const socket = io();
  socket.on("cursorDestroyed", (cursorData) => {
    deleteCursor(cursorData);
  });
  socket.on("ballCreation", (ballData) => {
    creationBall(ballData);
  });
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
    const targetId = e.target.id;
    if (targetId === "ball") {
      e.target.remove();
      socket.emit("updateScore", {
        pseudo: localStorage.getItem("playerName"),
        score: 5,
      });
    }
  });
}

export { socketEvents };
