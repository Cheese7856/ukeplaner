// Funksjon for å hente og vise ukeplaner
function hentUkeplaner() {
  // Hent data fra proxyen
  fetch("https://api.allorigins.win/get?url=https%3A%2F%2Fwww.bergen.kommune.no%2Fomkommunen%2Favdelinger%2Fastveit-skole%2Farbeidsplaner%2F8trinn")
    .then((response) => response.json())
    .then((data) => {
      // Hent HTML-en fra responsen
      const htmlContent = data.contents;

      // Bruk DOMParser for å analysere HTML-en
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");

      // Finn alle <h2> og <h3> som inneholder trinnene
      const headings = doc.querySelectorAll(".article__content h2, .article__content h3");

      // Objekt for å lagre ukeplanene
      const ukeplaner = {};

      // Loop gjennom alle overskriftene og finn lenkene
      headings.forEach((heading) => {
        // Hent tekstinnholdet fra overskriften og fjern unødvendige mellomrom
        const headingText = heading.textContent.trim();

        // Finn trinnene ved å bruke regex for å matche trinn som "8A", "8B", osv.
        const trinnMatches = headingText.match(/8[A-E]/g); // Endret regex for å kun matche 8A, 8B, osv.

        // Hvis trinn ble funnet, legg det til i objektet
        if (trinnMatches) {
          // Finn lenkene i overskriften
          const link = heading.querySelector("a");
          if (link && link.href) {
            // Sjekk om href finnes
            // Hent ukenummeret fra lenkens tekst (f.eks. "Uke 4")
            const ukeMatch = link.textContent.match(/Uke (\d+)/);
            const ukenr = ukeMatch ? ukeMatch[1] : "Unknown"; // Får ukenummeret, eller "Unknown" hvis ikke funnet

            // Legg til lenken for hvert trinn under riktig uke og trinn
            trinnMatches.forEach((trinn) => {
              if (!ukeplaner[trinn]) {
                ukeplaner[trinn] = {}; // Initialiser objektet for trinnet hvis det ikke finnes
              }
              ukeplaner[trinn][ukenr] = link.href; // Legg lenken til riktig ukenummer
            });
          }
        }
      });

      // Legg til ukeplanene i HTML
      for (let trinn in ukeplaner) {
        // Fjern tallet fra klassen (f.eks. 8A blir A)
        const klasse = trinn.slice(1); // Tar bort "8" og etterlater "A", "B", etc.

        const trinnDiv = document.querySelector(`#trinn-8 .${klasse}`); // Finn div for klassen
        if (trinnDiv) {
          for (let uke in ukeplaner[trinn]) {
            const aElement = document.createElement("a"); // Opprett <a> element
            aElement.href = ukeplaner[trinn][uke]; // Sett href til ukeplanens URL
            aElement.textContent = `Uke ${uke}`; // Sett teksten til "Uke X"
            trinnDiv.appendChild(aElement); // Legg til <a> i div-en for klassen
          }
        }
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Kall funksjonen
hentUkeplaner();
