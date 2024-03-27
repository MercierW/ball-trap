function mouseCoor(cursorData, cursorForConnexion, allCursors, ioServer) {
  if (!isNaN(cursorData.y) && !isNaN(cursorData.x)) {
    cursorForConnexion.top =
      cursorData.y - parseFloat(cursorForConnexion.height) / 2 + "px";
    cursorForConnexion.left =
      cursorData.x - parseFloat(cursorForConnexion.width) / 2 + "px";
    for (const id in allCursors) {
      ioServer.emit("createOrUpdateCursor", allCursors[id]);
    }
  }
}

export default mouseCoor;
