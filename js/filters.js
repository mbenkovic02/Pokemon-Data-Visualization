import { data } from './state.js';
import { renderPokemonCards } from './cards.js';

export function setupFilters() {
  d3.select("#searchbar").on("input", function () {
    const terms = this.value.toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = data.filter(d => {
      const searchable = [
        d["Pokemon Name"],
        d["Alternate Form Name"] || "",
        d["Primary Type"] || "",
        d["Secondary Type"] || ""
      ].join(" ").toLowerCase();
      return terms.every(term => searchable.includes(term));
    });
    renderPokemonCards(filtered);
  });

  d3.select("#sort-select").on("change", function () {
    const sortType = this.value;
    const terms = d3.select("#searchbar").property("value").toLowerCase().split(/\s+/).filter(Boolean);
    let filtered = data.filter(d => {
      const searchable = [
        d["Pokemon Name"],
        d["Alternate Form Name"] || "",
        d["Primary Type"] || "",
        d["Secondary Type"] || ""
      ].join(" ").toLowerCase();
      return terms.every(term => searchable.includes(term));
    });

    switch (sortType) {
      case "name":
        filtered.sort((a, b) => a["Pokemon Name"].localeCompare(b["Pokemon Name"]));
        break;
      case "total-asc":
        filtered.sort((a, b) => +a["Base Stat Total"] - +b["Base Stat Total"]);
        break;
      case "total-desc":
        filtered.sort((a, b) => +b["Base Stat Total"] - +a["Base Stat Total"]);
        break;
      case "pokedex":
      default:
        filtered.sort((a, b) => +a["Pokedex Number"] - +b["Pokedex Number"]);
        break;
    }

    renderPokemonCards(filtered);
  });
}
