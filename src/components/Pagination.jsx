import { ArrowLeft, ArrowRight } from 'lucide-react';
import { RESTAURANT_PAGE_SIZE } from '../constants/restaurant.js';

export default function Pagination({ itemCount, currentPage, totalPages, onPageChange }) {
  if (itemCount <= RESTAURANT_PAGE_SIZE) return null;

  const firstItem = (currentPage - 1) * RESTAURANT_PAGE_SIZE + 1;
  const lastItem = Math.min(currentPage * RESTAURANT_PAGE_SIZE, itemCount);

  return (
    <div className="pagination">
      <span>Mostrando <strong>{firstItem}–{lastItem}</strong> de <strong>{itemCount}</strong> restaurantes</span>
      <div className="page-controls">
        <button className="page-button" disabled={currentPage === 1} onClick={() => onPageChange((page) => page - 1)} aria-label="Página anterior"><ArrowLeft size={16} /></button>
        <span className="page-indicator">Página <strong>{currentPage}</strong> de {totalPages}</span>
        <button className="page-button" disabled={currentPage === totalPages} onClick={() => onPageChange((page) => page + 1)} aria-label="Próxima página"><ArrowRight size={16} /></button>
      </div>
    </div>
  );
}
