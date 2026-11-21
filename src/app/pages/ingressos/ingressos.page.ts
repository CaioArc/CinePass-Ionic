import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';
import { BookingService } from '../../core/services/booking.service';
import { TicketCategory } from '../../core/models/booking.model';

@Component({
  selector: 'app-ingressos',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, IonButton, RouterLink],
  template: `
    <main class="tickets-page">
      <p class="eyebrow">SUA RESERVA</p>
      <h1>Ingressos</h1>
      @if (!booking.draft().movie || !booking.draft().session) {
        <section class="panel empty-state">
          <h2>Escolha uma sessão primeiro</h2>
          <p>Selecione um filme, cinema e horário para continuar.</p>
          <ion-button routerLink="/filmes">Ver filmes</ion-button>
        </section>
      } @else {
        <section class="panel session-card" aria-label="Sessão selecionada">
          <div>
            <span class="section-kicker">FILME</span>
            <h2>{{ booking.draft().movie!.title }}</h2>
            <p>{{ booking.draft().session!.cinema.name }} · {{ booking.draft().session!.room.type }} · {{ booking.draft().session!.date | date:'dd/MM/yyyy':'UTC' }} às {{ booking.draft().session!.time }}</p>
          </div>
        </section>

        <section class="panel ticket-panel" aria-labelledby="ticket-heading">
          <h2 id="ticket-heading">Escolha a quantidade</h2>
          <div class="ticket-rows">
            @for (ticket of booking.ticketSelections(); track ticket.category) {
              <article class="ticket-row">
                <div class="ticket-info">
                  <strong>{{ ticket.label }}</strong>
                  <span>{{ ticket.unitPrice | currency:'BRL':'symbol':'1.2-2':'pt-BR' }} por ingresso</span>
                </div>
                <div class="ticket-counter" [attr.aria-label]="'Quantidade de ' + ticket.label">
                  <ion-button fill="outline" [attr.aria-label]="'Diminuir ' + ticket.label" [disabled]="ticket.quantity <= 0" (click)="change(ticket.category, ticket.quantity - 1)">−</ion-button>
                  <span class="ticket-count" aria-live="polite">{{ ticket.quantity }}</span>
                  <ion-button fill="outline" [attr.aria-label]="'Aumentar ' + ticket.label" (click)="change(ticket.category, ticket.quantity + 1)">+</ion-button>
                </div>
                <div class="ticket-subtotal">
                  <span>Subtotal</span>
                  <strong>{{ ticket.unitPrice * ticket.quantity | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong>
                </div>
              </article>
            }
          </div>
          <div class="purchase-total">
            <span>{{ booking.totalTickets() }} ingresso(s)</span>
            <strong>{{ booking.totalPrice() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong>
          </div>
          <ion-button class="continue-button" expand="block" [disabled]="booking.totalTickets() < 1" (click)="continue()">Escolher poltronas</ion-button>
        </section>
      }
    </main>
  `,
  styles: [`
    :host{display:block;width:100%;color:#f5f3f4}.tickets-page{width:min(100% - 48px,var(--cp-content-width));min-height:60vh;margin:0 auto;padding:44px 0 70px}.eyebrow,.section-kicker{display:block;margin:0 0 10px;color:var(--cp-accent);font-size:10px;font-weight:800;letter-spacing:.15em}.tickets-page>h1{margin:0 0 24px;color:#f5f3f4;font-size:clamp(32px,5vw,46px);letter-spacing:-.04em}.panel{padding:22px;border:1px solid var(--cp-border);border-radius:14px;background:var(--cp-surface)}.session-card{margin-bottom:18px}.session-card h2,.ticket-panel h2,.empty-state h2{margin:0 0 9px;color:#f5f3f4;font-size:18px}.session-card p,.empty-state p{margin:0;color:#c8c5c9;font-size:13px;line-height:1.6}.ticket-panel>h2{margin-bottom:16px}.ticket-row{display:grid;grid-template-columns:minmax(0,1fr) auto minmax(120px,auto);align-items:center;gap:20px;min-height:84px;padding:16px 0;border-top:1px solid var(--cp-border)}.ticket-info{display:grid;gap:6px;min-width:0}.ticket-info strong{display:block!important;visibility:visible!important;opacity:1!important;color:#f5f3f4!important;font-size:15px;font-weight:750}.ticket-info span{display:block!important;visibility:visible!important;opacity:1!important;color:#c8c5c9!important;font-size:13px}.ticket-counter{display:flex;align-items:center;justify-content:center;gap:12px}.ticket-counter ion-button{--color:#f5f3f4;--border-color:var(--cp-border-strong);--border-radius:8px;min-width:42px;margin:0}.ticket-count{display:inline-flex!important;align-items:center;justify-content:center;min-width:28px;color:#fff!important;font-size:15px;font-weight:750;visibility:visible!important;opacity:1!important}.ticket-subtotal{display:grid;gap:5px;min-width:120px;text-align:right}.ticket-subtotal span{display:block!important;color:#aaa6ac!important;font-size:11px;visibility:visible!important;opacity:1!important}.ticket-subtotal strong{display:block!important;color:#f5f3f4!important;font-size:15px;font-weight:700;visibility:visible!important;opacity:1!important}.purchase-total{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:8px;padding:18px 0;border-top:1px solid var(--cp-border);color:#d0cdd0;font-size:14px}.purchase-total strong{color:#fff;font-size:20px}.continue-button{--background:var(--cp-accent);--color:#fff;--border-radius:9px;--padding-top:16px;--padding-bottom:16px}.empty-state ion-button{margin-top:18px;--background:var(--cp-accent);--color:#fff}@media(max-width:640px){.tickets-page{width:calc(100% - 32px);padding:34px 0 48px}.panel{padding:16px}.ticket-row{grid-template-columns:minmax(0,1fr) auto;gap:12px}.ticket-info{grid-column:1}.ticket-counter{grid-column:2;grid-row:1 / span 2}.ticket-subtotal{grid-column:1;grid-row:2;text-align:left;display:flex;align-items:center;gap:8px}.ticket-subtotal strong{font-size:13px}.purchase-total strong{font-size:18px}}
  `],
})
export class IngressosPage {
  readonly booking = inject(BookingService);
  private readonly router = inject(Router);

  change(category: TicketCategory, quantity: number): void {
    this.booking.setTicketQuantity(category, quantity);
  }

  continue(): void {
    if (this.booking.totalTickets() > 0 && this.booking.draft().session) void this.router.navigate(['/poltronas']);
  }
}
