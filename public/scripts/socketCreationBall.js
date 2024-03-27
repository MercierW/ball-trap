function creationBall(ballData) {
  let ball = window.document.getElementById(ballData.id);
  if (!ball) {
    ball = window.document.createElement("div");
    window.document.body.appendChild(ball);
  }
  ball.id = ballData.id;
  ball.style.top = ballData.top;
  ball.style.left = ballData.left;
  ball.style.width = ballData.width;
  ball.style.height = ballData.height;
  ball.style.position = ballData.position;
  ball.style.borderRadius = ballData.radius;
  ball.style.backgroundColor = ballData.backgroundColor;
}

export { creationBall };
