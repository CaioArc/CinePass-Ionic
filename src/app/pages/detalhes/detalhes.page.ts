import { DatePipe } from '@angular/common';
import { RatingPipe } from '../../pipes/rating.pipe';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';
import { MovieDetails } from '../../core/models/movie.model';
import { MovieService } from '../../core/services/movie.service';

@Component({
  selector: 'app-detalhes',
  standalone: true,
  imports: [DatePipe, RatingPipe, RouterLink, IonButton],
  template: `
    <main class="details-page">
      @if (loading()) {
        <p class="state-message" role="status">Carregando detalhes do filme…</p>
      } @else if (error()) {
        <section class="state-message state-error" role="alert">
          <h1>Não foi possível carregar o filme</h1>
          <p>{{ error() }}</p>
          <ion-button fill="outline" routerLink="/filmes">Voltar aos filmes</ion-button>
        </section>
      } @else if (movie(); as details) {
        <article class="movie-details">
          <section class="details-hero">
            @if (details.backdropUrl && !backdropFailed()) {
              <img class="backdrop" [src]="details.backdropUrl" [alt]="'Imagem de fundo de ' + details.title" (error)="backdropFailed.set(true)" />
            }
            <div class="hero-shade"></div>
            <div class="hero-copy">
              <p class="section-kicker">DETALHES DO FILME</p>
              <h1>{{ details.title }}</h1>
              @if (details.tagline) { <p class="tagline">{{ details.tagline }}</p> }
            </div>
          </section>

          <section class="details-body">
            <div class="poster-wrap">
              @if (details.posterUrl && !posterFailed()) {
                <img class="poster" [src]="details.posterUrl" [alt]="'Pôster de ' + details.title" (error)="posterFailed.set(true)" />
              } @else {
                <div class="poster poster-placeholder" role="img" [attr.aria-label]="'Pôster indisponível para ' + details.title">Pôster indisponível</div>
              }
            </div>
            <div class="details-copy">
              <div class="facts">
                @if (details.rating > 0) { <span class="rating">{{ details.rating | rating }}</span> }
                @if (details.releaseDate) { <time>{{ details.releaseDate | date: 'dd/MM/yyyy' }}</time> }
                @if (details.runtime) { <span>{{ details.runtime }} min</span> }
                @if (details.adult) { <span class="adult-label">Conteúdo adulto</span> }
              </div>

              @if (details.genres.length > 0) {
                <div class="genres" aria-label="Gêneros">
                  @for (genre of details.genres; track genre.id) { <span class="genre-chip">{{ genre.name }}</span> }
                </div>
              }

              <section class="synopsis" aria-labelledby="synopsis-title">
                <h2 id="synopsis-title">Sinopse</h2>
                @if (details.overview) { <p>{{ details.overview }}</p> }
                @else { <p class="muted">Sinopse não disponível.</p> }
              </section>
              <ion-button fill="outline" [routerLink]="['/sessoes', details.id]">Escolher sessão</ion-button>
            </div>
          </section>
        </article>
      } @else {
        <p class="state-message">Nenhum detalhe de filme disponível.</p>
      }
    </main>
  `,
  styles: [
    `:host{display:block}.details-page{width:min(100% - 48px,var(--cp-content-width));min-height:60vh;margin:0 auto;padding:34px 0 72px}.state-message{padding:22px;border:1px solid var(--cp-border);border-radius:12px;background:var(--cp-surface);color:var(--cp-muted)}.state-message h1{margin:0 0 10px;color:var(--cp-text);font-size:24px}.state-message p{margin:0 0 16px}.state-error{border-color:rgba(229,27,62,.36);color:#ff9aaa}.details-hero{position:relative;min-height:310px;display:flex;align-items:flex-end;overflow:hidden;border:1px solid var(--cp-border);border-radius:var(--cp-radius-card);background:var(--cp-surface-raised)}.backdrop{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 42%}.hero-shade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(10,10,12,.97),rgba(10,10,12,.16) 100%)}.hero-copy{position:relative;z-index:1;padding:34px clamp(22px,5vw,54px);max-width:850px}.section-kicker{margin:0 0 10px;color:var(--cp-accent);font-size:10px;font-weight:800;letter-spacing:.15em}.hero-copy h1{margin:0;color:#fff;font-size:clamp(32px,5vw,56px);line-height:1.04;letter-spacing:-.045em}.tagline{margin:12px 0 0;color:#d7d3d6;font-size:15px}.details-body{display:grid;grid-template-columns:minmax(180px,270px) minmax(0,1fr);gap:clamp(24px,5vw,56px);padding:32px clamp(4px,3vw,32px) 0}.poster-wrap{max-width:270px}.poster{width:100%;aspect-ratio:2/3;display:block;object-fit:cover;border:1px solid var(--cp-border);border-radius:12px;background:var(--cp-surface-raised)}.poster-placeholder{display:grid;place-items:center;padding:16px;color:var(--cp-muted);text-align:center}.details-copy{min-width:0;padding-top:4px}.facts{display:flex;align-items:center;flex-wrap:wrap;gap:10px 18px;color:var(--cp-muted);font-size:13px}.rating{color:var(--cp-text);font-size:15px;font-weight:750}.adult-label{color:#ff9aaa}.genres{display:flex;flex-wrap:wrap;gap:8px;margin:20px 0 30px}.genre-chip{padding:6px 11px;border:1px solid var(--cp-border);border-radius:999px;color:var(--cp-muted);font-size:12px}.synopsis h2{margin:0 0 10px;color:var(--cp-text);font-size:20px}.synopsis p{max-width:780px;margin:0 0 25px;color:#c3c0c4;font-size:15px;line-height:1.75}.synopsis .muted{color:var(--cp-muted)}.details-copy ion-button{--color:var(--cp-text);--border-color:var(--cp-border-strong);--border-radius:9px}@media(max-width:640px){.details-page{width:calc(100% - 32px);padding:20px 0 48px}.details-hero{min-height:300px}.hero-copy{padding:25px 20px}.details-body{grid-template-columns:1fr;gap:22px;padding:22px 0 0}.poster-wrap{width:min(56%,220px);margin:0 auto}.details-copy{padding-top:0}.synopsis p{font-size:14px}.details-copy ion-button{width:100%}}`,
  ],
})
export class DetalhesPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly movieService = inject(MovieService);
  readonly movie = signal<MovieDetails | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly posterFailed = signal(false);
  readonly backdropFailed = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('O identificador do filme na rota é inválido.');
      this.loading.set(false);
      return;
    }

    this.movieService.getDetalhesFilme(id).subscribe({
      next: (details) => { this.movie.set(details); this.loading.set(false); },
      error: (error: unknown) => {
        this.error.set(error instanceof Error ? error.message : 'Não foi possível carregar os detalhes.');
        this.loading.set(false);
      },
    });
  }
}
