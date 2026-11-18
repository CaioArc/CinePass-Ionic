import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';
import { MovieService } from '../../core/services/movie.service';
import { Movie } from '../../core/models/movie.model';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, IonButton, MovieCardComponent],
  template: `
    <main class="home-page">
      <section class="hero" aria-labelledby="hero-title">
        <img class="hero-image" [src]="heroBackdrop()" [alt]="heroMovie() ? 'Imagem de fundo de ' + heroMovie()?.title : 'Sala de cinema iluminada pelo projetor'" fetchpriority="high" (error)="heroImageFailed.set(true)" />
        <div class="hero-content">
          @if (heroMovie()) {
            <p class="eyebrow"><span></span> DESTAQUE EM CARTAZ</p>
            <h1 id="hero-title">{{ heroMovie()?.title }}</h1>
            @if (heroMovie()?.overview) { <p class="hero-description">{{ heroMovie()?.overview }}</p> }
          } @else {
            <p class="eyebrow"><span></span> CINEPASS</p>
            <h1 id="hero-title">Sua próxima história começa na tela.</h1>
            <p class="hero-description">Encontre seu próximo filme e prepare-se para viver cada cena.</p>
          }
          <ion-button routerLink="/filmes">Ver filmes em cartaz</ion-button>
        </div>
      </section>

      <section class="section-wrap movie-section" aria-labelledby="now-playing-title">
        <div class="section-heading">
          <div><p class="section-kicker">AGORA NOS CINEMAS</p><h2 id="now-playing-title">Em cartaz</h2></div>
          <a routerLink="/filmes">Ver catálogo <span aria-hidden="true">→</span></a>
        </div>
        @if (nowPlayingLoading()) {
          <p class="state-message" role="status">Carregando filmes em cartaz…</p>
        } @else if (nowPlayingError()) {
          <p class="state-message state-error" role="alert">{{ nowPlayingError() }}</p>
        } @else if (nowPlaying().length > 0) {
          <div class="movie-grid">
            @for (movie of nowPlaying().slice(0, 8); track movie.id) { <app-movie-card [movie]="movie" /> }
          </div>
        } @else {
          <p class="state-message">Nenhum filme em cartaz foi encontrado.</p>
        }
      </section>

      <section class="section-wrap movie-section popular-section" aria-labelledby="popular-title">
        <div class="section-heading">
          <div><p class="section-kicker">MAIS ASSISTIDOS</p><h2 id="popular-title">Filmes populares</h2></div>
          <a routerLink="/filmes">Explorar filmes <span aria-hidden="true">→</span></a>
        </div>
        @if (popularLoading()) {
          <p class="state-message" role="status">Carregando filmes populares…</p>
        } @else if (popularError()) {
          <p class="state-message state-error" role="alert">{{ popularError() }}</p>
        } @else if (popularMovies().length > 0) {
          <div class="movie-grid">
            @for (movie of popularMovies().slice(0, 4); track movie.id) { <app-movie-card [movie]="movie" /> }
          </div>
        } @else {
          <p class="state-message">Nenhum filme popular foi encontrado.</p>
        }
      </section>

      <section class="section-wrap closing-cta" aria-labelledby="cta-title">
        <div><p class="section-kicker">SUA PRÓXIMA SESSÃO</p><h2 id="cta-title">Qual vai ser o próximo filme?</h2><p>Escolha uma história e prepare a pipoca.</p></div>
        <ion-button routerLink="/filmes">Escolher um filme</ion-button>
      </section>
    </main>
  `,
  styles: [
    `:host{display:block}.section-wrap{width:min(100% - 48px,var(--cp-content-width));margin-inline:auto}.hero{position:relative;min-height:clamp(390px,52vw,570px);overflow:hidden;display:flex;align-items:center;background:#17171a}.hero-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 48%}.hero::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,10,12,.96) 0%,rgba(10,10,12,.82) 42%,rgba(10,10,12,.25) 100%),linear-gradient(0deg,rgba(10,10,12,.62),transparent 48%)}.hero-content{position:relative;z-index:1;width:min(100% - 48px,var(--cp-content-width));margin:0 auto;padding:56px 0;max-width:1248px}.eyebrow,.section-kicker{display:flex;align-items:center;gap:9px;margin:0 0 16px;color:var(--cp-accent);font-size:10px;font-weight:800;letter-spacing:.16em}.eyebrow span{width:22px;height:2px;background:var(--cp-accent)}.hero h1{max-width:680px;margin:0;color:#fff;font-size:clamp(38px,6.4vw,72px);font-weight:780;line-height:1.02;letter-spacing:-.055em}.hero-description{display:-webkit-box;max-width:490px;margin:18px 0 24px;overflow:hidden;color:#d0cdd0;font-size:15px;line-height:1.65;-webkit-line-clamp:3;-webkit-box-orient:vertical}.hero ion-button,.closing-cta ion-button{--background:var(--cp-accent);--background-hover:var(--cp-accent-hover);--color:#fff;--padding-start:22px;--padding-end:22px;min-height:48px}.movie-section{padding:56px 0 8px}.section-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:23px}.section-heading .section-kicker{margin-bottom:8px}.section-heading h2,.closing-cta h2{margin:0;color:var(--cp-text);font-size:clamp(24px,3vw,32px);line-height:1.1;letter-spacing:-.04em}.section-heading>a{color:var(--cp-muted);font-size:13px;font-weight:650;text-decoration:none;white-space:nowrap}.section-heading>a:hover{color:var(--cp-text)}.section-heading>a span{padding-left:5px;color:var(--cp-accent)}.movie-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.popular-section{padding-top:62px}.state-message{padding:20px;border:1px solid var(--cp-border);border-radius:12px;background:var(--cp-surface);color:var(--cp-muted);font-size:14px}.state-error{border-color:rgba(229,27,62,.36);color:#ff9aaa}.closing-cta{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-top:76px;margin-bottom:74px;padding:30px 34px;border:1px solid var(--cp-border);border-left:3px solid var(--cp-accent);border-radius:var(--cp-radius-card);background:var(--cp-surface)}.closing-cta .section-kicker{margin-bottom:10px}.closing-cta h2{font-size:clamp(23px,3vw,32px)}.closing-cta p:last-child{margin:10px 0 0;color:var(--cp-muted);font-size:14px}.closing-cta ion-button{flex:none}@media(max-width:900px){.movie-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.hero{min-height:450px}}@media(max-width:640px){.section-wrap{width:calc(100% - 32px)}.hero{min-height:500px;align-items:flex-end}.hero-image{object-position:58% center}.hero::after{background:linear-gradient(0deg,rgba(10,10,12,.98) 0%,rgba(10,10,12,.78) 48%,rgba(10,10,12,.18) 100%)}.hero-content{width:calc(100% - 32px);padding:44px 0 40px}.hero h1{font-size:clamp(39px,11vw,56px)}.hero-description{font-size:14px}.movie-section{padding-top:40px}.section-heading{align-items:flex-end;margin-bottom:16px}.section-heading>a{font-size:11px}.movie-grid{gap:12px}.popular-section{padding-top:46px}.closing-cta{width:calc(100% - 32px);margin:52px auto 40px;padding:22px 18px;align-items:flex-start;flex-direction:column;gap:18px}.closing-cta h2{font-size:25px}.closing-cta ion-button{width:100%}}@media(max-width:360px){.movie-grid{grid-template-columns:1fr}.movie-grid app-movie-card{max-width:260px;margin-inline:auto;width:100%}}`,
  ],
})
export class HomePage implements OnInit {
  private readonly movieService = inject(MovieService);
  readonly fallbackHeroImage = 'https://images.unsplash.com/photo-1643553517154-24eb7fd86437?auto=format&fit=crop&w=2200&q=85';
  readonly nowPlaying = signal<Movie[]>([]);
  readonly popularMovies = signal<Movie[]>([]);
  readonly heroMovie = computed<Movie | null>(() => this.nowPlaying()[0] ?? null);
  readonly heroImageFailed = signal(false);
  readonly heroBackdrop = computed(() => !this.heroImageFailed() && this.heroMovie()?.backdropUrl ? this.heroMovie()!.backdropUrl! : this.fallbackHeroImage);
  readonly nowPlayingLoading = signal(true);
  readonly popularLoading = signal(true);
  readonly nowPlayingError = signal<string | null>(null);
  readonly popularError = signal<string | null>(null);

  ngOnInit(): void {
    this.movieService.getFilmesEmCartaz().subscribe({
      next: (response) => { this.heroImageFailed.set(false); this.nowPlaying.set(response.results); this.nowPlayingLoading.set(false); },
      error: (error: unknown) => { this.nowPlayingError.set(this.message(error)); this.nowPlayingLoading.set(false); },
    });
    this.movieService.getFilmesPopulares().subscribe({
      next: (response) => { this.popularMovies.set(response.results); this.popularLoading.set(false); },
      error: (error: unknown) => { this.popularError.set(this.message(error)); this.popularLoading.set(false); },
    });
  }

  private message(error: unknown): string {
    return error instanceof Error ? error.message : 'Não foi possível carregar os filmes.';
  }
}
