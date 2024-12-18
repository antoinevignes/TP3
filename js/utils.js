export function sortCities(cities) {
  cities.sort((a, b) => {
    if (a.population < b.population) {
      return 1;
    } else if (a.population > b.population) {
      return -1;
    } else {
      return 0;
    }
  });
}
