import { fetchRegion, fetchDept, fetchCities } from "./api/api.js";
import fetchData from "./api/fetch-data.js";
import { populateSelect, populateTable } from "./ui.js";
import { sortCities } from "./utils.js";

const regions = document.querySelector("#regions");
const depts = document.querySelector("#depts");
const form = document.querySelector("#form");
const geoBtn = document.querySelector("#geoBtn");

geoBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handleGeolocation, handleError);
  } else {
    alert("La géolocalisation n'est pas supportée par votre navigateur.");
  }
});

async function handleGeolocation(position) {
  const { latitude, longitude } = position.coords;
  const url = `https://geo.api.gouv.fr/communes?lat=${latitude}&lon=${longitude}&fields=code,nom,codesPostaux,surface,population,centre,contour&format=json`;
  const cities = await fetchData(url);

  if (cities.length === 0) {
    alert("Aucune commune trouvée pour votre position.");
    return;
  }
  const city = cities[0];
  console.log(city);

  displayCityInfo(city);
}

function handleError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("Vous avez refusé la demande de géolocalisation.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("La position n'est pas disponible.");
      break;
    case error.TIMEOUT:
      alert("La demande de géolocalisation a expiré.");
      break;
    default:
      alert("Une erreur inconnue est survenue.");
      break;
  }
}

function displayCityInfo(city) {
  const cityInfo = `
    <h2>${city.nom}</h2>
    <p><strong>Code INSEE :</strong> ${city.code}</p>
    <p><strong>Codes postaux :</strong> ${city.codesPostaux.join(", ")}</p>
    <p><strong>Population :</strong> ${city.population}</p>
    <p><strong>Surface :</strong> ${city.surface} m²</p>
  `;
  document.getElementById("cityInfo").innerHTML = cityInfo;
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
