document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = `https://api.allorigins.win/get?url=${encodeURIComponent("https://www.bergen.kommune.no/omkommunen/avdelinger/astveit-skole/arbeidsplaner/8trinn")}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Feil ved henting av data.");
      }
      return response.json();
    })
    .then((data) => {
      const htmlContent = data.contents;

      // Analyser HTML-en med DOMParser
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");

      // Finn innholdet med klassen article__content
      const articleContent = doc.querySelector(".article__content");
      if (!articleContent) {
        document.getElementById("data-container").innerHTML = "Fant ikke artikkelinnhold.";
        return;
      }

      // Finn alle h2 og h3-elementer som inneholder klassen og ukeplanen
      const headers = articleContent.querySelectorAll("h2, h3");
      const classPlans = [];

      headers.forEach((header) => {
        // Rens opp unødvendige linjeskift og mellomrom
        const rawHTML = header.innerHTML.trim();
        const parts = rawHTML.split(/<br\s*\/?>/); // Del opp på <br> for flere klasser i samme header

        parts.forEach((part) => {
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = part.trim();

          const link = tempDiv.querySelector("a");
          const textContent = tempDiv.textContent.trim().replace(/\s+/g, " ");

          if (link) {
            classPlans.push({
              className: textContent,
              url: link.href,
            });
          } else if (textContent) {
            classPlans.push({
              className: textContent,
              url: null,
            });
          }
        });
      });

      // Vis ukeplanene i en ryddig liste
      const list = document.createElement("ul");
      classPlans.forEach((plan) => {
        const listItem = document.createElement("li");
        if (plan.url) {
          listItem.innerHTML = `${plan.className} - <a href="${plan.url}" target="_blank">Lenke</a>`;
        } else {
          listItem.textContent = plan.className;
        }
        list.appendChild(listItem);
      });

      document.getElementById("data-container").appendChild(list);
    })
    .catch((error) => {
      document.getElementById("data-container").innerHTML = "Feil ved henting av data.";
      console.error(error);
    });
});
