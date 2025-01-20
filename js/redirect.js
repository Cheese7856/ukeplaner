import { hentUkeplanerData } from "./hent8trinn.js";

const urlParams = new URLSearchParams(window.location.search);
const trinn = urlParams.get("klasse");

if (trinn) {
  const trinnNr = trinn.slice(0, -1);
  const klasse = trinn.slice(-1);

  const tekst1 = document.getElementById("tekst-1");

  if (document.referrer === "") {
    hentUkeplanerData()
      .then((ukeplaner) => {
        console.log(ukeplaner);
        const klasseNokkel = trinn;

        if (ukeplaner[klasseNokkel]) {
          const ukene = Object.keys(ukeplaner[klasseNokkel]);
          const sisteUke = Math.max(...ukene.map(Number));
          const ukeplanURL = ukeplaner[klasseNokkel][sisteUke.toString()];

          if (ukeplanURL) {
            window.location.href = ukeplanURL;
          } else {
            alert("Ingen ukeplan funnet for den siste uken.");
          }
        } else {
          alert("Ukeplan ikke funnet for dette trinnet og klassen.");
        }
      })
      .catch((error) => {
        console.error("Feil ved henting av ukeplaner:", error);
        alert("Det oppstod en feil ved henting av ukeplanene.");
      });
  } else {
    console.log("Ikke redirectet fra bokmerke eller ny fane.");
    tekst1.innerHTML = "For å legge til nettsiden som et bokmerke, trykk control + D. Da kan du få ukeplanene til dinn klasse med ett trykk.";
    document.title = `Ukeplan ${trinn}`;
  }
} else {
  alert("Feil med henting av info.");
}
