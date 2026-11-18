import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="footer-inner">
      <a class="footer-brand" routerLink="/home">Cine<span>Pass</span></a>
      <p>Seu próximo filme começa aqui.</p>
      <nav aria-label="Links do rodapé">
        <a routerLink="/filmes">Filmes</a>
        <a routerLink="/equipe">Equipe</a>
      </nav>
      <small>© {{ year }} CinePass</small>
    </footer>
  `,
  styles: [
    `:host{display:block;border-top:1px solid var(--cp-border);background:var(--cp-surface)}.footer-inner{width:min(100% - 40px,var(--cp-content-width));min-height:74px;margin:0 auto;display:flex;align-items:center;gap:20px;color:var(--cp-muted);font-size:12px}.footer-brand{color:var(--cp-text);font-size:15px;font-weight:750;text-decoration:none}.footer-brand span{color:var(--cp-accent)}p{margin:0}nav{display:flex;gap:18px;margin-left:auto}nav a{color:var(--cp-muted);text-decoration:none}nav a:hover{color:var(--cp-text)}small{color:var(--cp-muted)}@media(max-width:640px){.footer-inner{width:calc(100% - 32px);min-height:auto;padding:16px 0;display:grid;grid-template-columns:1fr auto;gap:8px 16px}.footer-inner p{grid-column:1/-1;grid-row:2}nav{grid-column:1;grid-row:3;margin:2px 0 0}small{grid-column:2;grid-row:3;align-self:center}}`,
  ],
})
export class FooterComponent {
  readonly year = new Date().getFullYear();
}
