import { Plus, Star, UtensilsCrossed } from "lucide-react";

export default function Header({
  favoritesOnly,
  onFavorites,
  onAdd,
  disabled = false,
}) {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="FlavorDash início">
        <span className="brand-mark">
          <UtensilsCrossed size={19} />
        </span>
        <span>
          flavor<span className="brand-accent">dash</span>
        </span>
      </a>
      <nav className="topnav" aria-label="Navegação principal">
        <a className="nav-link active" href="#restaurants">
          Explorar
        </a>
        <button
          className={`nav-link favorite-nav ${favoritesOnly ? "selected" : ""}`}
          onClick={onFavorites}
        >
          <Star size={16} fill={favoritesOnly ? "currentColor" : "none"} />{" "}
          Favoritos
        </button>
      </nav>
      <button
        className="button button-primary header-add"
        onClick={onAdd}
        disabled={disabled}
      >
        <Plus size={17} /> Cadastrar restaurante
      </button>
    </header>
  );
}
