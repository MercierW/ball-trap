window.addEventListener('DOMContentLoaded', () => {
  console.log('Script de socket.io');
  const form = document.getElementById('form');
  const pseudoInput = document.getElementById('pseudo');
  const socket = io();
  const errP = window.document.getElementById('errorMsg')

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if(pseudoInput.value !== '') {
      localStorage.setItem("playerName", pseudoInput.value);
      const formData = {
        pseudo: pseudoInput.value,
        score: 0
      };
      fetch('http://localhost:6500/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({formData}),
      })
      .then(JsonRes => JsonRes.json())
      .then((res) => {
        if(res.isExist) {
          errP.textContent = res.response
          errP.style.color = 'red'
        } else {
          window.document.body.style.cursor = 'none';
          makeSocketConnect()
          setTimeout(() => {
            socket.emit('playerNameForCursorName', {pseudo: pseudoInput.value})
            socket.emit('playerNameForScoreBoard', {pseudo: pseudoInput.value})
            }, 500)
          setTimeout(() => {
            const overlay = window.document.querySelector('.overlay');
            overlay.remove()
          }, 1000)
          console.log('Pseudo enregistré dans la base de données')
          errP.textContent = ''
        }
      });
    } else {
      errP.textContent = 'Veillez entrer un pseudo'
      errP.style.color = 'red'
    }
  });
  
  function makeSocketConnect() {
    socket.on('connect', () => {

    })
    socket.on('cursorDestroyed', (cursorData) => {
      let cursorPlayer = window.document.getElementById(cursorData.id);
      let cursorName = window.document.getElementById(cursorData.pId);
      let liPlayer = document.getElementById(cursorData.pseudo)
      if (cursorPlayer) {
        cursorName.parentNode.removeChild(cursorName)
        cursorPlayer.parentNode.removeChild(cursorPlayer);
        liPlayer.parentNode.removeChild(liPlayer)
      }
    })

    socket.on('ballCreation', (ballData) => {
      let ball = window.document.getElementById(ballData.id);
      if (!ball) {
        ball = window.document.createElement('div');
        window.document.body.appendChild(ball);
      }
      ball.id = ballData.id;
      ball.style.top = ballData.top;
      ball.style.left = ballData.left;
      ball.style.width = ballData.width;
      ball.style.height = ballData.height;
      ball.style.position = ballData.position;
      ball.style.borderRadius = ballData.radius
      ball.style.backgroundColor = ballData.backgroundColor;
    })
    
    socket.on('createOrUpdateCursor', (cursorDataFromServ) => {
      let cursorPlayer = window.document.getElementById(cursorDataFromServ.id);
      let cursorName = window.document.getElementById(cursorDataFromServ.pId);
      cursorName = window.document.getElementById(cursorDataFromServ.pId);
      if (!cursorPlayer && !cursorName) {
        cursorPlayer = window.document.createElement('div');
        window.document.body.appendChild(cursorPlayer);
        cursorName = window.document.createElement('cursorName');
        window.document.body.appendChild(cursorName);
      }
      cursorPlayer.id = cursorDataFromServ.id;
      cursorPlayer.style.top = cursorDataFromServ.top;
      cursorPlayer.style.left = cursorDataFromServ.left;
      cursorPlayer.style.width = cursorDataFromServ.width;
      cursorPlayer.style.zIndex = cursorDataFromServ.zIndex;
      cursorPlayer.style.height = cursorDataFromServ.height;
      cursorPlayer.style.position = cursorDataFromServ.position;
      cursorPlayer.style.borderRadius = cursorDataFromServ.borderRadius
      cursorPlayer.style.pointerEvents = cursorDataFromServ.pointerEvents
      cursorPlayer.style.backgroundColor = cursorDataFromServ.backgroundColor;
      cursorName.id = cursorDataFromServ.pId;
      cursorName.textContent = cursorDataFromServ.pseudo;
      cursorName.style.zIndex = cursorDataFromServ.zIndex;
      cursorName.style.position = cursorDataFromServ.position;
      cursorName.style.top = (parseFloat(cursorDataFromServ.top) + -25) + 'px';
      cursorName.style.left = (parseFloat(cursorDataFromServ.left) - 15) + 'px';
    });
  
    socket.on('createAndUpdateScoreBoard', (scoreBoardData) => {
      console.log(scoreBoardData)

      for(const playerData of scoreBoardData) {
        if(parseInt(playerData.score) >= 100) {
          let overlay = window.document.createElement('div')
          let modal = window.document.createElement('div')
          let p = window.document.createElement('h2')
          modal.classList.add('modal')
          overlay.classList.add('overlay')
          p.textContent = playerData.pseudo + ' a gagné !'
          window.document.body.appendChild(overlay)
          overlay.appendChild(modal)
          modal.appendChild(p)

          socket.emit('gameEnd')
        }
      }

      let scoreBoard = window.document.getElementById('scoreBoard')
      let ulScoreBoard = window.document.getElementById('boardUl')
      let h2ScoreBoard = window.document.getElementById('boardH2')
      if(!scoreBoard && !ulScoreBoard && !h2ScoreBoard) {
        scoreBoard = window.document.createElement('div')
        ulScoreBoard = window.document.createElement('ul')
        h2ScoreBoard = window.document.createElement('h2')
        window.document.body.appendChild(scoreBoard);
        scoreBoard.appendChild(h2ScoreBoard)
        scoreBoard.appendChild(ulScoreBoard);
      }
      scoreBoard.id = 'scoreBoard'
      ulScoreBoard.id = 'boardUl'
      h2ScoreBoard.id = 'boardH2'
      scoreBoard.style.position = 'absolute';
      scoreBoard.style.right = '10px'
      scoreBoard.style.margin = '10px'
      h2ScoreBoard.textContent = 'Tableau des scores'
  
      scoreBoardData.forEach((scorePlayer) => {
        const liScorePlayer = document.getElementById(scorePlayer.pseudo)
        if(!liScorePlayer) {
          ulScoreBoard.innerHTML += `<li id="${scorePlayer.pseudo}">${scorePlayer.pseudo} : ${scorePlayer.score} points</li>`
        } else {
          liScorePlayer.textContent = `${scorePlayer.pseudo} : ${scorePlayer.score} points`
        }
      }) 
    })
    window.addEventListener('mousemove', (e) => {
      socket.emit('mouseCoor', {
        x: e.clientX,
        y: e.clientY
      })
    });
  
    window.addEventListener('click', function(e) {
      const targetId = e.target.id
      if(targetId === 'ball') {
        e.target.remove()
        socket.emit('updateScore', {
          pseudo: localStorage.getItem('playerName'),
          score: 5
        })
      }
    })
  }
});
