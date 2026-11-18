import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Movie,
  MovieDetails,
  MovieListResponse,
  TmdbMovieDetailsDto,
  TmdbMovieDto,
  TmdbMovieListDto,
} from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class MovieService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdb.baseUrl;
  private readonly imageBaseUrl = environment.tmdb.imageBaseUrl;
  private readonly apiKey = environment.tmdb.apiKey.trim();
  private readonly readAccessToken = environment.tmdb.readAccessToken.trim();

  getFilmesEmCartaz(page = 1): Observable<MovieListResponse> {
    return this.get<TmdbMovieListDto>('/movie/now_playing', page, true).pipe(map((response) => this.mapList(response)));
  }

  getFilmesPopulares(page = 1): Observable<MovieListResponse> {
    return this.get<TmdbMovieListDto>('/movie/popular', page).pipe(map((response) => this.mapList(response)));
  }

  getDetalhesFilme(id: number): Observable<MovieDetails> {
    if (!Number.isInteger(id) || id <= 0) {
      return throwError(() => new Error('O identificador do filme é inválido.'));
    }
    return this.get<TmdbMovieDetailsDto>('/movie/' + id).pipe(map((response) => this.mapDetails(response)));
  }

  private get<T>(endpoint: string, page?: number, region = false): Observable<T> {
    if (!this.apiKey && !this.readAccessToken) {
      return throwError(() => new Error('Adicione sua chave TMDB em src/environments/environment.ts para carregar os filmes.'));
    }

    let params = new HttpParams().set('language', 'pt-BR');
    if (!this.readAccessToken) params = params.set('api_key', this.apiKey);

    if (page !== undefined) {
      params = params.set('page', Math.max(1, Math.min(500, Math.floor(page))));
      if (region) params = params.set('region', 'BR');
    }

    const headers = this.readAccessToken
      ? { Authorization: 'Bearer ' + this.readAccessToken }
      : undefined;

    return this.http.get<T>(this.baseUrl + endpoint, { params, headers }).pipe(
      catchError((error: unknown) => throwError(() => new Error(this.getErrorMessage(error)))),
    );
  }

  private mapList(response: TmdbMovieListDto): MovieListResponse {
    return {
      page: response.page,
      results: (response.results ?? []).map((movie) => this.mapMovie(movie)),
      totalPages: response.total_pages ?? 0,
      totalResults: response.total_results ?? 0,
    };
  }

  private mapDetails(response: TmdbMovieDetailsDto): MovieDetails {
    return {
      ...this.mapMovie(response),
      runtime: response.runtime ?? null,
      genres: response.genres ?? [],
      tagline: response.tagline ?? '',
    };
  }

  private mapMovie(movie: TmdbMovieDto): Movie {
    return {
      id: movie.id,
      title: movie.title || 'Título indisponível',
      overview: movie.overview ?? '',
      posterUrl: this.imageUrl(movie.poster_path, 'w500'),
      backdropUrl: this.imageUrl(movie.backdrop_path, 'w1280'),
      rating: Number.isFinite(movie.vote_average) ? movie.vote_average : 0,
      releaseDate: movie.release_date || null,
      adult: movie.adult ?? false,
      genreIds: movie.genre_ids ?? [],
    };
  }

  private imageUrl(path: string | null, size: 'w500' | 'w1280'): string | null {
    return path ? this.imageBaseUrl + '/' + size + path : null;
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) return 'Não foi possível conectar ao TMDB. Verifique sua conexão e tente novamente.';
      if (error.status === 401 || error.status === 403) return 'A chave TMDB foi recusada. Confira a chave configurada no ambiente.';
      if (error.status === 404) return 'O filme solicitado não foi encontrado no TMDB.';
      if (error.status === 429) return 'O TMDB recebeu muitas solicitações. Aguarde um pouco e tente novamente.';
      return 'O TMDB retornou um erro (' + error.status + '). Tente novamente mais tarde.';
    }
    return 'Não foi possível carregar os dados do TMDB.';
  }
}
