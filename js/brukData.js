// brukData.js

import { hentUkeplanerData } from "./hent8trinn.js";

function settUkeplanerInnIHTML(ukeplaner) {
  for (let trinn in ukeplaner) {
    const klasse = trinn.slice(1);
    const trinnDiv = document.querySelector(`#trinn-8 .${klasse}`);

    if (trinnDiv) {
      for (let uke in ukeplaner[trinn]) {
        const aElement = document.createElement("a");
        aElement.href = ukeplaner[trinn][uke];
        aElement.textContent = `Uke ${uke}`;
        trinnDiv.appendChild(aElement);
      }
    }
  }
}

// Hent data og sett det inn i HTML
hentUkeplanerData().then((ukeplaner) => {
  console.log(ukeplaner);
  settUkeplanerInnIHTML(ukeplaner);
});
