export function fetchRestaurantsData() {
  return fetch('/restaurants.json').then((response) => {
    if (!response.ok) throw new Error('Não foi possível carregar os restaurantes.');
    return response.json();
  });
}

export async function fetchRestaurantDetails(restaurantId) {
  const [detailsResponse, menuResponse] = await Promise.all([
    fetch(`/restaurantDetails${restaurantId}.json`),
    fetch(`/restaurantMenu${restaurantId}.json`),
  ]);

  if (!detailsResponse.ok || !menuResponse.ok) {
    throw new Error('Não foi possível carregar os detalhes deste restaurante.');
  }

  const [details, menu] = await Promise.all([
    detailsResponse.json(),
    menuResponse.json(),
  ]);

  return { details, menu };
}
