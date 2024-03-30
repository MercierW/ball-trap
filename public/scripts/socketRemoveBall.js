function removeBall(ballData) {
  let ball = window.document.getElementById(ballData.id);
  ball.remove();
}

export { removeBall }