import { useState } from "react";
import {
  ChevronDown,
  Clock3,
  MapPin,
  Pencil,
  Star,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { getRestaurantEmoji } from "../restaurantEmoji.js";

function RestaurantMenu({ menu }) {
  if (!menu.length)
    return <p className="detail-loading">Cardápio não disponível.</p>;
  return menu.map((dish) => (
    <div className="menu-item" key={dish.id}>
      <span>
        {dish.name}
        <small>{dish.category}</small>
      </span>
      <span>R$ {Number(dish.price).toFixed(2).replace(".", ",")}</span>
    </div>
  ));
}

function RestaurantDetails({ details, menu }) {
  return (
    <>
      {details && (
        <>
          <p className="detail-description">{details.description}</p>
          <p className="address">
            <MapPin size={14} />
            {details.address}
          </p>
          <p className="detail-contact">
            {details.phone} · {details.openingHours}
          </p>
        </>
      )}
      <div className="menu-list">
        <strong>Mais pedidos</strong>
        <RestaurantMenu menu={menu} />
      </div>
    </>
  );
}

export default function RestaurantCard({
  id,
  name,
  cuisine,
  isOpen,
  description,
  lastUpdate,
  emoji,
  details,
  favorite,
  onFavorite,
  onEdit,
  onDelete,
}) {
  const [expanded, setExpanded] = useState(false);
  const updateLabel = new Date(lastUpdate).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
  });
  const menu = details?.menu ?? [];
  const averageMenuPrice = menu.length
    ? menu.reduce((total, dish) => total + Number(dish.price || 0), 0) /
      menu.length
    : null;
  const rating = details?.details?.rating;

  return (
    <article className="restaurant-card">
      <div className="restaurant-art">
        <span className="art-emoji" aria-hidden="true">
          {getRestaurantEmoji({ id, cuisine, emoji })}
        </span>
        <span className={`open-badge ${isOpen ? "open" : "closed"}`}>
          <span className="status-dot" />
          {isOpen ? "Aberto" : "Fechado"}
        </span>
        <button
          className={`favorite-button ${favorite ? "is-favorite" : ""}`}
          onClick={() => onFavorite(id)}
          aria-label={
            favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
          aria-pressed={favorite}
        >
          <Star size={18} fill={favorite ? "currentColor" : "none"} />
        </button>
        <span className="cuisine-tag">{cuisine}</span>
      </div>
      <div className="card-body">
        <div className="card-title-row">
          <div>
            <h3>{name}</h3>
            <p className="template-message">{`Restaurante: ${name} - Cozinha: ${cuisine}`}</p>
          </div>
          <span className="rating">
            <Star size={14} fill="currentColor" />
            {rating ? rating.toFixed(1) : "Novo"}
          </span>
        </div>
        <p className="description">{description}</p>
        <div className="card-meta">
          <span>
            <Clock3 size={14} />
            {details?.details?.deliveryTime || "—"}
          </span>
          <span>·</span>
          <span>
            {averageMenuPrice === null
              ? "Preço indisponível"
              : `R$ ${averageMenuPrice.toFixed(0)} preço médio`}
          </span>
        </div>
        <div className="card-footer">
          <span className="menu-count">
            <UtensilsCrossed size={14} />
            {details?.loading
              ? "Carregando cardápio…"
              : `${menu.length} pratos`}
          </span>
          <span className="updated">Atualizado {updateLabel}</span>
        </div>
        {details?.error && <p className="inline-error">{details.error}</p>}
        <button
          className="details-toggle"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
        >
          {expanded ? "Fechar detalhes" : "Ver detalhes e cardápio"}
          <ChevronDown size={15} className={expanded ? "rotate" : ""} />
        </button>
        {expanded && (
          <div className="card-details">
            {details?.loading ? (
              <p className="detail-loading">
                Buscando informações do restaurante…
              </p>
            ) : (
              <RestaurantDetails details={details?.details} menu={menu} />
            )}
          </div>
        )}
        <div className="card-actions">
          <button
            type="button"
            onClick={() => onEdit(id)}
            aria-label={`Editar ${name}`}
          >
            <Pencil size={13} />
            Editar
          </button>
          <button
            type="button"
            onClick={() => onDelete(id)}
            aria-label={`Excluir ${name}`}
          >
            <Trash2 size={13} />
            Excluir
          </button>
        </div>
      </div>
    </article>
  );
}
