import MongoClient from "../db/client.js";
async function updateScore(scoreData, scoreBoard, ball, scoreLimit, ioServer) {
  let findPlayer = [];
  let scoreUpdated;
  let playerScore;
  try {
    await MongoClient.connect();
    const db = MongoClient.db(String(process.env.DBNAME));
    const playersInfoColl = db.collection("players-info");
    const scoresHistoryColl = db.collection("scores-history");
    findPlayer = await playersInfoColl
      .find({ pseudo: scoreData.pseudo }, { projection: { _id: 0 } })
      .toArray();
    scoreUpdated = findPlayer[0].score + scoreData.score;
    await playersInfoColl.updateOne(
      { pseudo: scoreData.pseudo },
      { $set: { score: scoreUpdated } }
    );
    await scoresHistoryColl.updateOne(
      { pseudo: scoreData.pseudo },
      { $set: { score: scoreUpdated } }
    );

    for (const player of scoreBoard) {
      if (player.pseudo === scoreData.pseudo) {
        player.score = scoreUpdated;
        playerScore = scoreUpdated
        ioServer.emit("createAndUpdateScoreBoard", scoreBoard, scoreLimit);
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    MongoClient.close();
  }
  ball.top = Math.floor(Math.random() * 600) + "px";
  ball.left = Math.floor(Math.random() * 1200) + "px";
  if (playerScore < scoreLimit) {
    setTimeout(() => {
      ioServer.emit("ballCreation", ball);
    }, 1000);
  }
}

export default updateScore;
