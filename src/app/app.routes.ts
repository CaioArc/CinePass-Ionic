import { Routes } from '@angular/router';
import { AppShellComponent } from './components/app-shell/app-shell.component';
import { requireCompleteBookingForSummary, requireSessionForTickets, requireTicketsForSeats } from './core/guards/booking.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'home' },
      { path: 'home', loadComponent: () => import('./pages/home/home.page').then((module) => module.HomePage) },
      { path: 'filmes', loadComponent: () => import('./pages/filmes/filmes.page').then((module) => module.FilmesPage) },
      { path: 'detalhes/:id', loadComponent: () => import('./pages/detalhes/detalhes.page').then((module) => module.DetalhesPage) },
      { path: 'sessoes/:id', loadComponent: () => import('./pages/sessoes/sessoes.page').then((module) => module.SessoesPage) },
      { path: 'ingressos', canActivate: [requireSessionForTickets], loadComponent: () => import('./pages/ingressos/ingressos.page').then((module) => module.IngressosPage) },
      { path: 'poltronas', canActivate: [requireTicketsForSeats], loadComponent: () => import('./pages/poltronas/poltronas.page').then((module) => module.PoltronasPage) },
      { path: 'resumo', canActivate: [requireCompleteBookingForSummary], loadComponent: () => import('./pages/resumo/resumo.page').then((module) => module.ResumoPage) },
      { path: 'equipe', loadComponent: () => import('./pages/equipe/equipe.page').then((module) => module.EquipePage) },
      { path: '**', loadComponent: () => import('./pages/not-found/not-found.page').then((module) => module.NotFoundPage) },
    ],
  },
];
