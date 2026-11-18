import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, IonButton],
  template: `
    <main class="page home-page">
      <section class="hero" aria-labelledby="home-title">
        <p class="eyebrow"><span></span> CINEMA, DO SEU JEITO</p>
        <h1 id="home-title">Sua próxima história<br /><span>começa na tela.</span></h1>
        <p class="intro">Encontre seu próximo filme e prepare-se para viver cada cena.</p>
        <ion-button routerLink="/filmes">Explorar filmes</ion-button>
        <div class="hero-rule" aria-hidden="true"></div>
      </section>
      <section class="welcome-note" aria-label="CinePass">
        <span class="section-index">01 / CINEPASS</span>
        <p>Uma experiência de cinema pensada para você.</p>
      </section>
    </main>
  `,
  styles: [
    `:host{display:block}.page{width:min(100% - 48px,var(--cp-content-width));margin:0 auto}.home-page{padding:clamp(48px,10vh,112px) 0 64px}.hero{max-width:760px;position:relative;padding-bottom:54px}.eyebrow{display:flex;align-items:center;gap:10px;margin:0 0 22px;color:var(--cp-muted);font-size:11px;font-weight:750;letter-spacing:.17em}.eyebrow span{width:22px;height:2px;background:var(--cp-accent)}h1{margin:0;color:var(--cp-text);font-size:clamp(42px,7vw,76px);font-weight:780;line-height:1.02;letter-spacing:-.055em}h1 span{color:var(--cp-accent)}.intro{max-width:430px;margin:22px 0 26px;color:var(--cp-muted);font-size:16px}.hero ion-button{--background:var(--cp-accent);--background-hover:var(--cp-accent-hover);--color:#fff;--padding-start:22px;--padding-end:22px;min-height:48px}.hero-rule{position:absolute;right:0;bottom:0;width:min(48%,340px);height:1px;background:var(--cp-border-strong);opacity:.55}.welcome-note{display:flex;align-items:center;gap:22px;padding-top:22px;border-top:1px solid var(--cp-border)}.section-index{color:var(--cp-accent);font-size:10px;font-weight:750;letter-spacing:.12em;white-space:nowrap}.welcome-note p{margin:0;color:var(--cp-muted);font-size:13px}@media(max-width:640px){.page{width:calc(100% - 32px)}.home-page{padding:58px 0 42px}.eyebrow{margin-bottom:18px;font-size:10px}h1{font-size:clamp(39px,11vw,56px)}.intro{max-width:330px;font-size:15px}.hero-rule{width:45%}.welcome-note{align-items:flex-start;gap:14px}}`,
  ],
})
export class HomePage {}
