import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IonButton, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [IonToolbar, IonButton, RouterLink, RouterLinkActive],
  template: `
    <ion-toolbar>
      <div class="navbar-inner">
        <a class="brand" routerLink="/home" aria-label="CinePass, ir para a Home" (click)="closeMenu()">
          <img class="brand-logo" src="/cinepass-logo.png" alt="CinePass" />
        </a>

        <nav class="desktop-nav" aria-label="Navegação principal">
          <a routerLink="/home" routerLinkActive="is-active" [routerLinkActiveOptions]="{ exact: true }" ariaCurrentWhenActive="page">Home</a>
          <a routerLink="/filmes" routerLinkActive="is-active" ariaCurrentWhenActive="page">Filmes</a>
          <a routerLink="/equipe" routerLinkActive="is-active" ariaCurrentWhenActive="page">Equipe</a>
        </nav>

        <ion-button class="menu-toggle" fill="clear" aria-label="Abrir navegação" [attr.aria-expanded]="menuOpen()" (click)="toggleMenu()">
          <span class="menu-lines" aria-hidden="true"><i></i><i></i><i></i></span>
          <span class="menu-label">Menu</span>
        </ion-button>
      </div>
    </ion-toolbar>

    @if (menuOpen()) {
      <nav class="mobile-nav" aria-label="Navegação móvel">
        <a routerLink="/home" routerLinkActive="is-active" [routerLinkActiveOptions]="{ exact: true }" ariaCurrentWhenActive="page" (click)="closeMenu()">Home</a>
        <a routerLink="/filmes" routerLinkActive="is-active" ariaCurrentWhenActive="page" (click)="closeMenu()">Filmes</a>
        <a routerLink="/equipe" routerLinkActive="is-active" ariaCurrentWhenActive="page" (click)="closeMenu()">Equipe</a>
      </nav>
    }
  `,
  styles: [
    `:host{display:block;--nav-height:64px}.navbar-inner{width:min(100% - 40px,var(--cp-content-width));height:var(--nav-height);margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px}.brand{display:inline-flex;align-items:center;gap:10px;color:var(--cp-text);text-decoration:none}.brand-logo{display:block;width:180px;height:auto;max-height:48px;object-fit:contain}.desktop-nav{display:flex;align-items:center;gap:32px;margin-left:auto}.desktop-nav a,.mobile-nav a{position:relative;color:var(--cp-muted);font-size:14px;font-weight:600;text-decoration:none;transition:color .16s ease}.desktop-nav a:hover,.mobile-nav a:hover,.desktop-nav a.is-active,.mobile-nav a.is-active{color:var(--cp-text)}.desktop-nav a.is-active::after{content:'';position:absolute;left:0;right:0;bottom:-9px;height:2px;background:var(--cp-accent);border-radius:2px}.menu-toggle{display:none;--color:var(--cp-text);--padding-start:10px;--padding-end:10px}.menu-lines{display:grid;gap:4px}.menu-lines i{width:17px;height:2px;background:currentColor;border-radius:2px}.menu-label{font-size:13px;text-transform:none}.mobile-nav{display:none}@media(max-width:640px){:host{--nav-height:58px}.navbar-inner{width:calc(100% - 32px)}.desktop-nav{display:none}.menu-toggle{display:flex}.mobile-nav{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:6px 16px 14px;border-top:1px solid var(--cp-border);background:var(--cp-surface)}.mobile-nav a{text-align:center;padding:10px 8px;border-radius:8px}.mobile-nav a.is-active{background:var(--cp-accent-soft);color:var(--cp-text)}}`,
  ],
})
export class NavbarComponent {
  readonly menuOpen = signal(false);
  toggleMenu(): void { this.menuOpen.update((open) => !open); }
  closeMenu(): void { this.menuOpen.set(false); }
}
