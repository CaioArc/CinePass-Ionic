import { DatePipe } from '@angular/common';
import { Component, Input, OnChanges, signal } from '@angular/core';
import { Movie } from '../../core/models/movie.model';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { RatingPipe } from '../../pipes/rating.pipe';
import { HighlightDirective } from '../../directives/highlight.directive';
import { RouterLink } from '@angular/router';
import { IonButton, IonCard, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [DatePipe, TruncatePipe, RatingPipe, HighlightDirective, RouterLink, IonCard, IonCardContent, IonButton],
  template: `
    <ion-card class="movie-card" appHighlight>
      <a class="poster-link" [routerLink]="['/detalhes', movie.id]" [attr.aria-label]="'Ver detalhes de ' + movie.title">
        @if (movie.posterUrl && !imageFailed()) {
          <img class="poster" [src]="movie.posterUrl" [alt]="'Pôster de ' + movie.title" loading="lazy" (error)="onPosterError()" />
        } @else {
          <div class="poster poster-placeholder" role="img" [attr.aria-label]="'Pôster indisponível para ' + movie.title"><span>CinePass</span></div>
        }
      </a>
      <ion-card-content>
        <div class="movie-meta">
          @if (movie.rating > 0) {
            <span class="rating" [attr.aria-label]="'Avaliação ' + movie.rating + ' de 10'">{{ movie.rating | rating }}</span>
          } @else {
            <span class="rating">Sem nota</span>
          }
          @if (movie.releaseDate) {
            <time>{{ movie.releaseDate | date: 'dd/MM/yyyy' }}</time>
          } @else {
            <span class="unknown-date">Data não informada</span>
          }
        </div>
        <h2>{{ movie.title }}</h2>
        @if (movie.overview) { <p class="synopsis">{{ movie.overview | truncate: 92 }}</p> }
        <ion-button expand="block" [routerLink]="['/detalhes', movie.id]">Ver detalhes</ion-button>
      </ion-card-content>
    </ion-card>
  `,
  styles: [
    `:host{display:block;min-width:0}.movie-card{height:100%;margin:0;overflow:hidden;border:1px solid var(--cp-border);border-radius:var(--cp-radius-card);background:var(--cp-surface);box-shadow:none;transition:border-color .18s ease,transform .18s ease}.movie-card:hover,.movie-card.cp-highlighted{transform:translateY(-2px);border-color:var(--cp-accent);box-shadow:0 8px 24px rgba(0,0,0,.28)}.poster-link{display:block;aspect-ratio:2/3;background:var(--cp-surface-raised);overflow:hidden}.poster{display:block;width:100%;height:100%;object-fit:cover}.poster-placeholder{display:grid;place-items:center;color:var(--cp-muted);font-size:13px;letter-spacing:.1em}.movie-card ion-card-content{padding:14px}.movie-meta{display:flex;justify-content:space-between;align-items:center;gap:8px;color:var(--cp-muted);font-size:12px}.rating{color:var(--cp-text);font-weight:700}.synopsis{min-height:3.6em;margin:0 0 12px;color:var(--cp-muted);font-size:12px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.movie-card h2{min-height:2.5em;margin:10px 0 14px;color:var(--cp-text);font-size:16px;font-weight:700;line-height:1.25;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.movie-card ion-button{margin:0;--background:var(--cp-accent);--background-hover:var(--cp-accent-hover);--color:#fff;--border-radius:9px;--box-shadow:none;font-size:13px;font-weight:650;text-transform:none}.unknown-date{font-size:11px}@media(prefers-reduced-motion:reduce){.movie-card{transition:none}}`,
  ],
})
export class MovieCardComponent implements OnChanges {
  @Input({ required: true }) movie!: Movie;
  readonly imageFailed = signal(false);

  ngOnChanges(): void {
    this.imageFailed.set(false);
  }

  onPosterError(): void {
    this.imageFailed.set(true);
  }
}
