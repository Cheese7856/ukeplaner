// Sett opp global error handler
window.onerror = function () {
  // Endre innholdet i elementet med id="tekst-1"
  document.getElementById("tekst-1").innerHTML = "En feil har oppsått. Om dette skjer over lang tid, kontakt Elander på elander.olsen@gmail.com";

  // Hindre at feilen logges flere ganger
  return true;
};
