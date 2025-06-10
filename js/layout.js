export function initLayout() {
  const comparisonArea = d3.select("#comparison-area");
  const comparisonRow = comparisonArea.append("div")
    .style("display", "flex")
    .style("justify-content", "space-between")
    .style("align-items", "center")
    .style("gap", "20px");

  // Left card
  comparisonRow.append("div")
    .attr("id", "pokemon-left")
    .attr("class", "compare-card")
    .append("div")
    .attr("class", "placeholder-text")
    .text("Select Pokémon");

  const svgContainer = comparisonRow.append("div");
  svgContainer.append("svg").attr("id", "spider-chart").attr("width", 500).attr("height", 400);
  svgContainer.append("svg").attr("id", "total-chart").attr("width", 500).attr("height", 180);

  // Right card
  comparisonRow.append("div")
    .attr("id", "pokemon-right")
    .attr("class", "compare-card")
    .append("div")
    .attr("class", "placeholder-text")
    .text("Select Pokémon");
}
