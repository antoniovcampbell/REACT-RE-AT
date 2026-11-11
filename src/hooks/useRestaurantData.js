import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchRestaurantDetails,
  fetchRestaurantsData,
} from "../services/restaurantApi.js";
import {
  readRestaurantChanges,
  saveRestaurantChanges,
} from "../services/restaurantStorage.js";

function emptyDetailsFor(restaurant) {
  return {
    details: {
      id: restaurant.id,
      name: restaurant.name,
      address: "Endereço informado pelo restaurante",
      phone: "Telefone não informado",
      openingHours: "Horário não informado",
      rating: 0,
      deliveryTime: "30–40 min",
      description: restaurant.description,
    },
    menu: [],
    loading: false,
    error: "",
  };
}

export function useRestaurantData() {
  const [restaurants, setRestaurants] = useState([]);
  const [detailsById, setDetailsById] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const nextIdRef = useRef(1);

  useEffect(() => {
    let isCurrent = true;

    fetchRestaurantsData()
      .then((sourceRestaurants) => {
        if (!isCurrent) return;

        const changes = readRestaurantChanges();
        const deletedIds = new Set(changes.deleted);
        const updatedById = new Map(
          Object.entries(changes.updated).map(([id, restaurant]) => [
            Number(id),
            restaurant,
          ]),
        );
        const baseRestaurants = sourceRestaurants
          .filter((restaurant) => !deletedIds.has(restaurant.id))
          .map((restaurant) => updatedById.get(restaurant.id) ?? restaurant);
        const createdRestaurants = changes.added.filter(
          (restaurant) => !deletedIds.has(restaurant.id),
        );
        const restaurantsWithChanges = [
          ...createdRestaurants,
          ...baseRestaurants,
        ];
        const allIds = [
          ...sourceRestaurants,
          ...changes.added,
          ...Object.values(changes.updated),
        ]
          .map((restaurant) => Number(restaurant.id))
          .concat(changes.deleted.map(Number));

        nextIdRef.current = Math.max(nextIdRef.current, ...allIds) + 1;
        setRestaurants(restaurantsWithChanges);

        const createdIds = new Set(
          createdRestaurants.map((restaurant) => restaurant.id),
        );
        setDetailsById(
          Object.fromEntries(
            restaurantsWithChanges.map((restaurant) => [
              restaurant.id,
              createdIds.has(restaurant.id)
                ? emptyDetailsFor(restaurant)
                : { loading: true, details: null, menu: [], error: "" },
            ]),
          ),
        );

        Promise.all(
          baseRestaurants.map(async (restaurant) => {
            try {
              const result = await fetchRestaurantDetails(restaurant.id);
              const savedRestaurant =
                readRestaurantChanges().updated[restaurant.id];
              return [
                restaurant.id,
                {
                  ...result,
                  details: {
                    ...result.details,
                    name: savedRestaurant?.name ?? result.details.name,
                    description:
                      savedRestaurant?.description ??
                      result.details.description,
                  },
                  loading: false,
                  error: "",
                },
              ];
            } catch (detailsError) {
              return [
                restaurant.id,
                {
                  details: null,
                  menu: [],
                  loading: false,
                  error: detailsError.message || "Erro ao carregar dados.",
                },
              ];
            }
          }),
        ).then((entries) => {
          if (isCurrent)
            setDetailsById((current) => ({
              ...current,
              ...Object.fromEntries(entries),
            }));
        });
      })
      .catch((fetchError) => {
        if (isCurrent)
          setError(
            fetchError.message || "Ocorreu um erro ao buscar os restaurantes.",
          );
      })
      .finally(() => {
        if (isCurrent) setIsLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const addRestaurant = useCallback((restaurant) => {
    const newRestaurant = { ...restaurant, id: nextIdRef.current };
    nextIdRef.current += 1;

    setRestaurants((current) => [newRestaurant, ...current]);
    setDetailsById((current) => ({
      ...current,
      [newRestaurant.id]: emptyDetailsFor(newRestaurant),
    }));
    const changes = readRestaurantChanges();
    saveRestaurantChanges({
      ...changes,
      added: [newRestaurant, ...changes.added],
    });
    return newRestaurant;
  }, []);

  const updateRestaurant = useCallback(
    (restaurantId, updates) => {
      const currentRestaurant = restaurants.find(
        (restaurant) => restaurant.id === restaurantId,
      );
      if (!currentRestaurant) return null;

      const updatedRestaurant = {
        ...currentRestaurant,
        ...updates,
        id: restaurantId,
      };
      setRestaurants((current) =>
        current.map((restaurant) =>
          restaurant.id === restaurantId ? updatedRestaurant : restaurant,
        ),
      );
      setDetailsById((current) => {
        const currentDetails = current[restaurantId];
        if (!currentDetails?.details) return current;
        return {
          ...current,
          [restaurantId]: {
            ...currentDetails,
            details: {
              ...currentDetails.details,
              name: updatedRestaurant.name,
              description: updatedRestaurant.description,
            },
          },
        };
      });

      const changes = readRestaurantChanges();
      const isCreatedHere = changes.added.some(
        (restaurant) => restaurant.id === restaurantId,
      );
      if (isCreatedHere) {
        saveRestaurantChanges({
          ...changes,
          added: changes.added.map((restaurant) =>
            restaurant.id === restaurantId ? updatedRestaurant : restaurant,
          ),
        });
      } else {
        saveRestaurantChanges({
          ...changes,
          updated: { ...changes.updated, [restaurantId]: updatedRestaurant },
        });
      }

      return updatedRestaurant;
    },
    [restaurants],
  );

  const deleteRestaurant = useCallback(
    (restaurantId) => {
      const exists = restaurants.some(
        (restaurant) => restaurant.id === restaurantId,
      );
      if (!exists) return;

      setRestaurants((current) =>
        current.filter((restaurant) => restaurant.id !== restaurantId),
      );
      setDetailsById((current) => {
        const remaining = { ...current };
        delete remaining[restaurantId];
        return remaining;
      });

      const changes = readRestaurantChanges();
      const wasCreatedHere = changes.added.some(
        (restaurant) => restaurant.id === restaurantId,
      );
      const remainingUpdates = { ...changes.updated };
      delete remainingUpdates[restaurantId];
      saveRestaurantChanges({
        added: wasCreatedHere
          ? changes.added.filter((restaurant) => restaurant.id !== restaurantId)
          : changes.added,
        updated: remainingUpdates,
        deleted:
          wasCreatedHere || changes.deleted.includes(restaurantId)
            ? changes.deleted
            : [...changes.deleted, restaurantId],
      });
    },
    [restaurants],
  );

  return {
    restaurants,
    detailsById,
    isLoading,
    error,
    addRestaurant,
    updateRestaurant,
    deleteRestaurant,
  };
}
