export const fetchRestaurantsData = () => {
  return fetch('/restaurants.json').then((response) => {
    if (!response.ok) throw new Error('Não foi possível carregar os restaurantes.');
    return response.json();
  });
};

export async function fetchRestaurantDetails(restaurantId) {
  const detailsResponse = await fetch(`/restaurantDetails${restaurantId}.json`);
  if (!detailsResponse.ok) {
    throw new Error('Não foi possível carregar os detalhes deste restaurante.');
  }
  const details = await detailsResponse.json();

  const menuResponse = await fetch(`/restaurantMenu${restaurantId}.json`);
  if (!menuResponse.ok) {
    throw new Error('Não foi possível carregar o cardápio deste restaurante.');
  }
  const menu = await menuResponse.json();

  return { details, menu };
}
