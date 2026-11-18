import { Component, OnInit, WritableSignal, inject, signal } from '@angular/core';
import { IonButton } from '@ionic/angular/standalone';
import { MovieService } from '../../core/services/movie.service';
import { Movie, MovieListResponse } from '../../core/models/movie.model';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

interface MovieSectionState {
  movies: Movie[];
  page: number;
  totalPages: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
}

const initialState = (): MovieSectionState => ({ movies: [], page: 0, totalPages: 0, loading: true, loadingMore: false, error: null });

@Component({
  selector: 'app-filmes',
  standalone: true,
  imports: [IonButton, MovieCardComponent],
  template: `
    <main class="films-page">
      <header class="page-heading">
        <p class="section-kicker">DESCUBRA SEU PRÓXIMO FILME</p>
        <h1>Filmes</h1>
        <p>Explore os títulos que estão em cartaz e os mais populares.</p>
      </header>

      <section class="movie-section" aria-labelledby="now-playing-title">
        <div class="section-heading"><div><p class="section-kicker">AGORA NOS CINEMAS</p><h2 id="now-playing-title">Em cartaz</h2></div></div>
        @if (nowPlaying().loading && nowPlaying().movies.length === 0) {
          <p class="state-message" role="status">Carregando filmes em cartaz…</p>
        } @else if (nowPlaying().error && nowPlaying().movies.length === 0) {
          <p class="state-message state-error" role="alert">{{ nowPlaying().error }}</p>
        } @else if (nowPlaying().movies.length > 0) {
          <div class="movie-grid">
            @for (movie of nowPlaying().movies; track movie.id) { <app-movie-card [movie]="movie" /> }
          </div>
          @if (nowPlaying().error) { <p class="state-message state-error" role="alert">{{ nowPlaying().error }}</p> }
          @if (nowPlaying().page < nowPlaying().totalPages) {
            <div class="load-more"><ion-button fill="outline" [disabled]="nowPlaying().loadingMore" (click)="loadNowPlaying(true)">{{ nowPlaying().loadingMore ? 'Carregando…' : 'Carregar mais filmes em cartaz' }}</ion-button></div>
          }
        } @else {
          <p class="state-message">Nenhum filme em cartaz foi encontrado.</p>
        }
      </section>

      <section class="movie-section popular-section" aria-labelledby="popular-title">
        <div class="section-heading"><div><p class="section-kicker">MAIS ASSISTIDOS</p><h2 id="popular-title">Populares</h2></div></div>
        @if (popular().loading && popular().movies.length === 0) {
          <p class="state-message" role="status">Carregando filmes populares…</p>
        } @else if (popular().error && popular().movies.length === 0) {
          <p class="state-message state-error" role="alert">{{ popular().error }}</p>
        } @else if (popular().movies.length > 0) {
          <div class="movie-grid">
            @for (movie of popular().movies; track movie.id) { <app-movie-card [movie]="movie" /> }
          </div>
          @if (popular().error) { <p class="state-message state-error" role="alert">{{ popular().error }}</p> }
          @if (popular().page < popular().totalPages) {
            <div class="load-more"><ion-button fill="outline" [disabled]="popular().loadingMore" (click)="loadPopular(true)">{{ popular().loadingMore ? 'Carregando…' : 'Carregar mais populares' }}</ion-button></div>
          }
        } @else {
          <p class="state-message">Nenhum filme popular foi encontrado.</p>
        }
      </section>
    </main>
  `,
  styles: [
    `:host{display:block}.films-page{width:min(100% - 48px,var(--cp-content-width));min-height:60vh;margin:0 auto;padding:clamp(42px,8vh,82px) 0 72px}.page-heading{max-width:650px;margin-bottom:38px}.section-kicker{margin:0 0 10px;color:var(--cp-accent);font-size:10px;font-weight:800;letter-spacing:.15em}.page-heading h1{margin:0;color:var(--cp-text);font-size:clamp(36px,5vw,54px);line-height:1.05;letter-spacing:-.045em}.page-heading>p:last-child{margin:14px 0 0;color:var(--cp-muted);font-size:15px}.movie-section{padding:18px 0 20px}.section-heading{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:20px}.section-heading .section-kicker{margin-bottom:7px}.section-heading h2{margin:0;color:var(--cp-text);font-size:clamp(24px,3vw,32px);letter-spacing:-.035em}.movie-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.popular-section{margin-top:36px;padding-top:38px;border-top:1px solid var(--cp-border)}.state-message{padding:20px;border:1px solid var(--cp-border);border-radius:12px;background:var(--cp-surface);color:var(--cp-muted);font-size:14px}.state-error{border-color:rgba(229,27,62,.36);color:#ff9aaa}.load-more{display:flex;justify-content:center;margin-top:24px}.load-more ion-button{--color:var(--cp-text);--border-color:var(--cp-border-strong);--border-radius:9px;min-height:44px}@media(max-width:900px){.movie-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}}@media(max-width:640px){.films-page{width:calc(100% - 32px);padding:42px 0 48px}.page-heading{margin-bottom:25px}.movie-grid{gap:12px}.popular-section{margin-top:22px;padding-top:28px}}@media(max-width:360px){.movie-grid{grid-template-columns:1fr}.movie-grid app-movie-card{max-width:260px;margin-inline:auto;width:100%}}`,
  ],
})
export class FilmesPage implements OnInit {
  private readonly movieService = inject(MovieService);
  readonly nowPlaying = signal<MovieSectionState>(initialState());
  readonly popular = signal<MovieSectionState>(initialState());

  ngOnInit(): void {
    this.loadNowPlaying();
    this.loadPopular();
  }

  loadNowPlaying(loadMore = false): void {
    const nextPage = loadMore ? this.nowPlaying().page + 1 : 1;
    this.nowPlaying.update((state) => ({ ...state, loading: !loadMore, loadingMore: loadMore, error: null }));
    this.movieService.getFilmesEmCartaz(nextPage).subscribe({
      next: (response) => this.applyResponse(this.nowPlaying, response, loadMore),
      error: (error: unknown) => this.applyError(this.nowPlaying, error),
    });
  }

  loadPopular(loadMore = false): void {
    const nextPage = loadMore ? this.popular().page + 1 : 1;
    this.popular.update((state) => ({ ...state, loading: !loadMore, loadingMore: loadMore, error: null }));
    this.movieService.getFilmesPopulares(nextPage).subscribe({
      next: (response) => this.applyResponse(this.popular, response, loadMore),
      error: (error: unknown) => this.applyError(this.popular, error),
    });
  }

  private applyResponse(target: WritableSignal<MovieSectionState>, response: MovieListResponse, append: boolean): void {
    target.update((state) => ({
      ...state,
      movies: append ? [...state.movies, ...response.results] : response.results,
      page: response.page,
      totalPages: response.totalPages,
      loading: false,
      loadingMore: false,
      error: null,
    }));
  }

  private applyError(target: typeof this.nowPlaying, error: unknown): void {
    target.update((state) => ({
      ...state,
      loading: false,
      loadingMore: false,
      error: error instanceof Error ? error.message : 'Não foi possível carregar os filmes.',
    }));
  }
}
