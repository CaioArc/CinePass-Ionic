import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';
import { BookingService } from '../../core/services/booking.service';
import { DEFAULT_TICKETS, TicketCategory } from '../../core/models/booking.model';

@Component({
  selector: 'app-ingressos',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, IonButton],
  template: `
    <main class="page">
      <p class="eyebrow">SUA RESERVA</p>
      <h1>Ingressos</h1>
      @if (!booking.draft().session || !booking.draft().movie) {
        <section class="panel empty"><h2>Escolha uma sessão primeiro</h2><p>Selecione um filme, cinema e horário para continuar.</p><ion-button routerLink="/filmes">Ver filmes</ion-button></section>
      } @else {
        <section class="panel selected"><div><span class="eyebrow">FILME</span><h2>{{ booking.draft().movie!.title }}</h2><p>{{ booking.draft().session!.cinema.name }} · {{ booking.draft().session!.room.type }} · {{ booking.draft().session!.date | date:'dd/MM/yyyy':'UTC' }} às {{ booking.draft().session!.time }}</p></div></section>
        <section class="panel ticket-list">
          <h2>Escolha a quantidade</h2>
          @for (ticket of ticketOptions; track ticket.category) {
            @let quantity = quantityFor(ticket.category);
            <article class="ticket">
              <div class="ticket-name"><strong class="ticket-label">{{ ticket.label }}</strong><span class="ticket-unit-price">{{ ticket.unitPrice | currency:'BRL':'symbol':'1.2-2':'pt-BR' }} por ingresso</span></div>
              <div class="quantity">
                <ion-button fill="outline" [attr.aria-label]="'Diminuir ' + ticket.label" [disabled]="quantity === 0" (click)="change(ticket.category, quantity - 1)">−</ion-button>
                <output>{{ quantity }}</output>
                <ion-button fill="outline" [attr.aria-label]="'Aumentar ' + ticket.label" (click)="change(ticket.category, quantity + 1)">+</ion-button>
              </div>
              <strong class="subtotal"><span>Subtotal</span> {{ ticket.unitPrice * quantity | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong>
            </article>
          }
          <div class="totals"><span>{{ booking.totalTickets }} ingresso(s)</span><strong>{{ booking.totalPrice | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></div>
          <ion-button expand="block" [disabled]="booking.totalTickets < 1" (click)="continue()">Escolher poltronas</ion-button>
        </section>
      }
    </main>
  `,
  styles: [`:host{display:block}.page{width:min(100% - 48px,var(--cp-content-width));min-height:60vh;margin:auto;padding:44px 0 70px}.eyebrow{margin:0 0 10px;color:var(--cp-accent);font-size:10px;font-weight:800;letter-spacing:.15em}h1{margin:0 0 24px;color:var(--cp-text);font-size:clamp(32px,5vw,46px);letter-spacing:-.04em}.panel{padding:22px;border:1px solid var(--cp-border);border-radius:14px;background:var(--cp-surface)}.selected{margin-bottom:18px}.selected h2,.ticket-list h2,.empty h2{margin:0 0 8px;color:var(--cp-text);font-size:18px}.selected p,.empty p{margin:0;color:var(--cp-muted);font-size:13px}.ticket-list h2{margin-bottom:18px}.ticket{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:18px;padding:16px 0;border-top:1px solid var(--cp-border)}.ticket-name{display:grid;gap:5px;min-width:0;color:#f7f5f6}.ticket-label{display:block;color:#f7f5f6;font-size:15px;font-weight:700}.ticket-unit-price{display:block;color:#b8b4b8;font-size:12px}.quantity{display:flex;align-items:center;gap:12px}.quantity output{min-width:20px;color:var(--cp-text);text-align:center;font-weight:700}.quantity ion-button{--color:var(--cp-text);--border-color:var(--cp-border-strong);--border-radius:8px;min-width:40px}.subtotal{display:grid;min-width:100px;gap:4px;color:#f7f5f6;text-align:right}.subtotal span{color:#b8b4b8;font-size:11px;font-weight:400}.totals{display:flex;justify-content:space-between;align-items:center;margin:14px 0 18px;padding-top:18px;border-top:1px solid var(--cp-border);color:var(--cp-muted)}.totals strong{color:var(--cp-text);font-size:20px}ion-button[expand=block]{--background:var(--cp-accent);--color:#fff;--border-radius:9px;--padding-top:16px;--padding-bottom:16px}.empty{padding:28px}.empty ion-button{margin-top:18px;--background:var(--cp-accent);--color:#fff}@media(max-width:640px){.page{width:calc(100% - 32px);padding:34px 0 48px}.panel{padding:16px}.ticket{grid-template-columns:1fr auto;gap:10px}.subtotal{grid-column:1/-1;text-align:left}}`],
})
export class IngressosPage {
  readonly booking = inject(BookingService);
  readonly ticketOptions = DEFAULT_TICKETS;

  quantityFor(category: TicketCategory): number {
    return this.booking.draft().tickets.find((ticket) => ticket.category === category)?.quantity ?? 0;
  }
  private readonly router = inject(Router);
  readonly hasSession = computed(() => !!this.booking.draft().session);

  change(category: TicketCategory, quantity: number): void {
    this.booking.setTicketQuantity(category, quantity);
  }

  continue(): void {
    if (this.booking.totalTickets > 0 && this.booking.draft().session) void this.router.navigate(['/poltronas']);
  }
}
