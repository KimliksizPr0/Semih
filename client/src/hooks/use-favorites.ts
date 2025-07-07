import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  const toggleFavorite = (projectId: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId];
      
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const isFavorite = (projectId: number) => favorites.includes(projectId);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}
