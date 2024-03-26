import 'dotenv/config';
import path from 'node:path';
import express from 'express';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { fileURLToPath } from "node:url";
import MongoClient from './src/db/client.js';


const port = process.env.PORT || 6500;
const app = express();
const host = 'localhost';
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);
const myPath = path.normalize(`${_dirname}`);

app.use(express.json());
app.use('/form', express.static('./public'));
app.use('/style', express.static('./public'));
app.use('/socket', express.static('./public'));

/**
 * Gestion HTTP
 */

app.route('/form')
.get((req, res, next) => {
    res.send('Ok')
})
.post( async (req, res, next) => {
    try {
      await MongoClient.connect();
      const db = MongoClient.db(String(process.env.DBNAME));
      const playersInfoColl = db.collection('players-info');
      const scoresHistoryColl = db.collection('scores-history');
      const findPlayerOrNot = await playersInfoColl
      .find({pseudo: req.body.formData.pseudo}, { projection: { _id: 0, score: 0 } })
      .toArray();
      if(findPlayerOrNot.length > 0) {
        res.send(JSON.stringify({response : 'Ce pseudo existe déjà', isExist: true}))
      } else {
        await playersInfoColl.insertOne({
          pseudo: req.body.formData.pseudo,
          score: req.body.formData.score
        });
        await scoresHistoryColl.insertOne({
          pseudo: req.body.formData.pseudo,
          score: req.body.formData.score
        });
        res.send(JSON.stringify({isExist: false}))
      }
    } catch (error) {
      console.error(error);
    } finally {
      MongoClient.close();
    }
})


app.route('/')
.get(async (req, res, next) => {
  let findResult = [];

  try {
    await MongoClient.connect();

    const db = MongoClient.db(String(process.env.DBNAME));
    const collection = db.collection('players-info');

    findResult = await collection
      .find({}, { projection: { _id: 0 } })
      .toArray();
  } catch (error) {
    console.error(error);
  } finally {
    MongoClient.close();
  }

  res.sendFile(
    path.normalize(path.join(process.cwd(), './public/html/index.html'))
  );
})
.post((req, res) => {
    console.log(req.body)
    res.send('Ok')
})


const httpServer = app.listen(port, () => {
  console.log(`Serveur sur écoute au port :${port}`);
});

/**
 * Gestion WebSocket
 */

const ioServer = new Server(httpServer);
const allCursors = {};
let ballIstance = {}
let scoreBoard = []

ioServer.on('connection', (socket) => {
    let ball = {
      id: 'ball',
      top: Math.floor(Math.random()*600) + 'px',
      left: Math.floor(Math.random()*1200) + 'px',
      width: '50px',
      height: '50px',
      position: 'absolute',
      radius: '50px',
      backgroundColor: 'brown', 
    }
    
    const cursorForConnexion = {
      id: uuidv4(),
      pId: uuidv4(),
      top: '0px',
      left: '0px',
      width: '20px',
      height: '20px',
      borderRadius: '30px',
      zIndex: '10',
      position: 'absolute',
      pointerEvents: 'none',
      backgroundColor: '#' + Math.floor(Math.random()*16777215).toString(16),
      pseudo: '',
    }
    
    ballIstance = ball
    ioServer.emit('ballCreation', ballIstance);

    socket.on('playerNameForScoreBoard', async (playerData) => {
      try {
        await MongoClient.connect();
        
        const db = MongoClient.db(String(process.env.DBNAME));
        const collection = db.collection('players-info');
        
        const playerFind = await collection
          .find({pseudo: playerData.pseudo}, {sort: {score: -1}, projection: {_id: 0}})
          .toArray();
        scoreBoard.push(playerFind[0])
        ioServer.emit('createAndUpdateScoreBoard', scoreBoard)
      } catch (error) {
        console.error(error);
      } finally {
        MongoClient.close();
      }
    })


    socket.on('updateScore', async (scoreData) => {
      let findPlayer = [];
      let scoreUpdated;
      try {
        await MongoClient.connect();
    
        const db = MongoClient.db(String(process.env.DBNAME));
        const playersInfoColl = db.collection('players-info');
        const scoresHistoryColl = db.collection('scores-history');
        findPlayer = await playersInfoColl
          .find({pseudo: scoreData.pseudo}, { projection: { _id: 0 } })
          .toArray();   
        scoreUpdated = findPlayer[0].score + scoreData.score 
        await playersInfoColl.updateOne({pseudo: scoreData.pseudo}, {$set:{score: scoreUpdated}})
        await scoresHistoryColl.updateOne({pseudo: scoreData.pseudo}, {$set:{score: scoreUpdated}})

        for(const player of scoreBoard) {
          if(player.pseudo === scoreData.pseudo) {
            player.score = scoreUpdated
            ioServer.emit('createAndUpdateScoreBoard', scoreBoard)
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        MongoClient.close();
      }
      ball.top = Math.floor(Math.random()*600) + 'px';
      ball.left = Math.floor(Math.random()*1200) + 'px';
      setTimeout(() => {
        ioServer.emit('ballCreation', ball);
      }, 1000)
    })

    socket.on('playerNameForCursorName', (playerData) => {
      cursorForConnexion.pseudo = playerData.pseudo 
      allCursors[cursorForConnexion.id] = cursorForConnexion;
      for(const id in allCursors) {
        ioServer.emit('createOrUpdateCursor', allCursors[id]);
      }
      ballIstance = ball
    ioServer.emit('ballCreation', ballIstance);
    })
  
    socket.on('mouseCoor', (cursorData) => {
      if ( ! isNaN(cursorData.y) && ! isNaN(cursorData.x) ) {
        cursorForConnexion.top = cursorData.y - (parseFloat(cursorForConnexion.height) / 2) + 'px';
        cursorForConnexion.left = cursorData.x - (parseFloat(cursorForConnexion.width) / 2) + 'px';
        for(const id in allCursors) {
          ioServer.emit('createOrUpdateCursor', allCursors[id]);
        }
      }
    })

    socket.on('gameEnd', () => {
        ball = {}
    })

    socket.on('disconnect', async () => {
      try {
        await MongoClient.connect();
    
        const db = MongoClient.db(String(process.env.DBNAME));
        const collection = db.collection('players-info');
    
        await collection.deleteOne({pseudo: cursorForConnexion.pseudo});   
      } catch (error) {
        console.error(error);
      } finally {
        MongoClient.close();
      }

      if (allCursors[cursorForConnexion.id]) {
        console.log('déconnecté');
        const scoreBoardFiltred = scoreBoard.filter((player) => player.pseudo !== cursorForConnexion.pseudo)
        scoreBoard = scoreBoardFiltred
        delete allCursors[cursorForConnexion.id];
        ioServer.emit('cursorDestroyed', cursorForConnexion);
      }
    })
})