import MongoClient from "../db/client.js";
async function disconnect(cursorForConnexion, allCursors, scoreBoard, ioServer) {
  try {
    await MongoClient.connect();
    const db = MongoClient.db(String(process.env.DBNAME));
    const collection = db.collection("players-info");
    await collection.deleteOne({ pseudo: cursorForConnexion.pseudo });
  } catch (error) {
    console.error(error);
  } finally {
    MongoClient.close();
  }
  if (allCursors[cursorForConnexion.id]) {
    console.log("déconnecté");
    const scoreBoardFiltred = scoreBoard.filter(
      (player) => player.pseudo !== cursorForConnexion.pseudo
    );
    scoreBoard = scoreBoardFiltred;
    delete allCursors[cursorForConnexion.id];
    ioServer.emit("cursorDestroyed", cursorForConnexion);
  }
}

export default disconnect