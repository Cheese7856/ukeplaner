document.addEventListener("DOMContentLoaded", () => {
  const stjerner = document.querySelectorAll(".stjerne");

  // Hent tidligere valgt stjerne fra LocalStorage
  const valgtStjerne = localStorage.getItem("valgtStjerne");

  // Sett riktig stjerne som valgt ved å oppdatere DOM
  if (valgtStjerne) {
    stjerner.forEach((stjerne) => {
      if (stjerne.id === valgtStjerne) {
        stjerne.textContent = "star";
      } else {
        stjerne.textContent = "star_border";
      }
    });
  }

  // Legg til klikkhendelse på hver stjerne
  stjerner.forEach((stjerne) => {
    stjerne.addEventListener("click", () => {
      // Hvis stjernen som er klikket allerede er valgt, de-seleksjoner vi den
      if (stjerne.textContent === "star") {
        stjerne.textContent = "star_border";
        localStorage.removeItem("valgtStjerne"); // Fjern valgt stjerne fra LocalStorage
      } else {
        // Resett alle stjerner
        stjerner.forEach((s) => (s.textContent = "star_border"));

        // Merk klikket stjerne som valgt
        stjerne.textContent = "star";

        // Lagre valgt stjerne i LocalStorage
        localStorage.setItem("valgtStjerne", stjerne.id);
      }
    });
  });
});
