import "dotenv/config";
import path from "node:path";
import express from "express";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import mouseCoor from "./src/js/socketMouseCoor.js";
import disconnect from "./src/js/socketDisconnect.js";
import updateScore from "./src/js/socketUpdateScore.js";
import playerNameForScoreBoard from "./src/js/socketPlayerNameForScoreBoard.js";
import playerNameForCursorName from "./src/js/socketPlayerNameForCursorName.js";
import lookingForIfPlayerExist from "./src/middleware/lookingForIfPlayerExist.js";

const app = express();
const port = process.env.PORT || 12211;

app.use(express.json());
app.use("/favicon", express.static("./public"));
app.use("/style", express.static("./public"));
app.use("/form", express.static("./public"));
app.use("/socket-events", express.static("./public"));
app.use("/delete-cursor", express.static("./public"));
app.use("/remove-ball", express.static("./public"));
app.use("/creation-ball", express.static("./public"));
app.use("/create-or-update-cursor", express.static("./public"));
app.use("/create-or-update-scoreboard", express.static("./public"));

/**
 * Gestion HTTP
 */

app
  .route("/")
  .get((req, res) => {
    res.sendFile(
      path.normalize(path.join(process.cwd(), "./public/html/index.html"))
    );
  })
  .post((req, res) => {
    res.send("Ok");
  });

app
  .route("/register")
  .get((req, res) => {
    res.send("Ok");
  })
  .post(lookingForIfPlayerExist, (req, res) => {
    if (req.body.isExist) {
      res.send(
        JSON.stringify({
          response: "Ce pseudo existe déjà",
          isExist: req.body.isExist,
        })
      );
    } else {
      res.send(JSON.stringify({ isExist: req.body.isExist }));
    }
  });

const httpServer = app.listen(port, () => {
  console.log(`Serveur sur écoute au port :${port}`);
});

/**
 * Gestion WebSocket
 */

const ioServer = new Server(httpServer);
const scoreLimit = 10;
const allCursors = {};
let scoreBoard = [];
let ball = {
  id: "ball",
  top: "300px",
  left: "300px",
  width: "50px",
  height: "50px",
  position: "absolute",
  radius: "50px",
  backgroundColor: "brown",
};
ioServer.on("connection", (socket) => {
  console.log(`Connecté au client ${socket.id}`);
  const cursorForConnexion = {
    id: uuidv4(),
    pId: uuidv4(),
    top: "0px",
    left: "0px",
    width: "20px",
    height: "20px",
    borderRadius: "30px",
    zIndex: "10",
    position: "absolute",
    pointerEvents: "none",
    backgroundColor: "#" + Math.floor(Math.random() * 16777215).toString(16),
    pseudo: "",
  };
  
  for(const playerInfo of scoreBoard) {
    if(playerInfo.score >= scoreLimit) {
      console.log('finito')
    } else {
      ioServer.emit("ballCreation", ball);
    }
  }

  socket.on("playerNameForScoreBoard", () => {
    playerNameForScoreBoard(scoreBoard, scoreLimit, ioServer);
  });

  socket.on("updateScore", (scoreData) => {
    updateScore(scoreData, scoreBoard, ball, scoreLimit, ioServer);
  });

  socket.on("playerNameForCursorName", (playerData) => {
    playerNameForCursorName(playerData, cursorForConnexion, allCursors, ioServer);
  });

  socket.on("mouseCoor", (cursorData) => {
    mouseCoor(cursorData, cursorForConnexion, allCursors, ioServer);
  });

  socket.on("disconnect", () => {
    disconnect(cursorForConnexion, allCursors, scoreBoard, ioServer);
  });
});
