import { RouterLink } from '@angular/router';
import { Component } from '@angular/core';
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
template: `<main class="page"><p class="eyebrow">CINEPASS</p><h1>Página não encontrada</h1><p class="description">O endereço acessado não corresponde a uma página do CinePass.</p><a class="back-link" routerLink="/home">Voltar para a Home</a></main>`,
  styles: [` :host{display:block}.page{width:min(100% - 48px,var(--cp-content-width));min-height:52vh;margin:0 auto;padding:clamp(40px,8vh,88px) 0}.eyebrow{margin:0 0 12px;color:var(--cp-accent);font-size:11px;font-weight:750;letter-spacing:.16em}h1{margin:0;color:var(--cp-text);font-size:clamp(32px,5vw,48px);line-height:1.1;letter-spacing:-.04em}.description{max-width:600px;margin:18px 0;color:var(--cp-muted);font-size:16px}.back-link{display:inline-flex;margin-top:10px;padding:11px 16px;border-radius:9px;background:var(--cp-accent);color:white;font-weight:650;text-decoration:none}.back-link:hover{background:var(--cp-accent-hover)}@media(max-width:640px){.page{width:calc(100% - 32px);padding:42px 0}.description{font-size:15px}}`]
})
export class NotFoundPage {}
