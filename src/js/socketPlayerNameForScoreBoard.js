import MongoClient from "../db/client.js";
async function playerNameForScoreBoard(playerData, scoreBoard, ioServer) {
  try {
    await MongoClient.connect();
    const db = MongoClient.db(String(process.env.DBNAME));
    const collection = db.collection("players-info");
    const playerFind = await collection
      .find(
        { pseudo: playerData.pseudo },
        { sort: { score: -1 }, projection: { _id: 0 } }
      )
      .toArray();
    scoreBoard.push(playerFind[0]);
    ioServer.emit("createAndUpdateScoreBoard", scoreBoard);
  } catch (error) {
    console.error(error);
  } finally {
    MongoClient.close();
  }
}

export default playerNameForScoreBoard