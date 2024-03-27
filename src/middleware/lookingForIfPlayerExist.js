import MongoClient from "../db/client.js";
async function lookingForIfPlayerExist(req, res, next) {
  try {
    await MongoClient.connect();
    const db = MongoClient.db(String(process.env.DBNAME));
    const playersInfoColl = db.collection("players-info");
    const scoresHistoryColl = db.collection("scores-history");
    const findPlayerOrNot = await playersInfoColl
      .find(
        { pseudo: req.body.formData.pseudo },
        { projection: { _id: 0, score: 0 } }
      )
      .toArray();
    if (findPlayerOrNot.length > 0) {
      req.body.isExist = true  
      next();
    } else {
      await playersInfoColl.insertOne({
        pseudo: req.body.formData.pseudo,
        score: req.body.formData.score,
      });
      await scoresHistoryColl.insertOne({
        pseudo: req.body.formData.pseudo,
        score: req.body.formData.score,
      });
      req.body.isExist = false  
      next();
    }
  } catch (error) {
    console.error("erreur du middleware lookingForIfPlayerExist", error);
  } finally {
    MongoClient.close();
  }
}

export default lookingForIfPlayerExist;
