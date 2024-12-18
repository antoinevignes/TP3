import fetchData from "./fetch-data.js";

export async function fetchRegion() {
  const url = "https://geo.api.gouv.fr/regions";
  return fetchData(url);
}

export async function fetchDept(code) {
  const url = `https://geo.api.gouv.fr/regions/${code}/departements`;
  return fetchData(url);
}

export async function fetchCities(code) {
  const url = `https://geo.api.gouv.fr/departements/${code}/communes`;
  return fetchData(url);
}
