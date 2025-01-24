import { hentUkeplanerData } from "./hent8trinn.js";
const tekst1 = document.getElementById("tekst-1");

// Hent query-parameteren for 'klasse' fra URL-en
const urlParams = new URLSearchParams(window.location.search);

// Sjekk om refereren er tom (blank)
if (document.referrer === "") {
  // Hent klasse fra URL-parameteren
  const klasse = urlParams.get("klasse"); // F.eks. "8E"
  console.log(klasse);

  // Sjekk om 'klasse' er spesifisert
  if (klasse) {
    // Oppdater tittelen til "Ukeplan <klassenavn>"
    document.title = `Ukeplan ${klasse}`;
    // Hent eksisterende ukeplaner fra localStorage
    const existingData = JSON.parse(localStorage.getItem("ukeplaner")) || {};

    // Sjekk om vi allerede har data for klassen
    if (existingData[klasse]) {
      const ukenummer = Math.max(...Object.keys(existingData[klasse]).map(Number)); // Finn siste ukenummer
      const storedUrl = existingData[klasse][ukenummer]; // Hent lagret URL

      // Åpne den eksisterende ukeplanen i en ny fane
      const newWindow = window.open(storedUrl, "_blank");
      console.log(newWindow);

      // Start oppdatering i bakgrunnen
      hentUkeplanerData().then((updatedData) => {
        // Sjekk om data for klassen er oppdatert
        const updatedClassData = updatedData[klasse];
        const updatedWeek = updatedClassData && Math.max(...Object.keys(updatedClassData).map(Number));

        console.log(updatedClassData);

        if (updatedWeek && updatedClassData[updatedWeek] !== storedUrl) {
          // Ukeplanen er oppdatert
          console.log("Ny ukeplan oppdaget. Oppdaterer...");

          // Oppdater localStorage med ny data
          localStorage.setItem("ukeplaner", JSON.stringify(updatedData));

          // Erstatt den gamle fanen med den nye ukeplanen
          newWindow.location.href = updatedClassData[updatedWeek];
        }
      });

      document.title = "LUKK DENNE!";
      tekst1.innerHTML = "Du kan trygt lukke denne siden. ";
    } else {
      // Ingen data for klassen i localStorage, hent data og lagre det
      hentUkeplanerData().then((updatedData) => {
        if (updatedData[klasse]) {
          localStorage.setItem("ukeplaner", JSON.stringify(updatedData));
          const updatedWeek = Math.max(...Object.keys(updatedData[klasse]).map(Number));

          // Åpne den nye ukeplanen i samme fane (uten å åpne ny fane)
          window.location.href = updatedData[klasse][updatedWeek];
        }
      });
    }
  }
} else {
  // Denne delen blir utført hvis refereren ikke er tom
  tekst1.innerHTML = "For å legge til nettsiden som et bokmerke, trykk control + D. Da kan du få ukeplanene til din klasse med ett trykk.";

  // Hent trinn fra URL-parameteren og oppdater tittelen
  const trinn = urlParams.get("klasse");
  document.title = "Ukeplan " + trinn;
}
