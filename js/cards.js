import { selected } from './state.js';
import { TYPE_COLORS } from './state.js';

export function renderPokemonCards(filteredData) {
  const listContainer = d3.select("#pokemon-list");
  listContainer.html("");

  filteredData.forEach(d => {
    const pokedexNum = +d["Pokedex Number"];
    const baseName = d["Pokemon Name"];
    const altForm = d["Alternate Form Name"];
    const spritePath = `pokemon_sprites/${pokedexNum}.png`;

    const card = listContainer.append("div")
      .datum(d)
      .attr("class", "pokemon-card")
      .style("height", "240px")
      .style("width", "150px")
      .style("display", "inline-block")
      .style("vertical-align", "top")
      .style("margin", "10px")
      .style("text-align", "center")
      .style("box-sizing", "border-box")
      .style("padding-bottom", "10px");

    card.append("img")
      .attr("src", spritePath)
      .attr("width", 96)
      .attr("height", 96)
      .attr("alt", baseName)
      .style("background", "white")
      .style("padding", "6px")
      .style("border-radius", "8px")
      .style("box-shadow", "0 0 6px rgba(255, 255, 255, 0.3)");

    const nameContainer = card.append("div")
      .style("margin-top", "8px");

    nameContainer.append("div")
      .text(`${pokedexNum} ${baseName}`)
      .style("font-weight", "bold");

    nameContainer.append("div")
      .html(altForm ? `(${altForm})` : "&nbsp;")
      .style("font-size", "13px")
      .style("color", "#ccc");

    const typeRow = card.append("div")
      .style("display", "flex")
      .style("justify-content", "center")
      .style("gap", "6px")
      .style("margin-top", "6px");

    ["Primary Type", "Secondary Type"].forEach(typeKey => {
      const type = d[typeKey];
      if (type) {
        typeRow.append("span")
          .style("padding", "4px 8px")
          .style("border-radius", "12px")
          .style("background-color", TYPE_COLORS[type] || "#777")
          .style("color", "white")
          .style("font-size", "12px")
          .text(type);
      }
    });

    card.append("button")
      .text("Compare")
      .attr("class", "compare-btn")
      .style("margin-top", "10px")
      .style("padding", "6px 12px")
      .style("border", "none")
      .style("border-radius", "6px")
      .style("cursor", "pointer")
      .style("background", "#222")
      .style("color", "white")
      .style("font-weight", "bold")
      .on("click", () => {
        const id = d["Pokedex Number"];
        const alt = d["Alternate Form Name"] || "";
        const match = (poke) =>
          poke && poke["Pokedex Number"] === id &&
          (poke["Alternate Form Name"] || "") === alt;

        if (match(selected.left)) {
          selected.left = null;
        } else if (match(selected.right)) {
          selected.right = null;
        } else if (!selected.left) {
          selected.left = d;
        } else if (!selected.right) {
          selected.right = d;
        }
        updateComparison();
        updateButtons();
      });
  });
}


import { renderSpiderChart, renderTotalChart } from './charts.js';

export function updateButtons() {
  d3.selectAll(".pokemon-card").each(function() {
    const d = d3.select(this).datum();
    const id = d["Pokedex Number"];
    const alt = d["Alternate Form Name"] || "";

    const isSelected = (poke) =>
      poke && poke["Pokedex Number"] === id &&
      (poke["Alternate Form Name"] || "") === alt;

    const selectedFlag = isSelected(selected.left) || isSelected(selected.right);

    d3.select(this).select("button")
      .style("background-color", selectedFlag ? "#cc0000" : "#222")
      .style("color", "white")
      .style("font-weight", "bold")
      .text(selectedFlag ? "Remove" : "Compare");
  });
}

export function updateComparison() {
  d3.select("#pokemon-left").html('<div class="placeholder-text">Select Pokémon</div>');
  d3.select("#pokemon-right").html('<div class="placeholder-text">Select Pokémon</div>');
  d3.select("#spider-chart").html("");
  d3.select("#total-chart").html("");

  if (selected.left) {
    renderPokemonCard(selected.left, "#pokemon-left");
    d3.select("#pokemon-left").on("click", () => {
      selected.left = null;
      updateComparison();
      updateButtons();
    });
  }

  if (selected.right) {
    renderPokemonCard(selected.right, "#pokemon-right");
    d3.select("#pokemon-right").on("click", () => {
      selected.right = null;
      updateComparison();
      updateButtons();
    });
  }

  const chosen = [selected.left, selected.right].filter(Boolean);
  renderSpiderChart(chosen);
  if (chosen.length === 2) renderTotalChart(chosen);
  updateButtons();
}

function renderPokemonCard(pokemon, container) {
  const card = d3.select(container).html("");
  const pokedexNum = +pokemon["Pokedex Number"];
  const baseName = pokemon["Pokemon Name"];
  const altForm = pokemon["Alternate Form Name"];
  const name = altForm ? `${baseName} (${altForm})` : baseName;
  const spritePath = `pokemon_sprites/${pokedexNum}.png`;

  card.append("img")
    .attr("src", spritePath)
    .attr("width", 96)
    .attr("height", 96)
    .style("display", "block").style("margin", "0 auto")
    .style("background", "white")
    .style("padding", "6px")
    .style("border-radius", "8px")
    .style("box-shadow", "0 0 6px rgba(255, 255, 255, 0.3)");

  card.append("div").text(name)
    .style("font-weight", "bold")
    .style("margin-top", "5px")
    .style("text-align", "center");

  const typeRow = card.append("div")
    .style("display", "flex")
    .style("justify-content", "center")
    .style("gap", "6px")
    .style("margin-top", "8px");

  ["Primary Type", "Secondary Type"].forEach(typeKey => {
    const type = pokemon[typeKey];
    if (type) {
      typeRow.append("span")
        .style("padding", "4px 8px")
        .style("border-radius", "12px")
        .style("background-color", TYPE_COLORS[type] || "#777")
        .style("color", "white")
        .style("font-size", "12px")
        .text(type);
    }
  });

  const tooltip = d3.select("body").append("div")
    .attr("id", "tooltip")
    .style("position", "absolute")
    .style("background", "#111")
    .style("color", "#fff")
    .style("padding", "6px 10px")
    .style("border-radius", "6px")
    .style("font-size", "12px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  [
    { key: "Primary Ability", desc: "Primary Ability Description" },
    { key: "Secondary Ability", desc: "Secondary Ability Description" },
    { key: "Hidden Ability", desc: "Hidden Ability Description" }
  ].forEach(({ key, desc }) => {
    const value = pokemon[key] || "None";
    const description = pokemon[desc] || "";
    const row = card.append("div").style("margin-top", "6px");
    row.append("span").text(`${key}: ${value}`);
    if (description && value !== "None") {
      row.append("span")
        .text(" ⓘ")
        .style("color", "#00aaff")
        .style("cursor", "pointer")
        .on("mouseover", function (event) {
          tooltip.style("opacity", 1).html(description)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY + 10) + "px");
        })
        .on("mouseout", () => tooltip.style("opacity", 0));
    }
  });
}
