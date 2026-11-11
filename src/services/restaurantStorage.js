const STORAGE_KEY = "flavordash-restaurant-changes";

const EMPTY_CHANGES = { added: [], updated: {}, deleted: [] };

export function readRestaurantChanges() {
  try {
    const savedChanges = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "null",
    );
    if (!savedChanges || typeof savedChanges !== "object") return EMPTY_CHANGES;

    return {
      added: Array.isArray(savedChanges.added) ? savedChanges.added : [],
      updated:
        savedChanges.updated && typeof savedChanges.updated === "object"
          ? savedChanges.updated
          : {},
      deleted: Array.isArray(savedChanges.deleted) ? savedChanges.deleted : [],
    };
  } catch {
    return EMPTY_CHANGES;
  }
}

export function saveRestaurantChanges(changes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(changes));
  } catch {
    // The current in-memory change remains available if storage is unavailable.
  }
}
