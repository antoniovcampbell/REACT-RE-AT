import { ChevronDown, SlidersHorizontal } from 'lucide-react';

const CUISINES = ['Todos', 'Italiana', 'Japonesa', 'Brasileira', 'Fast Food', 'Mexicana'];

export default function FilterBar({ cuisine, setCuisine, status, setStatus, price, setPrice }) {
  return (
    <section className="filter-panel" aria-label="Filtros de restaurantes">
      <div className="filter-heading"><span className="filter-icon"><SlidersHorizontal size={17} /></span><span>Filtros</span></div>
      <div className="filter-group cuisine-filter">
        <span className="filter-label">Tipo de cozinha</span>
        <div className="chips">
          {CUISINES.map((item) => <button key={item} className={`chip ${cuisine === item ? 'chip-active' : ''}`} onClick={() => setCuisine(item)}>{item}</button>)}
        </div>
      </div>
      <label className="select-filter">
        <span className="filter-label">Funcionamento</span>
        <span className="select-wrap"><select value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">Qualquer status</option><option value="open">Abertos agora</option><option value="closed">Fechados</option></select><ChevronDown size={15} /></span>
      </label>
      <label className="select-filter price-filter">
        <span className="filter-label">Preço médio</span>
        <span className="select-wrap"><select value={price} onChange={(event) => setPrice(event.target.value)}><option value="all">Qualquer preço</option><option value="under30">Até R$ 30</option><option value="30to50">R$ 31–50</option><option value="over50">Acima de R$ 50</option></select><ChevronDown size={15} /></span>
      </label>
    </section>
  );
}
