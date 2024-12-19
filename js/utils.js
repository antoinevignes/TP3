export function sortCities(cities) {
  cities.sort((a, b) => b.population - a.population);
}
