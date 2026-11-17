import { Routes } from '@angular/router';
export const routes: Routes = [
{path:'',pathMatch:'full',redirectTo:'home'},
{path:'home',loadComponent:()=>import('./pages/home/home.page').then(m=>m.HomePage)},
{path:'filmes',loadComponent:()=>import('./pages/filmes/filmes.page').then(m=>m.FilmesPage)},
{path:'detalhes/:id',loadComponent:()=>import('./pages/detalhes/detalhes.page').then(m=>m.DetalhesPage)},
{path:'sessoes',loadComponent:()=>import('./pages/sessoes/sessoes.page').then(m=>m.SessoesPage)},
{path:'ingressos',loadComponent:()=>import('./pages/ingressos/ingressos.page').then(m=>m.IngressosPage)},
{path:'poltronas',loadComponent:()=>import('./pages/poltronas/poltronas.page').then(m=>m.PoltronasPage)},
{path:'resumo',loadComponent:()=>import('./pages/resumo/resumo.page').then(m=>m.ResumoPage)},
{path:'equipe',loadComponent:()=>import('./pages/equipe/equipe.page').then(m=>m.EquipePage)},
{path:'**',loadComponent:()=>import('./pages/not-found/not-found.page').then(m=>m.NotFoundPage)}];
