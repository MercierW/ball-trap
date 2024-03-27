function playerNameForCursorName(playerData, cursorForConnexion, allCursors, ball, ioServer) {
  cursorForConnexion.pseudo = playerData.pseudo;
  allCursors[cursorForConnexion.id] = cursorForConnexion;
  for (const id in allCursors) {
    ioServer.emit("createOrUpdateCursor", allCursors[id]);
  }
  ioServer.emit("ballCreation", ball);
}

export default playerNameForCursorName;
