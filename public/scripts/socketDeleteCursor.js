function deleteCursor(cursorData) {
  let cursorPlayer = window.document.getElementById(cursorData.id);
  let cursorName = window.document.getElementById(cursorData.pId);
  let liPlayer = document.getElementById(cursorData.pseudo);
  if (cursorPlayer) {
    cursorName.parentNode.removeChild(cursorName);
    cursorPlayer.parentNode.removeChild(cursorPlayer);
    liPlayer.parentNode.removeChild(liPlayer);
  }
}

export { deleteCursor };
