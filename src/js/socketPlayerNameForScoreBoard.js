import MongoClient from "../db/client.js";
async function playerNameForScoreBoard(scoreBoard, scoreLimit, ioServer) {
  try {
    await MongoClient.connect();
    const db = MongoClient.db(String(process.env.DBNAME));
    const collection = db.collection("players-info");
    scoreBoard = await collection
    .find(
      {},
      { sort: { score: -1 }, projection: { _id: 0 } }
      )
      .toArray();
    ioServer.emit("createAndUpdateScoreBoard", scoreBoard, scoreLimit);
  } catch (error) {
    console.error(error);
  } finally {
    MongoClient.close();
  }
}

export default playerNameForScoreBoard