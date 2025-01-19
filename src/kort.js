const fetchAndDisplayClassPlans = async () => {
  const urls = {
    "trinn-8": "https://api.allorigins.win/get?url=https://www.bergen.kommune.no/omkommunen/avdelinger/astveit-skole/arbeidsplaner/8trinn",
    "trinn-9": "https://api.allorigins.win/get?url=https://www.bergen.kommune.no/omkommunen/avdelinger/astveit-skole/arbeidsplaner/9trinn",
  };

  for (const [trinn, url] of Object.entries(urls)) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      // Parse HTML response
      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, "text/html");

      // Find the container for the current trinn
      const container = document.querySelector(`#${trinn}`);
      if (!container) {
        console.error(`Container for ${trinn} not found`);
        continue;
      }

      // Extract the class plans from the article content
      const articleContent = doc.querySelector(".article__content");
      if (!articleContent) {
        console.error(`No article content found for ${trinn}`);
        continue;
      }

      const cards = [];
      if (trinn === "trinn-8") {
        const plans = articleContent.querySelectorAll("h2, h3");
        plans.forEach((plan) => {
          const className = plan.textContent.split(" - ")[0].trim();
          const linkElement = plan.querySelector("a");
          if (linkElement) {
            const week = linkElement.textContent.trim();
            const link = linkElement.href;
            cards.push({ className, week, link });
          }
        });
      } else if (trinn === "trinn-9") {
        const plans = articleContent.querySelectorAll("h2, h3");
        plans.forEach((plan) => {
          const className = plan.textContent.trim();
          const links = Array.from(plan.querySelectorAll("a")).map((a) => ({
            week: a.textContent.trim(),
            link: a.href,
          }));
          cards.push({ className, weeks: links });
        });
      }

      // Display the class plans in the container
      container.innerHTML = cards
        .map((card) => {
          if (trinn === "trinn-8") {
            return `
              <div class="card">
                <h4>${card.className}</h4>
                <h5>${card.week}</h5>
                <a href="${card.link}" target="_blank">Gå til ukeplan</a>
              </div>
            `;
          } else if (trinn === "trinn-9") {
            const linksHtml = card.weeks.map((week) => `<a href="${week.link}" target="_blank">Uke ${week.week}</a>`).join("<br>");
            return `
              <div class="card">
                <h4>${card.className}</h4>
                ${linksHtml}
              </div>
            `;
          }
        })
        .join("");
    } catch (error) {
      console.error(`Error fetching data for ${trinn}:`, error);
    }
  }
};

// Run the function on page load
window.onload = fetchAndDisplayClassPlans;
