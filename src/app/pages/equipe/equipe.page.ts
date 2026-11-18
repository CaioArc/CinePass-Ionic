import { Component } from '@angular/core';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/angular/standalone';

interface TeamMember {
  name: string;
  role: string;
  contribution: string;
  initials: string;
}

@Component({
  selector: 'app-equipe',
  standalone: true,
  imports: [IonCard, IonCardContent, IonCardHeader, IonCardTitle],
  template: `
    <main class="team-page">
      <header class="page-heading">
        <p class="section-kicker">QUEM FAZ ACONTECER</p>
        <h1>Equipe CinePass</h1>
        <p>Conheça as pessoas e as frentes de trabalho que constroem a experiência CinePass.</p>
      </header>
      <section class="team-grid" aria-label="Integrantes do projeto">
        @for (member of members; track member.name) {
          <ion-card class="member-card">
            <ion-card-header>
              <div class="member-avatar" aria-hidden="true">{{ member.initials }}</div>
              <p class="member-role">{{ member.role }}</p>
              <ion-card-title>{{ member.name }}</ion-card-title>
            </ion-card-header>
            <ion-card-content>{{ member.contribution }}</ion-card-content>
          </ion-card>
        }
      </section>
    </main>
  `,
  styles: [
    `:host{display:block}.team-page{width:min(100% - 48px,var(--cp-content-width));min-height:60vh;margin:0 auto;padding:clamp(42px,8vh,88px) 0 72px}.page-heading{max-width:670px;margin-bottom:34px}.section-kicker{margin:0 0 13px;color:var(--cp-accent);font-size:10px;font-weight:800;letter-spacing:.16em}.page-heading h1{margin:0;color:var(--cp-text);font-size:clamp(34px,5vw,52px);line-height:1.05;letter-spacing:-.045em}.page-heading>p:last-child{max-width:550px;margin:16px 0 0;color:var(--cp-muted);font-size:15px;line-height:1.65}.team-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}.member-card{min-height:220px;margin:0;padding:8px 6px 6px;border:1px solid var(--cp-border);border-radius:var(--cp-radius-card);background:var(--cp-surface);box-shadow:none;transition:border-color .18s ease,transform .18s ease}.member-card:hover{transform:translateY(-2px);border-color:var(--cp-border-strong)}.member-card ion-card-header{padding:12px 14px 8px}.member-avatar{width:42px;height:42px;display:grid;place-items:center;margin-bottom:18px;border:1px solid rgba(229,27,62,.42);border-radius:12px;background:var(--cp-accent-soft);color:#ff6b81;font-size:13px;font-weight:800}.member-role{margin:0 0 7px;color:var(--cp-accent);font-size:10px;font-weight:750;letter-spacing:.08em;text-transform:uppercase}.member-card ion-card-title{color:var(--cp-text);font-size:19px;font-weight:700;letter-spacing:-.02em}.member-card ion-card-content{padding:8px 14px 16px;color:var(--cp-muted);font-size:13px;line-height:1.65}@media(max-width:900px){.team-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:640px){.team-page{width:calc(100% - 32px);padding:42px 0 48px}.page-heading{margin-bottom:24px}.team-grid{grid-template-columns:1fr;gap:12px}.member-card{min-height:0}.member-avatar{margin-bottom:14px}}@media(prefers-reduced-motion:reduce){.member-card{transition:none}}`,
  ],
})
export class EquipePage {
  readonly members: TeamMember[] = [
    { name: 'Caio Gabriel', role: 'Integração e estrutura', initials: 'CG', contribution: 'Organiza a estrutura do aplicativo e conecta páginas e componentes em uma experiência única.' },
    { name: 'Caio Marcos', role: 'API e Services', initials: 'CM', contribution: 'Responsável pela integração com os dados de filmes e pelos serviços que dão suporte ao aplicativo.' },
    { name: 'Victor Alves', role: 'Sessões e ingressos', initials: 'VA', contribution: 'Desenha o fluxo de escolha de cinema, sessões, horários e tipos de ingresso.' },
    { name: 'Pedro Luckas', role: 'Poltronas e reservas', initials: 'PL', contribution: 'Trabalha na seleção de assentos e na organização das informações da reserva.' },
    { name: 'Vitor', role: 'Pipes, diretivas e finalização', initials: 'V', contribution: 'Cuida dos formatadores e comportamentos personalizados, além da revisão final do projeto.' },
  ];
}
