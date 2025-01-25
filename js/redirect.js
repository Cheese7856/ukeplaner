import { hentUkeplanerData } from "./hent8trinn.js";
const tekst1 = document.getElementById("tekst-1");

if (document.referrer === "") {
  const urlParams = new URLSearchParams(window.location.search);
  const klasse = urlParams.get("klasse");

  if (klasse) {
    document.title = `Ukeplan ${klasse}`;
    const existingData = JSON.parse(localStorage.getItem("ukeplaner")) || {};

    if (existingData[klasse]) {
      const ukenummer = Math.max(...Object.keys(existingData[klasse]).map(Number));
      const storedUrl = existingData[klasse][ukenummer];

      setTimeout(() => {
        const newWindow = window.open(storedUrl, "_blank");

        if (!newWindow) {
          alert("Popup ble blokkert! Vennligst tillat popups for denne nettsiden.");
        }

        hentUkeplanerData().then((updatedData) => {
          const updatedClassData = updatedData[klasse];
          const updatedWeek = updatedClassData && Math.max(...Object.keys(updatedClassData).map(Number));

          if (updatedWeek && updatedClassData[updatedWeek] !== storedUrl) {
            localStorage.setItem("ukeplaner", JSON.stringify(updatedData));
            newWindow.location.href = updatedClassData[updatedWeek];
          }
        });

        document.title = "LUKK DENNE!";
        tekst1.innerHTML = "Du kan trygt lukke denne siden";
      }, 100);
    } else {
      hentUkeplanerData().then((updatedData) => {
        if (updatedData[klasse]) {
          localStorage.setItem("ukeplaner", JSON.stringify(updatedData));
          const updatedWeek = Math.max(...Object.keys(updatedData[klasse]).map(Number));
          window.location.href = updatedData[klasse][updatedWeek];
        }
      });
    }
  }
} else {
  tekst1.innerHTML = "For å legge til nettsiden som et bokmerke, trykk control + D. Da kan du få ukeplanene til din klasse med ett trykk.";
  const trinn = urlParams.get("klasse");
  document.title = "Ukeplan " + trinn;
}
