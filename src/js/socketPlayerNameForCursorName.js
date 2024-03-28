function playerNameForCursorName(playerData, cursorForConnexion, allCursors, ioServer) {
  cursorForConnexion.pseudo = playerData.pseudo;
  allCursors[cursorForConnexion.id] = cursorForConnexion;
  for (const id in allCursors) {
    ioServer.emit("createOrUpdateCursor", allCursors[id]);
  }
}

export default playerNameForCursorName;
