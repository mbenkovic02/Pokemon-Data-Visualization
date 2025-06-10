import { setData } from './state.js';
import { initLayout } from './layout.js';
import { renderPokemonCards } from './cards.js';
import { renderSpiderChart } from './charts.js';
import { setupFilters } from './filters.js';

async function initApp() {
  const csvData = await d3.csv("data/Pokemon_Database_Filtered.csv");
  setData(csvData);

  initLayout();
  renderSpiderChart([]);
  renderPokemonCards(csvData);
  setupFilters();
}

initApp();
