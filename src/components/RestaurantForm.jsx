import { useState } from "react";
import { Plus, X } from "lucide-react";
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

export default function RestaurantForm({
  initialRestaurant = null,
  onSubmit,
  onClose,
}) {
  const [formData, setFormData] = useState(() =>
    getInitialFormData(initialRestaurant),
  );

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
    const cuisineEmojis = EMOJI_OPTIONS_BY_CUISINE[formData.cuisine];
    const emoji = cuisineEmojis.includes(formData.emoji)
      ? formData.emoji
      : cuisineEmojis[0];
    onSubmit({ ...formData, emoji, lastUpdate: new Date().toISOString() });
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
