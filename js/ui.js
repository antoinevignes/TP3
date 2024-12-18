export function populateSelect(element, data, id, name) {
  element.innerHTML = "";

  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item[id];
    option.innerHTML = item[name];
    option.dataset.id = item[id];
    element.appendChild(option);
  });
}

export function populateTable(data) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = "";

  data.forEach((item) => {
    const row = document.createElement("tr");
    const cellName = document.createElement("td");
    const cellPop = document.createElement("td");

    cellName.textContent = item.nom;
    cellPop.textContent = item.population;

    row.appendChild(cellName);
    row.appendChild(cellPop);
    tbody.appendChild(row);
  });
}
