import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';
import { MovieCardComponent, MovieCardData } from '../../components/movie-card/movie-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, IonButton, MovieCardComponent],
  template: `
    <main class="home-page">
      <section class="hero" aria-labelledby="hero-title">
        <img class="hero-image" [src]="heroImage" alt="Sala de cinema com poltronas vermelhas antes da sessão" fetchpriority="high" />
        <div class="hero-content">
          <p class="eyebrow"><span></span> SUA PRÓXIMA HISTÓRIA</p>
          <h1 id="hero-title">O cinema fica melhor quando é a sua escolha.</h1>
          <p>Explore novos mundos, grandes histórias e os filmes que merecem a tela grande.</p>
          <ion-button routerLink="/filmes">Ver filmes em cartaz</ion-button>
        </div>
      </section>

      <section class="intro section-wrap" aria-labelledby="intro-title">
        <p class="section-kicker">BEM-VINDO AO CINEPASS</p>
        <h2 id="intro-title">A experiência começa<br class="desktop-break" /> com um bom filme.</h2>
        <p>Descubra o que está em cartaz e encontre sua próxima sessão favorita.</p>
      </section>

      <section class="movie-section section-wrap" aria-labelledby="featured-title">
        <div class="section-heading">
          <div><p class="section-kicker">SELEÇÃO CINEPASS</p><h2 id="featured-title">Em destaque</h2></div>
          <a routerLink="/filmes">Ver todos <span aria-hidden="true">→</span></a>
        </div>
        <div class="movie-grid">
          @for (movie of featuredMovies; track movie.id) {
            <app-movie-card [movie]="movie" />
          }
        </div>
      </section>

      <section class="movie-section popular-section section-wrap" aria-labelledby="popular-title">
        <div class="section-heading">
          <div><p class="section-kicker">O QUE ESTÃO ASSISTINDO</p><h2 id="popular-title">Filmes populares</h2></div>
          <a routerLink="/filmes">Explorar catálogo <span aria-hidden="true">→</span></a>
        </div>
        <div class="movie-grid">
          @for (movie of popularMovies; track movie.id) {
            <app-movie-card [movie]="movie" />
          }
        </div>
      </section>

      <section class="closing-cta section-wrap" aria-labelledby="cta-title">
        <div><p class="section-kicker">SUA PRÓXIMA SESSÃO</p><h2 id="cta-title">Qual vai ser o próximo filme?</h2><p>Escolha uma história e prepare a pipoca.</p></div>
        <ion-button routerLink="/filmes">Escolher um filme</ion-button>
      </section>
    </main>
  `,
  styles: [
    `:host{display:block}.section-wrap{width:min(100% - 48px,var(--cp-content-width));margin-inline:auto}.hero{position:relative;min-height:clamp(390px,52vw,570px);overflow:hidden;display:flex;align-items:center;background:#17171a}.hero-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 48%}.hero::after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(10,10,12,.96) 0%,rgba(10,10,12,.82) 42%,rgba(10,10,12,.25) 100%),linear-gradient(0deg,rgba(10,10,12,.62),transparent 48%)}.hero-content{position:relative;z-index:1;width:min(100% - 48px,var(--cp-content-width));margin:0 auto;padding:56px 0;max-width:1248px}.eyebrow,.section-kicker{display:flex;align-items:center;gap:9px;margin:0 0 16px;color:var(--cp-accent);font-size:10px;font-weight:800;letter-spacing:.16em}.eyebrow span{width:22px;height:2px;background:var(--cp-accent)}.hero h1{max-width:620px;margin:0;color:#fff;font-size:clamp(38px,6.4vw,72px);font-weight:780;line-height:1.02;letter-spacing:-.055em}.hero-content>p:not(.eyebrow){max-width:460px;margin:20px 0 26px;color:#d0cdd0;font-size:16px;line-height:1.65}.hero ion-button,.closing-cta ion-button{--background:var(--cp-accent);--background-hover:var(--cp-accent-hover);--color:#fff;--padding-start:22px;--padding-end:22px;min-height:48px}.intro{padding:76px 0 55px;border-bottom:1px solid var(--cp-border)}.intro h2,.section-heading h2,.closing-cta h2{margin:0;color:var(--cp-text);font-size:clamp(28px,4vw,42px);line-height:1.1;letter-spacing:-.04em}.intro>p:last-child{margin:16px 0 0;color:var(--cp-muted);font-size:15px}.movie-section{padding:54px 0 10px}.section-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:24px;margin-bottom:23px}.section-heading .section-kicker{margin-bottom:8px}.section-heading h2{font-size:clamp(24px,3vw,32px)}.section-heading>a{color:var(--cp-muted);font-size:13px;font-weight:650;text-decoration:none;white-space:nowrap}.section-heading>a:hover{color:var(--cp-text)}.section-heading>a span{padding-left:5px;color:var(--cp-accent)}.movie-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:18px}.popular-section{padding-top:64px}.closing-cta{display:flex;align-items:center;justify-content:space-between;gap:24px;margin-top:76px;margin-bottom:74px;padding:30px 34px;border:1px solid var(--cp-border);border-left:3px solid var(--cp-accent);border-radius:var(--cp-radius-card);background:var(--cp-surface)}.closing-cta .section-kicker{margin-bottom:10px}.closing-cta h2{font-size:clamp(23px,3vw,32px)}.closing-cta p:last-child{margin:10px 0 0;color:var(--cp-muted);font-size:14px}.closing-cta ion-button{flex:none}@media(max-width:900px){.movie-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.hero{min-height:450px}}@media(max-width:640px){.section-wrap{width:calc(100% - 32px)}.hero{min-height:500px;align-items:flex-end}.hero-image{object-position:58% center}.hero::after{background:linear-gradient(0deg,rgba(10,10,12,.98) 0%,rgba(10,10,12,.78) 48%,rgba(10,10,12,.18) 100%)}.hero-content{width:calc(100% - 32px);padding:44px 0 40px}.hero h1{font-size:clamp(39px,11vw,56px)}.hero-content>p:not(.eyebrow){max-width:370px;font-size:15px}.intro{padding:52px 0 38px}.desktop-break{display:none}.movie-section{padding-top:40px}.section-heading{align-items:flex-end;margin-bottom:16px}.section-heading>a{font-size:11px}.movie-grid{gap:12px}.popular-section{padding-top:46px}.closing-cta{width:calc(100% - 32px);margin:52px auto 40px;padding:22px 18px;align-items:flex-start;flex-direction:column;gap:18px}.closing-cta h2{font-size:25px}.closing-cta ion-button{width:100%}}@media(max-width:360px){.movie-grid{grid-template-columns:1fr}.movie-grid app-movie-card{max-width:260px;margin-inline:auto;width:100%}}@media(prefers-reduced-motion:reduce){.hero-image{scroll-behavior:auto}}`,
  ],
})
export class HomePage {
  readonly heroImage = 'https://images.unsplash.com/photo-1643553517154-24eb7fd86437?auto=format&fit=crop&w=2200&q=85';

