import { useEffect, useMemo, useState } from 'react';
import { RESTAURANT_PAGE_SIZE } from '../constants/restaurant.js';

function getMenuAveragePrice(restaurantId, detailsById) {
  const menu = detailsById[restaurantId]?.menu ?? [];
  if (!menu.length) return null;
  return menu.reduce((total, dish) => total + Number(dish.price || 0), 0) / menu.length;
}

function matchesPriceRange(averagePrice, selectedRange) {
  if (selectedRange === 'all') return true;
  if (averagePrice === null) return false;
  if (selectedRange === 'under30') return averagePrice <= 30;
  if (selectedRange === '30to50') return averagePrice > 30 && averagePrice <= 50;
  if (selectedRange === 'over50') return averagePrice > 50;
  return true;
}

function compareRestaurants(first, second, sortBy, detailsById) {
  switch (sortBy) {
    case 'name': return first.name.localeCompare(second.name, 'pt-BR');
    case 'cuisine': return first.cuisine.localeCompare(second.cuisine, 'pt-BR');
    case 'lastUpdate': return new Date(first.lastUpdate) - new Date(second.lastUpdate);
    case 'status': return Number(first.isOpen) - Number(second.isOpen);
    case 'menuCount': return (detailsById[first.id]?.menu?.length || 0) - (detailsById[second.id]?.menu?.length || 0);
    default: return Number(second.isOpen) - Number(first.isOpen)
      || (detailsById[second.id]?.details?.rating || 0) - (detailsById[first.id]?.details?.rating || 0);
  }
}

export function useRestaurantDiscovery({ restaurants, detailsById, favorites, favoritesOnly }) {
  const [cuisine, setCuisine] = useState('Todos');
  const [status, setStatus] = useState('all');
  const [price, setPrice] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRestaurants = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLocaleLowerCase('pt-BR');
    const filtered = restaurants.filter((restaurant) => {
      const fields = [restaurant.name, restaurant.cuisine, restaurant.description];
      const matchesSearch = !normalizedQuery || fields.some((field) => field?.toLocaleLowerCase('pt-BR').includes(normalizedQuery));
      const matchesCuisine = cuisine === 'Todos' || restaurant.cuisine === cuisine;
      const matchesStatus = status === 'all' || (status === 'open' ? restaurant.isOpen : !restaurant.isOpen);
      const matchesFavorite = !favoritesOnly || favorites.includes(restaurant.id);
      const averageMenuPrice = getMenuAveragePrice(restaurant.id, detailsById);
      return matchesSearch && matchesCuisine && matchesStatus && matchesFavorite
        && matchesPriceRange(averageMenuPrice, price);
    });

    return filtered.sort((first, second) => {
      const comparison = compareRestaurants(first, second, sortBy, detailsById);
      return sortBy !== 'recommended' && sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [restaurants, detailsById, cuisine, status, price, searchTerm, favoritesOnly, favorites, sortBy, sortDirection]);

  useEffect(() => { setCurrentPage(1); }, [cuisine, status, price, searchTerm, favoritesOnly, favorites, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredRestaurants.length / RESTAURANT_PAGE_SIZE));
  const visibleRestaurants = filteredRestaurants.slice((currentPage - 1) * RESTAURANT_PAGE_SIZE, currentPage * RESTAURANT_PAGE_SIZE);

  return {
    cuisine, setCuisine,
    status, setStatus,
    price, setPrice,
    searchTerm, setSearchTerm,
    sortBy, setSortBy,
    sortDirection, setSortDirection,
    currentPage, setCurrentPage,
    totalPages,
    filteredRestaurants,
    visibleRestaurants,
  };
}
