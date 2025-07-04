import React, { useState, useEffect } from 'react';
import type { MovieDetails, Credits, VideosResponse } from '../services/tmdbApi';
import { tmdbApi } from '../services/tmdbApi';
import './MovieDetailsModal.css';

interface MovieDetailsModalProps {
  movieId: number;
  onClose: () => void;
}

const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({ movieId, onClose }) => {
  const [movieDetails, setMovieDetails] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [videos, setVideos] = useState<VideosResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'cast' | 'videos'>('overview');

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const [detailsResponse, creditsResponse, videosResponse] = await Promise.all([
          tmdbApi.getMovieDetails(movieId),
          tmdbApi.getMovieCredits(movieId),
          tmdbApi.getMovieVideos(movieId)
        ]);

        setMovieDetails(detailsResponse);
        setCredits(creditsResponse);
        setVideos(videosResponse);
      } catch (error) {
        console.error('Erro ao carregar dados do filme:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId]);

  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTrailer = () => {
    if (!videos?.results) return null;
    return videos.results.find(video => 
      video.type === 'Trailer' && video.site === 'YouTube'
    ) || videos.results.find(video => video.site === 'YouTube');
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content loading">
          <div className="loading-spinner">Carregando...</div>
        </div>
      </div>
    );
  }

  if (!movieDetails) {
    return (
      <div className="modal-overlay">
        <div className="modal-content error">
          <p>Erro ao carregar detalhes do filme</p>
          <button onClick={onClose}>Fechar</button>
        </div>
      </div>
    );
  }

  const trailer = getTrailer();
  const director = credits?.crew.find(person => person.job === 'Director');
  const mainCast = credits?.cast.slice(0, 10) || [];

  return (
    <div className="modal-overlay">
      <button 
        className="modal-backdrop" 
        onClick={onClose}
        aria-label="Fechar modal"
      />
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <div className="movie-hero">
          {movieDetails.backdrop_path && (
            <div 
              className="backdrop"
              style={{
                backgroundImage: `url(${tmdbApi.getImageUrl(movieDetails.backdrop_path, 'w1280')})`
              }}
            />
          )}
          <div className="hero-content">
            <div className="poster-container">
              {movieDetails.poster_path ? (
                <img
                  src={tmdbApi.getImageUrl(movieDetails.poster_path, 'w500')}
                  alt={movieDetails.title}
                  className="poster"
                />
              ) : (
                <div className="poster-placeholder">
                  <span>🎬</span>
                </div>
              )}
            </div>
            <div className="movie-info">
              <h1>{movieDetails.title}</h1>
              {movieDetails.tagline && <p className="tagline">{movieDetails.tagline}</p>}
              
              <div className="movie-meta">
                <span className="rating">⭐ {movieDetails.vote_average.toFixed(1)}</span>
                <span className="year">{new Date(movieDetails.release_date).getFullYear()}</span>
                <span className="runtime">{formatRuntime(movieDetails.runtime)}</span>
              </div>

              <div className="genres">
                {movieDetails.genres.map(genre => (
                  <span key={genre.id} className="genre-tag">{genre.name}</span>
                ))}
              </div>

              {director && (
                <p className="director">
                  <strong>Diretor:</strong> {director.name}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="movie-details-tabs">
          <div className="tab-buttons">
            <button 
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => setActiveTab('overview')}
            >
              Sinopse
            </button>
            <button 
              className={activeTab === 'cast' ? 'active' : ''}
              onClick={() => setActiveTab('cast')}
            >
              Elenco
            </button>
            <button 
              className={activeTab === 'videos' ? 'active' : ''}
              onClick={() => setActiveTab('videos')}
            >
              Trailer
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <p className="overview">{movieDetails.overview}</p>
                
                <div className="additional-info">
                  <div className="info-row">
                    <strong>Status:</strong> {movieDetails.status}
                  </div>
                  <div className="info-row">
                    <strong>Data de Lançamento:</strong> {new Date(movieDetails.release_date).toLocaleDateString('pt-BR')}
                  </div>
                  {movieDetails.budget > 0 && (
                    <div className="info-row">
                      <strong>Orçamento:</strong> {formatMoney(movieDetails.budget)}
                    </div>
                  )}
                  {movieDetails.revenue > 0 && (
                    <div className="info-row">
                      <strong>Bilheteria:</strong> {formatMoney(movieDetails.revenue)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'cast' && (
              <div className="cast-tab">
                <div className="cast-grid">
                  {mainCast.map(actor => (
                    <div key={actor.id} className="cast-member">
                      {actor.profile_path ? (
                        <img
                          src={tmdbApi.getImageUrl(actor.profile_path, 'w185')}
                          alt={actor.name}
                          className="actor-photo"
                        />
                      ) : (
                        <div className="actor-photo-placeholder">
                          <span>👤</span>
                        </div>
                      )}
                      <div className="actor-info">
                        <h4>{actor.name}</h4>
                        <p>{actor.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="videos-tab">
                {trailer ? (
                  <div className="trailer-container">
                    <iframe
                      width="100%"
                      height="400"
                      src={`https://www.youtube.com/embed/${trailer.key}`}
                      title={trailer.name}
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  <p>Nenhum trailer disponível</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