  readonly featuredMovies: MovieCardData[] = [
    { id: 693134, title: 'Duna: Parte Dois', posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg', rating: 8.2, releaseDate: '2024-02-27' },
    { id: 872585, title: 'Oppenheimer', posterUrl: 'https://image.tmdb.org/t/p/w500/ptpr0kGAckfQkJeJIt8st5dglvd.jpg', rating: 8.1, releaseDate: '2023-07-19' },
    { id: 569094, title: 'Homem-Aranha: Através do Aranhaverso', posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg', rating: 8.4, releaseDate: '2023-05-31' },
    { id: 157336, title: 'Interestelar', posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg', rating: 8.7, releaseDate: '2014-11-05' },
  ];

  readonly popularMovies: MovieCardData[] = [
    { id: 27205, title: 'A Origem', posterUrl: 'https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg', rating: 8.4, releaseDate: '2010-07-15' },
    { id: 155, title: 'Batman: O Cavaleiro das Trevas', posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', rating: 9.0, releaseDate: '2008-07-16' },
    { id: 438631, title: 'Duna', posterUrl: 'https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg', rating: 7.8, releaseDate: '2021-09-15' },
    { id: 414906, title: 'The Batman', posterUrl: 'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg', rating: 7.7, releaseDate: '2022-03-01' },
  ];
}
