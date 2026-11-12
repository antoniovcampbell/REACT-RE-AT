import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { getRestaurantEmoji } from "../restaurantEmoji.js";

const EMOJI_OPTIONS_BY_CUISINE = {
  Italiana: ["🍝", "🍕", "🥘", "🫒", "🧀"],
  Japonesa: ["🍣", "🍜", "🍱", "🍙", "🍤"],
  Brasileira: ["🍛", "🍲", "🥗", "🧀", "🍖"],
  "Fast Food": ["🍔", "🍟", "🌭", "🥤", "🍕"],
  Mexicana: ["🌮", "🌯", "🫔", "🌶️", "🌽"],
};

function getInitialFormData(restaurant) {
  if (!restaurant) {
    return {
      name: "",
      cuisine: "Italiana",
      description: "",
      isOpen: true,
      emoji: EMOJI_OPTIONS_BY_CUISINE.Italiana[0],
    };
  }

  return {
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    description: restaurant.description,
    isOpen: restaurant.isOpen,
    emoji: getRestaurantEmoji(restaurant),
  };
}

function createDishId() {
  return `n${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function parseDishPrice(price) {
  return Number(String(price ?? "").trim().replace(",", "."));
}

function isBlankDish(dish) {
  return (
    !String(dish.name ?? "").trim() &&
    !String(dish.price ?? "").trim() &&
    !String(dish.category ?? "").trim()
  );
}

function sanitizeMenu(items) {
  return items
    .filter((dish) => !isBlankDish(dish))
    .map((dish) => ({
      id: dish.id,
      name: String(dish.name).trim(),
      category: String(dish.category ?? "").trim(),
      price: parseDishPrice(dish.price),
    }));
}

export default function RestaurantForm({
  initialRestaurant = null,
  initialMenu = [],
  onSubmit,
  onClose,
}) {
  const [formData, setFormData] = useState(() =>
    getInitialFormData(initialRestaurant),
  );
  const [menuItems, setMenuItems] = useState(initialMenu);
  const [menuChanged, setMenuChanged] = useState(false);
  const [menuError, setMenuError] = useState("");

  useEffect(() => {
    if (!menuChanged) setMenuItems(initialMenu);
  }, [initialMenu, menuChanged]);

  function addMenuItem() {
    setMenuChanged(true);
    setMenuError("");
    setMenuItems((current) => [
      ...current,
      { id: createDishId(), name: "", category: "", price: "" },
    ]);
  }

  function updateMenuItem(dishId, field, value) {
    setMenuChanged(true);
    setMenuError("");
    setMenuItems((current) =>
      current.map((dish) => (dish.id === dishId ? { ...dish, [field]: value } : dish)),
    );
  }

  function removeMenuItem(dishId) {
    setMenuChanged(true);
    setMenuError("");
    setMenuItems((current) => current.filter((dish) => dish.id !== dishId));
  }

  function updateField(event) {
    const { name, value, type, checked } = event.target;

    if (name === "cuisine") {
      setFormData((current) => {
        const cuisineEmojis = EMOJI_OPTIONS_BY_CUISINE[value];
        return {
          ...current,
          cuisine: value,
          emoji: cuisineEmojis.includes(current.emoji)
            ? current.emoji
            : cuisineEmojis[0],
        };
      });
      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (menuChanged) {
      const hasInvalidDish = menuItems.some((dish) => {
        if (isBlankDish(dish)) return false;
        const name = String(dish.name ?? "").trim();
        const price = parseDishPrice(dish.price);
        return !name || !Number.isFinite(price) || price < 0;
      });
      if (hasInvalidDish) {
        setMenuError(
          "Preencha nome e preço de todos os pratos ou remova as linhas incompletas.",
        );
        return;
      }
    }

    const cuisineEmojis = EMOJI_OPTIONS_BY_CUISINE[formData.cuisine];
    const emoji = cuisineEmojis.includes(formData.emoji)
      ? formData.emoji
      : cuisineEmojis[0];
    const payload = {
      ...formData,
      emoji,
      lastUpdate: new Date().toISOString(),
    };
    if (menuChanged) payload.menu = sanitizeMenu(menuItems);
    onSubmit(payload);
  }

  const emojiOptions = EMOJI_OPTIONS_BY_CUISINE[formData.cuisine];

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="form-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="form-title"
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">
              {initialRestaurant
                ? "ATUALIZE AS INFORMAÇÕES"
                : "NOVO NO FLAVORDASH"}
            </span>
            <h2 id="form-title">
              {initialRestaurant
                ? "Editar restaurante"
                : "Cadastre um restaurante"}
            </h2>
          </div>
          <button
            className="icon-control close-modal"
            onClick={onClose}
            aria-label="Fechar formulário"
          >
            <X size={19} />
          </button>
        </div>
        <p className="modal-intro">
          Compartilhe um lugar delicioso com a comunidade.
        </p>
        <form onSubmit={handleSubmit} className="restaurant-form">
          <label>
            Nome do restaurante
            <input
              name="name"
              value={formData.name}
              onChange={updateField}
              placeholder="Ex.: Cantina da Praça"
              required
              maxLength={60}
            />
          </label>
          <label>
            Tipo de cozinha
            <select
              name="cuisine"
              value={formData.cuisine}
              onChange={updateField}
            >
              <option>Italiana</option>
              <option>Japonesa</option>
              <option>Brasileira</option>
              <option>Fast Food</option>
              <option>Mexicana</option>
            </select>
          </label>
          <label>
            Descrição
            <textarea
              name="description"
              value={formData.description}
              onChange={updateField}
              placeholder="O que torna esse lugar especial?"
              required
              rows="3"
              maxLength={180}
            />
          </label>
          <fieldset className="emoji-picker">
            <legend>Escolha um emoji</legend>
            <div className="emoji-options">
              {emojiOptions.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`emoji-option ${formData.emoji === emoji ? "selected" : ""}`}
                  onClick={() =>
                    setFormData((current) => ({ ...current, emoji }))
                  }
                  aria-label={`Escolher emoji ${emoji}`}
                  aria-pressed={formData.emoji === emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset className="menu-editor">
            <legend>Cardápio</legend>
            <p className="menu-editor-hint">
              Adicione, edite ou remova os pratos deste restaurante.
            </p>
            {menuItems.length ? (
              <ul className="menu-editor-list">
                {menuItems.map((dish) => (
                  <li className="menu-editor-row" key={dish.id}>
                    <input
                      value={dish.name}
                      onChange={(event) =>
                        updateMenuItem(dish.id, "name", event.target.value)
                      }
                      placeholder="Nome do prato"
                      aria-label="Nome do prato"
                      maxLength={60}
                    />
                    <input
                      value={dish.category}
                      onChange={(event) =>
                        updateMenuItem(dish.id, "category", event.target.value)
                      }
                      placeholder="Categoria"
                      aria-label="Categoria do prato"
                      maxLength={40}
                    />
                    <input
                      className="menu-editor-price"
                      type="number"
                      min="0"
                      step="any"
                      value={dish.price}
                      onChange={(event) =>
                        updateMenuItem(dish.id, "price", event.target.value)
                      }
                      placeholder="Preço"
                      aria-label="Preço do prato"
                    />
                    <button
                      type="button"
                      className="menu-editor-remove"
                      onClick={() => removeMenuItem(dish.id)}
                      aria-label={`Remover ${dish.name || "prato"}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="menu-editor-empty">
                Nenhum prato no cardápio ainda.
              </p>
            )}
            <button
              type="button"
              className="menu-editor-add"
              onClick={addMenuItem}
            >
              <Plus size={13} /> Adicionar prato
            </button>
            {menuError && <p className="menu-editor-error">{menuError}</p>}
          </fieldset>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="isOpen"
              checked={formData.isOpen}
              onChange={updateField}
            />{" "}
            Está aberto agora
          </label>
          <div className="form-actions">
            <button
              type="button"
              className="button button-light"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button type="submit" className="button button-primary">
              <Plus size={16} />{" "}
              {initialRestaurant
                ? "Salvar alterações"
                : "Adicionar restaurante"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
