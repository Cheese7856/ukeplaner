import { hentUkeplanerData } from "./hent8trinn.js"; // Importer hentUkeplanerData-funksjonen

// Hent query-parameteren for 'trinn' fra URL-en
const urlParams = new URLSearchParams(window.location.search);
const trinn = urlParams.get("trinn"); // F.eks. "8E"

// Sjekk om 'trinn' er tilgjengelig i URL-en
if (trinn) {
  // Del opp trinnet og klassen (f.eks. "8E" -> trinn = "8", klasse = "E")
  const trinnNr = trinn.slice(0, -1); // Henter tallet (f.eks. "8")
  const klasse = trinn.slice(-1); // Henter bokstaven (f.eks. "E")

  // Sjekk om referer er tom
  if (document.referrer === "") {
    // Hvis referer er tom, kom fra en ny fane eller bokmerke
    // Hent ukeplanene ved å kalle hentUkeplanerData
    hentUkeplanerData()
      .then((ukeplaner) => {
        // Finn nøkkelen for trinnet + klasse (f.eks. "8E")
        console.log(ukeplaner);
        const klasseNokkel = trinn; // Dette er nå 8E, som er nøyaktig som i objektet

        // Sjekk om dataene for dette trinnet og klassen finnes
        if (ukeplaner[klasseNokkel]) {
          // Hent alle ukene for den klassen
          const ukene = Object.keys(ukeplaner[klasseNokkel]);

          // Finn den siste tilgjengelige uken
          const sisteUke = Math.max(...ukene.map(Number)); // Konverter uke-nummerene til tall og finn det største

          // Hent ukeplanen for den siste uken
          const ukeplanURL = ukeplaner[klasseNokkel][sisteUke.toString()]; // Bruk siste uke som string

          if (ukeplanURL) {
            window.location.href = ukeplanURL; // Omdiriger til ukeplanen
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
    // Hvis referer ikke er tom (ikke bokmerke eller ny fane)
    console.log("Ikke redirectet fra bokmerke eller ny fane.");
  }
} else {
  // Hvis trinn ikke er spesifisert i URL-en, vis en feilmelding
  alert("Trinn og klasse ikke spesifisert.");
}
