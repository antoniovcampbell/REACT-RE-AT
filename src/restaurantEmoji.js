const EMOJI_BY_RESTAURANT_ID = {
  1: "🍝",
  2: "🍣",
  3: "🍛",
  4: "🍔",
  5: "🥗",
  6: "🍕",
  7: "🍜",
  8: "🍟",
  9: "🥘",
  10: "🫒",
  11: "🍱",
  12: "🍜",
  13: "🍲",
  14: "🧀",
  15: "🍔",
  16: "🌭",
  17: "🌮",
  18: "🌯",
  19: "🫔",
  20: "🌶️",
};

const DEFAULT_EMOJI_BY_CUISINE = {
  Italiana: "🍝",
  Japonesa: "🍣",
  Brasileira: "🍲",
  "Fast Food": "🍔",
  Mexicana: "🌮",
};

export function getRestaurantEmoji(restaurant) {
  return (
    restaurant.emoji ??
    EMOJI_BY_RESTAURANT_ID[restaurant.id] ??
    DEFAULT_EMOJI_BY_CUISINE[restaurant.cuisine] ??
    "🍽️"
  );
}
