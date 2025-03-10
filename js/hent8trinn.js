export function hentUkeplanerData() {
  return fetch("https://api.codetabs.com/v1/proxy?quest=https://www.bergen.kommune.no/omkommunen/avdelinger/astveit-skole/arbeidsplaner/8trinn")
    .then((response) => response.text())
    .then((htmlContent) => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      let links = Array.from(doc.querySelectorAll(".article__content a"));

      // Filtrer ut alle <a>-elementer der tekstinnholdet er blank (tom eller kun whitespace)
      //links = links.filter(link => link.textContent.trim() !== "");

      const ukeplaner = {};
      const trinn = ["8A", "8B", "8C", "8D", "8E"];
      let index = 0;

      links.forEach((link) => {
        if (index < trinn.length) {
          const ukeMatch = link.textContent.match(/Uke (\d+)/);
          const ukenr = ukeMatch ? ukeMatch[1] : "Unknown";
          const trinnNavn = trinn[index];

          if (!ukeplaner[trinnNavn]) {
            ukeplaner[trinnNavn] = {};
          }

          ukeplaner[trinnNavn][ukenr] = link.href;
          index++;
        }
      });

      return ukeplaner;
    })
    .catch((error) => {
      console.error("Error fetching ukeplaner:", error);
      return {};
    });
}
