import React from 'react';
import './MovieFilters.css';

interface MovieFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedYear: string;
  onYearChange: (year: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onApplyFilters: () => void;
}

const MovieFilters: React.FC<MovieFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedYear,
  onYearChange,
  sortBy,
  onSortChange,
  onApplyFilters
}) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const sortOptions = [
    { value: 'popularity.desc', label: 'Mais Populares' },
    { value: 'popularity.asc', label: 'Menos Populares' },
    { value: 'vote_average.desc', label: 'Melhor Avaliados' },
    { value: 'vote_average.asc', label: 'Pior Avaliados' },
    { value: 'release_date.desc', label: 'Mais Recentes' },
    { value: 'release_date.asc', label: 'Mais Antigos' },
    { value: 'title.asc', label: 'A-Z' },
    { value: 'title.desc', label: 'Z-A' }
  ];

  return (
    <div className="movie-filters">
      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Buscar filmes..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search"
              onClick={() => onSearchChange('')}
              aria-label="Limpar busca"
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="year-select">Ano:</label>
          <select 
            id="year-select"
            value={selectedYear} 
            onChange={(e) => onYearChange(e.target.value)}
            className="filter-select"
          >
            <option value="">Todos os anos</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sort-select">Ordenar por:</label>
          <select 
            id="sort-select"
            value={sortBy} 
            onChange={(e) => onSortChange(e.target.value)}
            className="filter-select"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button 
          className="apply-filters-btn"
          onClick={onApplyFilters}
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};

export default MovieFilters;
