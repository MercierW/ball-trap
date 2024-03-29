import MongoClient from "../db/client.js";
async function disconnect(cursorForConnexion, allCursors, scoreBoard, ioServer) {
  try {
    await MongoClient.connect();
    const db = MongoClient.db(String(process.env.DBNAME));
    const collection = db.collection("players-info");
    await collection.deleteOne({ pseudo: cursorForConnexion.pseudo });
    scoreBoard = await collection
    .find({}, { projection: { _id: 0 } })
    .toArray();
  } catch (error) {
    console.error(error);
  } finally {
    MongoClient.close();
  }
  if (allCursors[cursorForConnexion.id]) {
    console.log("déconnecté");
    delete allCursors[cursorForConnexion.id];
    ioServer.emit("cursorDestroyed", cursorForConnexion);
  }
}

export default disconnect