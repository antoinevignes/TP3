import { fetchRegion, fetchDept, fetchCities } from "./api/api.js";
import { populateSelect, populateTable } from "./ui.js";
import { sortCities } from "./utils.js";

const regions = document.querySelector("#regions");
const depts = document.querySelector("#depts");
const form = document.querySelector("#form");
const geoBtn = document.querySelector("#geoBtn");

geoBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleGeolocation);
  } else {
    alert("La géolocalisation n'est pas supportée par votre navigateur.");
  }
});

async function handleGeolocation(position) {
  const { latitude, longitude } = position.coords;
  try {
    const url = `https://geo.api.gouv.fr/communes?lat=${latitude}&lon=${longitude}&fields=code,nom,codesPostaux,surface,population,centre,contour&format=json`;
    const communes = await fetchData(url);

    if (communes.length === 0) {
      alert("Aucune commune trouvée pour votre position.");
      return;
    }

    const commune = communes[0]; // Supposons que la première commune est la bonne
    displayCityInfo(commune);
    displayCityOnMap(commune);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des informations de la commune :",
      error
    );
    alert("Impossible de récupérer les informations de votre ville.");
  }
}

async function displayRegions() {
  const data = await fetchRegion();
  populateSelect(regions, data, "code", "nom");

  if (regions.options.length > 0) {
    const firstRegionCode = regions.options[0].dataset.id;
    const initialDepts = await fetchDept(firstRegionCode);
    populateSelect(depts, initialDepts, "code", "nom");
  }
}

function displayCityInfo(city) {}

regions.addEventListener("change", async () => {
  const selected = regions.options[regions.selectedIndex];
  const code = selected.dataset.id;

  const data = await fetchDept(code);
  populateSelect(depts, data, "code", "nom");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const selected = depts.options[depts.selectedIndex];
  const code = selected.dataset.id;

  const cities = await fetchCities(code);
  sortCities(cities);
  populateTable(cities, "nom", "population");
});

displayRegions();
