const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNmU0OGEzMGM4ZWE0NTJjODJiM2FlZGQ5Y2Y4MjY0MyIsIm5iZiI6MTc0MTA0MDAzMC4yNDg5OTk4LCJzdWIiOiI2N2M2Mjk5ZTRiMTYzOTkwNGFlNzg2Y2MiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.xlWGDmsLSEaDg6nHmB0Auh8QtXtGJi4DtpBHVSo_tnc';
const BASE_URL = 'https://api.themoviedb.org/3';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
};

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface ApiResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export const tmdbApi = {
  getPopularMovies: async (page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await fetch(
      `${BASE_URL}/discover/movie?include_adult=false&include_video=false&language=pt-BR&page=${page}&sort_by=popularity.desc`,
      options
    );
    return response.json();
  },

  getNowPlayingMovies: async (page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await fetch(
      `${BASE_URL}/movie/now_playing?language=pt-BR&page=${page}`,
      options
    );
    return response.json();
  },

  getTopRatedMovies: async (page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await fetch(
      `${BASE_URL}/movie/top_rated?language=pt-BR&page=${page}`,
      options
    );
    return response.json();
  },

  getUpcomingMovies: async (page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await fetch(
      `${BASE_URL}/movie/upcoming?language=pt-BR&page=${page}`,
      options
    );
    return response.json();
  },

  getPopularTVShows: async (page: number = 1): Promise<ApiResponse<TVShow>> => {
    const response = await fetch(
      `${BASE_URL}/tv/popular?language=pt-BR&page=${page}`,
      options
    );
    return response.json();
  },

  getTopRatedTVShows: async (page: number = 1): Promise<ApiResponse<TVShow>> => {
    const response = await fetch(
      `${BASE_URL}/tv/top_rated?language=pt-BR&page=${page}`,
      options
    );
    return response.json();
  },

  searchMovies: async (query: string, page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await fetch(
      `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}&language=pt-BR&page=${page}`,
      options
    );
    return response.json();
  },

  searchTVShows: async (query: string, page: number = 1): Promise<ApiResponse<TVShow>> => {
    const response = await fetch(
      `${BASE_URL}/search/tv?query=${encodeURIComponent(query)}&language=pt-BR&page=${page}`,
      options
    );
    return response.json();
  },

  getImageUrl: (path: string, size: string = 'w500'): string => {
    return path ? `https://image.tmdb.org/t/p/${size}${path}` : '';
  },

  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}?language=pt-BR`,
      options
    );
    return response.json();
  },

  getMovieCredits: async (movieId: number): Promise<Credits> => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/credits?language=pt-BR`,
      options
    );
    return response.json();
  },

  getMovieVideos: async (movieId: number): Promise<VideosResponse> => {
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/videos?language=pt-BR`,
      options
    );
    return response.json();
  },

  discoverMovies: async (params: {
    page?: number;
    sortBy?: string;
    year?: number;
    primaryReleaseYear?: number;
    voteAverageGte?: number;
    voteAverageLte?: number;
  }): Promise<ApiResponse<Movie>> => {
    const queryParams = new URLSearchParams({
      include_adult: 'false',
      include_video: 'false',
      language: 'pt-BR',
      page: (params.page || 1).toString(),
      sort_by: params.sortBy || 'popularity.desc'
    });

    if (params.year) queryParams.append('year', params.year.toString());
    if (params.primaryReleaseYear) queryParams.append('primary_release_year', params.primaryReleaseYear.toString());
    if (params.voteAverageGte) queryParams.append('vote_average.gte', params.voteAverageGte.toString());
    if (params.voteAverageLte) queryParams.append('vote_average.lte', params.voteAverageLte.toString());

    const response = await fetch(
      `${BASE_URL}/discover/movie?${queryParams.toString()}`,
      options
    );
    return response.json();
  },
};

export interface MovieDetails extends Movie {
  runtime: number;
  budget: number;
  revenue: number;
  genres: Genre[];
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface Video {
  id: string;
  name: string;
  key: string;
  site: string;
  type: string;
  official: boolean;
  size: number;
}

export interface VideosResponse {
  results: Video[];
}
