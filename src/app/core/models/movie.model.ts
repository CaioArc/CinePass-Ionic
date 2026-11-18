export interface MovieCardData {
  id: number;
  title: string;
  posterUrl: string | null;
  rating: number;
  releaseDate: string | null;
}

export interface Movie extends MovieCardData {
  overview: string;
  backdropUrl: string | null;
  adult: boolean;
  genreIds: number[];
}

export interface MovieGenre {
  id: number;
  name: string;
}

export interface MovieDetails extends Movie {
  runtime: number | null;
  genres: MovieGenre[];
  tagline: string;
}

export interface MovieListResponse {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}

export interface TmdbMovieDto {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string | null;
  vote_average: number;
  adult: boolean;
  genre_ids?: number[];
}

export interface TmdbMovieListDto {
  page: number;
  results: TmdbMovieDto[];
  total_pages: number;
  total_results: number;
}

export interface TmdbMovieDetailsDto extends TmdbMovieDto {
  runtime: number | null;
  genres: MovieGenre[];
  tagline: string;
}
