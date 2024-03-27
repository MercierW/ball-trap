function createOrUpdateScoreBoard(scoreBoardData, scoreLimit) {
  for (const playerData of scoreBoardData) {
    if (parseInt(playerData.score) >= scoreLimit) {
      let overlay = window.document.createElement("div");
      let modal = window.document.createElement("div");
      let p = window.document.createElement("h2");
      modal.classList.add("modal");
      overlay.classList.add("overlay");
      p.textContent = playerData.pseudo + " a gagné !";
      window.document.body.appendChild(overlay);
      overlay.appendChild(modal);
      modal.appendChild(p);
    }
  }

  let scoreBoard = window.document.getElementById("scoreBoard");
  let ulScoreBoard = window.document.getElementById("boardUl");
  let h2ScoreBoard = window.document.getElementById("boardH2");
  if (!scoreBoard && !ulScoreBoard && !h2ScoreBoard) {
    scoreBoard = window.document.createElement("div");
    ulScoreBoard = window.document.createElement("ul");
    h2ScoreBoard = window.document.createElement("h2");
    window.document.body.appendChild(scoreBoard);
    scoreBoard.appendChild(h2ScoreBoard);
    scoreBoard.appendChild(ulScoreBoard);
  }
  scoreBoard.id = "scoreBoard";
  ulScoreBoard.id = "boardUl";
  h2ScoreBoard.id = "boardH2";
  scoreBoard.style.position = "absolute";
  scoreBoard.style.right = "10px";
  scoreBoard.style.margin = "10px";
  h2ScoreBoard.textContent = "Tableau des scores";

  scoreBoardData.forEach((scorePlayer) => {
    const liScorePlayer = document.getElementById(scorePlayer.pseudo);
    if (!liScorePlayer) {
      ulScoreBoard.innerHTML += `<li id="${scorePlayer.pseudo}">${scorePlayer.pseudo} : ${scorePlayer.score} points</li>`;
    } else {
      liScorePlayer.textContent = `${scorePlayer.pseudo} : ${scorePlayer.score} points`;
    }
  });
}

export { createOrUpdateScoreBoard };
