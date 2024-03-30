function removeBall(ballData) {
  let ball = window.document.getElementById(ballData.id);
  if(ball) {
    ball.remove();
  }
}

export { removeBall }
