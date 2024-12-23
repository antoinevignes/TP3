export default async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ! Status ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error("Erreur lors de la récupératon des données:", error);
    return [];
  }
}
