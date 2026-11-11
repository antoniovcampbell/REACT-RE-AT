import { useEffect, useState } from 'react';

const STORAGE_KEY = 'flavordash-favorites';

function readFavorites() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(readFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Favoritos continuam disponíveis enquanto a aplicação estiver aberta.
    }
  }, [favorites]);

  function toggleFavorite(id) {
    setFavorites((current) => current.includes(id)
      ? current.filter((favoriteId) => favoriteId !== id)
      : [...current, id]);
  }

  return { favorites, toggleFavorite };
}
