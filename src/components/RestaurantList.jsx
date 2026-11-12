import RestaurantCard from "./RestaurantCard.jsx";

export default function RestaurantList({
  restaurants,
  detailsById,
  favorites,
  onFavorite,
  onEdit,
  onDelete,
}) {
  if (!restaurants.length) {
    return (
      <div className="empty-state">
        <span>🔎</span>
        <h3>Nenhum restaurante encontrado</h3>
        <p>Tente alterar sua busca ou os filtros para descobrir mais opções.</p>
      </div>
    );
  }

  return (
    <div className="restaurant-grid">
      {restaurants.map((restaurant) => (
        <RestaurantCard
          key={restaurant.id}
          id={restaurant.id}
          name={restaurant.name}
          cuisine={restaurant.cuisine}
          isOpen={restaurant.isOpen}
          description={restaurant.description}
          lastUpdate={restaurant.lastUpdate}
          emoji={restaurant.emoji}
          details={detailsById[restaurant.id]}
          favorite={favorites.includes(restaurant.id)}
          onFavorite={onFavorite}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
