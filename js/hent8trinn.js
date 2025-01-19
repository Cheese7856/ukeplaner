// hentData.js

// Funksjon for å hente ukeplaner
export function hentUkeplanerData() {
  return fetch("https://api.allorigins.win/get?url=https%3A%2F%2Fwww.bergen.kommune.no%2Fomkommunen%2Favdelinger%2Fastveit-skole%2Farbeidsplaner%2F8trinn")
    .then((response) => response.json())
    .then((data) => {
      const htmlContent = data.contents;
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      const links = doc.querySelectorAll(".article__content a"); // Hent alle lenker i article__content

      const ukeplaner = {};
      const trinn = ["8A", "8B", "8C", "8D", "8E"]; // Definer rekkefølgen på trinnene

      let index = 0; // Bruk index for å tilordne lenker til trinnene

      // Gå gjennom alle lenkene og tilordne dem til trinnene
      links.forEach((link) => {
        if (index < trinn.length) {
          // Sørg for at vi ikke går utenfor trinnene
          const ukeMatch = link.textContent.match(/Uke (\d+)/);
          const ukenr = ukeMatch ? ukeMatch[1] : "Unknown";
          const trinnNavn = trinn[index];

          if (!ukeplaner[trinnNavn]) {
            ukeplaner[trinnNavn] = {};
          }

          // Legg til lenken for hvert trinn og uke
          ukeplaner[trinnNavn][ukenr] = link.href;

          index++; // Øk index for å tilordne neste lenke til neste trinn
        }
      });

      return ukeplaner; // Returner ukeplanene til den andre filen
    })
    .catch((error) => {
      console.error("Error fetching ukeplaner:", error);
      return {}; // Returner et tomt objekt ved feil
    });
}
