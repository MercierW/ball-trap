import { socketEvents } from "https://ball-trap.onrender.com/socket-events/scripts/socketEvents.js";
window.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form");
  const errP = window.document.getElementById("errorMsg");
  const pseudoInput = document.getElementById("pseudo");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (pseudoInput.value !== "") {
      localStorage.setItem("playerName", pseudoInput.value);
      const formData = {
        pseudo: pseudoInput.value,
        score: 0,
      };
      fetch("https://ball-trap.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json;charset=utf-8",
        },
        body: JSON.stringify({ formData }),
      })
        .then((JsonRes) => JsonRes.json())
        .then((res) => {
          if (res.isExist) {
            errP.textContent = res.response;
            errP.style.color = "red";
          } else {
              socketEvents()
              window.document.body.style.cursor = "none";
            setTimeout(() => {
              const overlay = window.document.querySelector(".overlay");
              overlay.remove();
            }, 1000);
            console.log("Pseudo enregistré dans la base de données");
            errP.textContent = "";
          }
        });
    } else {
      errP.textContent = "Veillez entrer un pseudo";
      errP.style.color = "red";
    }
  });
});
