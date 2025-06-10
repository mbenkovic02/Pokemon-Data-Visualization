import { selected } from './state.js';

export function renderSpiderChart(pokemons) {
  const svg = d3.select("#spider-chart");
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 40;

  const stats = [
    "Health Stat", "Attack Stat", "Defense Stat",
    "Special Attack Stat", "Special Defense Stat", "Speed Stat"
  ];
  const angleSlice = (2 * Math.PI) / stats.length;

  const statMaxValues = {
    "Health Stat": 255, "Attack Stat": 190, "Defense Stat": 250,
    "Special Attack Stat": 194, "Special Defense Stat": 250, "Speed Stat": 200
  };

  svg.selectAll("*").remove();

  for (let level = 0.2; level <= 1; level += 0.2) {
    const points = stats.map((stat, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const r = radius * level;
      return [centerX + Math.cos(angle) * r, centerY + Math.sin(angle) * r];
    });
    svg.append("polygon")
      .attr("points", points.map(p => p.join(",")).join(" "))
      .attr("stroke", "#444")
      .attr("fill", "none")
      .attr("stroke-dasharray", "2,2");
  }

  stats.forEach((stat, i) => {
    const angle = i * angleSlice - Math.PI / 2;
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;

    svg.append("line")
      .attr("x1", centerX).attr("y1", centerY)
      .attr("x2", x).attr("y2", y)
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1);

    const statName = stat.replace(" Stat", "");
    const left = pokemons[0] ? `${pokemons[0]["Pokemon Name"]}: ${pokemons[0][stat]}` : "";
    const right = pokemons[1] ? `${pokemons[1]["Pokemon Name"]}: ${pokemons[1][stat]}` : "";
    const tooltipText = `${statName}
${left}
${right}`.trim();

    svg.append("text")
      .attr("x", x).attr("y", y)
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("fill", "#e0e0e0")
      .style("font-size", "12px")
      .text(statName)
      .append("title")
      .text(tooltipText);
  });

  pokemons.forEach((pokemon) => {
    const isLeft = selected.left && pokemon["Pokedex Number"] === selected.left["Pokedex Number"]
      && (pokemon["Alternate Form Name"] || "") === (selected.left["Alternate Form Name"] || "");
    const color = isLeft ? "#ff6666" : "#6699ff";

    const line = d3.lineRadial()
      .radius((_, i) => {
        const stat = stats[i];
        const value = +pokemon[stat];
        const max = statMaxValues[stat];
        return (value / max) * radius;
      })
      .angle((_, i) => i * angleSlice)
      .curve(d3.curveLinearClosed);

    svg.append("path")
      .datum(stats)
      .attr("transform", `translate(${centerX},${centerY})`)
      .attr("fill", "none")
      .attr("stroke", color)
      .attr("stroke-width", 2)
      .attr("d", line);

    stats.forEach((stat, i) => {
      const angle = i * angleSlice - Math.PI / 2;
      const value = +pokemon[stat];
      const max = statMaxValues[stat];
      const scaled = (value / max) * radius;
      const x = centerX + Math.cos(angle) * scaled;
      const y = centerY + Math.sin(angle) * scaled;

      const statName = stat.replace(" Stat", "");
      const left = pokemons[0] ? `${pokemons[0]["Pokemon Name"]}: ${pokemons[0][stat]}` : "";
      const right = pokemons[1] ? `${pokemons[1]["Pokemon Name"]}: ${pokemons[1][stat]}` : "";
      const tooltipText = `${statName}
${left}
${right}`.trim();

      svg.append("circle")
        .attr("cx", x).attr("cy", y)
        .attr("r", 4)
        .attr("fill", color)
        .append("title")
        .text(tooltipText);
    });
  });
}

export function renderTotalChart(pokemons) {
  const svg = d3.select("#total-chart");
  const width = +svg.attr("width");
  const height = +svg.attr("height");
  const margin = { top: 30, right: 30, bottom: 40, left: 50 };

 
  svg.selectAll("g").remove();

  
  if (pokemons.length !== 2) return;

  const x = d3.scaleBand()
    .domain(pokemons.map(d => d["Alternate Form Name"] ? `${d["Pokemon Name"]} (${d["Alternate Form Name"]})` : d["Pokemon Name"]))
    .range([margin.left, width - margin.right])
    .padding(0.2);

  const y = d3.scaleLinear()
    .domain([0, d3.max(pokemons, d => +d["Base Stat Total"])]).nice()
    .range([height - margin.bottom, margin.top]);

  
  svg.append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("fill", "#e0e0e0");

  
  svg.append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(5))
    .selectAll("text")
    .style("fill", "#e0e0e0");

 
  const bars = svg.selectAll(".bar")
    .data(pokemons, d => d["Pokemon Name"]); 

 
  bars.exit().remove();

 
  bars.transition()
    .duration(600)
    .attr("x", d => x(d["Alternate Form Name"] ? `${d["Pokemon Name"]} (${d["Alternate Form Name"]})` : d["Pokemon Name"]))
    .attr("width", x.bandwidth())
    .attr("y", d => y(+d["Base Stat Total"]))
    .attr("height", d => y(0) - y(+d["Base Stat Total"]))
    .attr("fill", (d, i) => i === 0 ? "#ff6666" : "#6699ff");


  bars.enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", d => x(d["Alternate Form Name"] ? `${d["Pokemon Name"]} (${d["Alternate Form Name"]})` : d["Pokemon Name"]))
    .attr("width", x.bandwidth())
    .attr("y", y(0))
    .attr("height", 0)
    .attr("fill", (d, i) => i === 0 ? "#ff6666" : "#6699ff")
    .style("rx", 6)
    .transition()
    .duration(600)
    .attr("y", d => y(+d["Base Stat Total"]))
    .attr("height", d => y(0) - y(+d["Base Stat Total"]));

  
  svg.selectAll(".bar")
    .data(pokemons)
    .select("title").remove(); 

  svg.selectAll(".bar")
    .data(pokemons)
    .append("title")
    .text(d => `Ukupno: ${d["Base Stat Total"]}`);
}
