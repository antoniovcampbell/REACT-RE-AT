import { ArrowDownWideNarrow, ChevronDown } from 'lucide-react';

export default function SortControls({ sortBy, setSortBy, sortDirection, setSortDirection }) {
  return (
    <div className="sort-controls">
      <label htmlFor="sortBy">Ordenar por</label>
      <div className="sort-select-wrap">
        <select id="sortBy" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
          <option value="recommended">Recomendados</option>
          <option value="name">Nome</option>
          <option value="cuisine">Tipo de cozinha</option>
          <option value="lastUpdate">Última atualização</option>
          <option value="status">Funcionamento</option>
          <option value="menuCount">Quantidade de pratos</option>
        </select>
        <ChevronDown size={15} />
      </div>
      <button className="icon-control" onClick={() => setSortDirection((direction) => direction === 'asc' ? 'desc' : 'asc')} aria-label={`Alternar ordem ${sortDirection === 'asc' ? 'decrescente' : 'crescente'}`}>
        <ArrowDownWideNarrow size={17} className={sortDirection === 'asc' ? 'sort-reverse' : ''} />
      </button>
    </div>
  );
}
