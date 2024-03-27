function createOrUpdateCursor(cursorDataFromServ) {
  let cursorPlayer = window.document.getElementById(cursorDataFromServ.id);
  let cursorName = window.document.getElementById(cursorDataFromServ.pId);
  cursorName = window.document.getElementById(cursorDataFromServ.pId);
  if (!cursorPlayer && !cursorName) {
    cursorPlayer = window.document.createElement("div");
    window.document.body.appendChild(cursorPlayer);
    cursorName = window.document.createElement("cursorName");
    window.document.body.appendChild(cursorName);
  }
  cursorPlayer.id = cursorDataFromServ.id;
  cursorPlayer.style.top = cursorDataFromServ.top;
  cursorPlayer.style.left = cursorDataFromServ.left;
  cursorPlayer.style.width = cursorDataFromServ.width;
  cursorPlayer.style.zIndex = cursorDataFromServ.zIndex;
  cursorPlayer.style.height = cursorDataFromServ.height;
  cursorPlayer.style.position = cursorDataFromServ.position;
  cursorPlayer.style.borderRadius = cursorDataFromServ.borderRadius;
  cursorPlayer.style.pointerEvents = cursorDataFromServ.pointerEvents;
  cursorPlayer.style.backgroundColor = cursorDataFromServ.backgroundColor;
  cursorName.id = cursorDataFromServ.pId;
  cursorName.textContent = cursorDataFromServ.pseudo;
  cursorName.style.zIndex = cursorDataFromServ.zIndex;
  cursorName.style.position = cursorDataFromServ.position;
  cursorName.style.top = parseFloat(cursorDataFromServ.top) + -25 + "px";
  cursorName.style.left = parseFloat(cursorDataFromServ.left) - 15 + "px";
}

export { createOrUpdateCursor };
