import { useState, useEffect } from 'react'
import type { Movie } from './services/tmdbApi'
import { tmdbApi } from './services/tmdbApi'
import MovieFilters from './components/MovieFilters'
import MovieDetailsModal from './components/MovieDetailsModal'
import './App.css'

function App() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedYear, setSelectedYear] = useState('')
  const [sortBy, setSortBy] = useState('popularity.desc')
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchMovies = async (page: number = 1) => {
    try {
      setLoading(true)
      let response

      if (searchQuery.trim()) {
        response = await tmdbApi.searchMovies(searchQuery, page)
      } else {
        const filterParams = {
          page,
          sortBy,
          ...(selectedYear && { primaryReleaseYear: parseInt(selectedYear) })
        }
        response = await tmdbApi.discoverMovies(filterParams)
      }

      if (page === 1) {
        setMovies(response.results)
      } else {
        setMovies(prev => [...prev, ...response.results])
      }
      
      setTotalPages(response.total_pages)
      setCurrentPage(page)
    } catch (error) {
      console.error('Erro ao buscar filmes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMovies(1)
  }, [])

  const handleApplyFilters = () => {
    setCurrentPage(1)
    fetchMovies(1)
  }

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchMovies(currentPage + 1)
    }
  }

  const handleMovieClick = (movieId: number) => {
    setSelectedMovieId(movieId)
  }

  const handleCloseModal = () => {
    setSelectedMovieId(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>OnMovie</h1>
        <p>Descubra os melhores filmes</p>
      </header>
      
      <main className="app-main">
        <MovieFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedYear={selectedYear}
          onYearChange={setSelectedYear}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onApplyFilters={handleApplyFilters}
        />

        {loading && movies.length === 0 ? (
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Carregando filmes...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="movies-container">
              <div className="movies-count">
                <p>{movies.length} filmes encontrados</p>
              </div>
              
              <div className="movies-grid">
                {movies.map(movie => (
                  <div 
                    key={movie.id} 
                    className="movie-card"
                    onClick={() => handleMovieClick(movie.id)}
                  >
                    <div className="movie-poster-container">
                      {movie.poster_path ? (
                        <img
                          src={tmdbApi.getImageUrl(movie.poster_path, 'w500')}
                          alt={movie.title}
                          className="movie-poster"
                          loading="lazy"
                        />
                      ) : (
                        <div className="movie-poster-placeholder">
                          <span>🎬</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="movie-info">
                      <h3 className="movie-title">{movie.title}</h3>
                      <div className="movie-meta">
                        <span className="movie-year">
                          {new Date(movie.release_date).getFullYear()}
                        </span>
                        <span className="movie-rating">
                          ⭐ {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                      <p className="movie-overview">
                        {movie.overview.length > 100 
                          ? `${movie.overview.substring(0, 100)}...`
                          : movie.overview
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {currentPage < totalPages && (
                <div className="load-more-container">
                  <button 
                    className="load-more-btn"
                    onClick={handleLoadMore}
                    disabled={loading}
                  >
                    {loading ? 'Carregando...' : 'Carregar Mais'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {selectedMovieId && (
        <MovieDetailsModal
          movieId={selectedMovieId}
          onClose={handleCloseModal}
        />
      )}
    </div>
  )
}

export default App
