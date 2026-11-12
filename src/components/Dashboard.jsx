import { useState } from "react";
import { Filter, Plus, Search, UtensilsCrossed, X } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites.js";
import { useRestaurantData } from "../hooks/useRestaurantData.js";
import { useRestaurantDiscovery } from "../hooks/useRestaurantDiscovery.js";
import FilterBar from "./FilterBar.jsx";
import Header from "./Header.jsx";
import Hero from "./Hero.jsx";
import Pagination from "./Pagination.jsx";
import RestaurantForm from "./RestaurantForm.jsx";
import RestaurantList from "./RestaurantList.jsx";
import SortControls from "./SortControls.jsx";

const EMPTY_MENU = [];

export default function Dashboard({ isFormVisible, toggleForm }) {
  const [editingRestaurant, setEditingRestaurant] = useState(null);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const {
    restaurants,
    detailsById,
    isLoading,
    error,
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
  } = useRestaurantData();
  const { favorites, toggleFavorite } = useFavorites();
  const discovery = useRestaurantDiscovery({
    restaurants,
    detailsById,
    favorites,
    favoritesOnly,
  });
  const openCount = restaurants.filter(
    (restaurant) => restaurant.isOpen,
  ).length;

  function openCreateForm() {
    setEditingRestaurant(null);
    toggleForm(true);
  }

  function openEditForm(restaurantId) {
    const restaurant = restaurants.find((item) => item.id === restaurantId);
    if (!restaurant) return;
    setEditingRestaurant(restaurant);
    toggleForm(true);
  }

  function handleSaveRestaurant(restaurant) {
    if (editingRestaurant) updateRestaurant(editingRestaurant.id, restaurant);
    else addRestaurant(restaurant);
    toggleForm(false);
    setEditingRestaurant(null);
    discovery.setCurrentPage(1);
  }

  function handleDeleteRestaurant(restaurantId) {
    deleteRestaurant(restaurantId);
    if (editingRestaurant?.id === restaurantId) {
      toggleForm(false);
      setEditingRestaurant(null);
    }
  }

  return (
    <div id="top" className="app-shell">
      <Header
        favoritesOnly={favoritesOnly}
        onFavorites={() => setFavoritesOnly((value) => !value)}
        onAdd={openCreateForm}
        disabled={isLoading}
      />
      <main>
        <Hero restaurantCount={restaurants.length} openCount={openCount} />
        <section id="restaurants" className="discovery-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow section-eyebrow">
                UM MUNDO DE SABORES
              </span>
              <h2>
                {favoritesOnly ? "Seus favoritos" : "Explore restaurantes"}
              </h2>
              <p>Escolha seu próximo lugar favorito.</p>
            </div>
            <button
              className="button button-outline mobile-add"
              onClick={openCreateForm}
              disabled={isLoading}
            >
              <Plus size={16} /> Adicionar
            </button>
          </div>
          <div className="search-row">
            <label className="search-box">
              <Search size={19} />
              <input
                type="search"
                value={discovery.searchTerm}
                onChange={(event) =>
                  discovery.setSearchTerm(event.target.value)
                }
                placeholder="Busque por restaurante, cozinha ou prato…"
                aria-label="Buscar restaurantes"
              />
              {discovery.searchTerm && (
                <button
                  onClick={() => discovery.setSearchTerm("")}
                  aria-label="Limpar busca"
                >
                  <X size={16} />
                </button>
              )}
              <kbd>⌘ K</kbd>
            </label>
            <span className="results-caption">
              <Filter size={15} />
              {discovery.filteredRestaurants.length} resultados
            </span>
          </div>
          <FilterBar
            cuisine={discovery.cuisine}
            setCuisine={discovery.setCuisine}
            status={discovery.status}
            setStatus={discovery.setStatus}
            price={discovery.price}
            setPrice={discovery.setPrice}
          />
          <div className="list-toolbar">
            <div className="results-title">
              <h3>
                {favoritesOnly
                  ? "Sua seleção especial"
                  : "Restaurantes para você"}
              </h3>
              <span>{discovery.filteredRestaurants.length} lugares</span>
            </div>
            <SortControls
              sortBy={discovery.sortBy}
              setSortBy={discovery.setSortBy}
              sortDirection={discovery.sortDirection}
              setSortDirection={discovery.setSortDirection}
            />
          </div>
          {isLoading ? (
            <div className="loading-state">
              <span className="spinner" />
              <p>Encontrando sabores perto de você…</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <span>⚠️</span>
              <h3>Não foi possível carregar</h3>
              <p>{error}</p>
              <button
                className="button button-primary"
                onClick={() => window.location.reload()}
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <>
              <RestaurantList
                restaurants={discovery.visibleRestaurants}
                detailsById={detailsById}
                favorites={favorites}
                onFavorite={toggleFavorite}
                onEdit={openEditForm}
                onDelete={handleDeleteRestaurant}
              />
              <Pagination
                itemCount={discovery.filteredRestaurants.length}
                currentPage={discovery.currentPage}
                totalPages={discovery.totalPages}
                onPageChange={discovery.setCurrentPage}
              />
            </>
          )}
        </section>
      </main>
      <footer className="footer">
        <a className="brand footer-brand" href="#top">
          <span className="brand-mark">
            <UtensilsCrossed size={16} />
          </span>
          <span>
            flavor<span className="brand-accent">dash</span>
          </span>
        </a>
        <span>Descubra bons momentos, um prato de cada vez.</span>
        <span>© 2026 FlavorDash</span>
      </footer>
      {isFormVisible && (
        <RestaurantForm
          key={editingRestaurant?.id ?? "new"}
          initialRestaurant={editingRestaurant}
          initialMenu={
            editingRestaurant
              ? (detailsById[editingRestaurant.id]?.menu ?? EMPTY_MENU)
              : EMPTY_MENU
          }
          onSubmit={handleSaveRestaurant}
          onClose={() => toggleForm(false)}
        />
      )}
    </div>
  );
}
