import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';
import { BookingService } from '../../core/services/booking.service';
import { DEFAULT_TICKETS, TicketCategory } from '../../core/models/booking.model';
import { RatingPipe } from '../../pipes/rating.pipe';

@Component({
  selector: 'app-resumo',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RatingPipe, RouterLink, IonButton],
  template: `
    <main class="page">
      <p class="eyebrow">CINEPASS · REVISÃO DO PEDIDO</p>
      <h1>Resumo da compra</h1>

      @if (booking.draft().movie && booking.draft().session && booking.totalTickets() > 0) {
        <section class="panel movie-panel">
          @if (booking.draft().movie!.posterUrl) {
            <img class="poster" [src]="booking.draft().movie!.posterUrl!" [alt]="'Pôster de ' + booking.draft().movie!.title" />
          } @else {
            <div class="poster poster-placeholder">CinePass</div>
          }
          <div class="movie-copy">
            <p class="section-kicker">FILME</p>
            <h2>{{ booking.draft().movie!.title }}</h2>
            <p class="rating">{{ booking.draft().movie!.rating | rating }}</p>
          </div>
        </section>

        <section class="panel">
          <p class="section-kicker">SESSÃO</p>
          <h2>{{ booking.draft().session!.cinema.name }}</h2>
          <p class="muted">{{ booking.draft().session!.cinema.address }}</p>
          <div class="facts">
            <span>{{ booking.draft().session!.room.name }}</span>
            <span>{{ booking.draft().session!.room.type }}</span>
            <span>{{ booking.draft().session!.date | date:'dd/MM/yyyy':'UTC' }}</span>
            <span>Às {{ booking.draft().session!.time }}</span>
          </div>
        </section>

        <section class="panel">
          <p class="section-kicker">INGRESSOS</p>
          @for (ticket of booking.ticketSelections(); track ticket.category) {
            @if (ticket.quantity > 0) {
              <div class="line-item">
                <span style="display:block!important;color:#d0cdd0!important">{{ ticket.label }} · {{ ticket.quantity }} × {{ ticket.unitPrice | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</span>
                <strong style="display:block!important;color:#f5f3f4!important">{{ ticket.unitPrice * ticket.quantity | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong>
              </div>
            }
          }
          <div class="line-item total"><span>{{ booking.totalTickets() }} ingresso(s)</span><strong>{{ booking.totalPrice() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong></div>
        </section>

        <section class="panel">
          <p class="section-kicker">POLTRONAS</p>
          @if (booking.selectedSeats().length === booking.totalTickets()) {
            <div class="seat-list">
              @for (seat of booking.selectedSeats(); track seat.id) {
                <span class="seat-chip">Fileira {{ seat.row }} · Assento {{ seat.number }}</span>
              }
            </div>
          } @else {
            <p class="muted">Faltam poltronas para completar os ingressos selecionados.</p>
          }
        </section>

        <section class="payment panel">
          <div><p class="section-kicker">PAGAMENTO SIMULADO</p><h2>Valor total</h2></div>
          <strong>{{ booking.totalPrice() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong>
        </section>
        @if (finalizeError()) { <p class="error" role="alert">{{ finalizeError() }}</p> }
        <ion-button class="finish-button" expand="block" [disabled]="!canFinalize()" (click)="finalize()">Finalizar pedido</ion-button>
      } @else if (booking.completedBooking(); as completed) {
        <section class="confirmation panel" role="status">
          <span class="confirmation-mark" aria-hidden="true">✓</span>
          <p class="section-kicker">RESERVA CONFIRMADA</p>
          <h2>Pedido finalizado com sucesso</h2>
          <p class="booking-code">Código da reserva <strong>{{ completed.bookingId }}</strong></p>
          <div class="receipt-movie">
            @if (completed.movie?.posterUrl) { <img class="receipt-poster" [src]="completed.movie!.posterUrl!" [alt]="'Pôster de ' + completed.movie!.title" /> }
            <div><strong>{{ completed.movie?.title }}</strong><span>{{ completed.movie?.rating | rating }}</span></div>
          </div>
          <div class="receipt-section">
            <strong>Sessão</strong>
            <span>{{ completed.session?.cinema?.name }} · {{ completed.session?.room?.name }} ({{ completed.session?.room?.type }})</span>
            <span>{{ completed.session?.date | date:'dd/MM/yyyy':'UTC' }} às {{ completed.session?.time }}</span>
          </div>
          <div class="receipt-section">
            <strong>Ingressos</strong>
            @for (ticket of ticketOptions; track ticket.category) {
              @let quantity = completedQuantity(completed, ticket.category);
              @if (quantity > 0) { <span class="receipt-ticket" style="display:block!important;color:#d0cdd0!important">{{ ticket.label }} × {{ quantity }} · {{ ticket.unitPrice * quantity | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</span> }
            }
          </div>
          <div class="receipt-section">
            <strong>Poltronas</strong>
            <div class="receipt-seat-list">@for (seat of completed.seats; track seat.id) { <span>Fileira {{ seat.row }}, assento {{ seat.number }}</span> }</div>
          </div>
          <p class="confirmed-total">Total: {{ completed.total | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</p>
          <p class="muted">Finalizada em {{ completed.finalizedAt | date:'dd/MM/yyyy HH:mm' }}</p>
          <ion-button fill="outline" routerLink="/home">Voltar para o início</ion-button>
        </section>
      } @else {
        <section class="panel empty">
          <h2>Sua reserva ainda não está pronta</h2>
          <p class="muted">Escolha um filme, sessão, ingressos e poltronas para revisar a compra.</p>
          <ion-button routerLink="/filmes">Ver filmes</ion-button>
        </section>
      }
    </main>
  `,
  styles: [`:host{display:block}.page{width:min(100% - 48px,var(--cp-content-width));min-height:60vh;margin:auto;padding:44px 0 70px}.eyebrow,.section-kicker{margin:0 0 10px;color:var(--cp-accent);font-size:10px;font-weight:800;letter-spacing:.15em}h1{margin:0 0 24px;color:var(--cp-text);font-size:clamp(32px,5vw,46px);letter-spacing:-.04em}.panel{margin-bottom:16px;padding:22px;border:1px solid var(--cp-border);border-radius:14px;background:var(--cp-surface)}.panel h2{margin:0 0 10px;color:var(--cp-text);font-size:18px}.movie-panel{display:flex;align-items:center;gap:18px}.poster{width:92px;aspect-ratio:2/3;object-fit:cover;border-radius:9px;background:var(--cp-surface-raised)}.poster-placeholder{display:grid;place-items:center;color:var(--cp-muted);font-size:12px}.movie-copy h2{margin:0;color:var(--cp-text);font-size:21px}.rating{margin:8px 0 0;color:var(--cp-muted);font-size:14px}.panel>.section-kicker{margin-bottom:8px}.muted{margin:7px 0 0;color:var(--cp-muted);font-size:13px;line-height:1.6}.facts{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}.facts span,.seat-chip{padding:7px 10px;border:1px solid var(--cp-border);border-radius:8px;color:var(--cp-muted);font-size:12px}.line-item{display:flex;justify-content:space-between;gap:14px;padding:12px 0;border-top:1px solid var(--cp-border);color:var(--cp-muted);font-size:14px}.line-item strong{display:block!important;flex:none;color:#f5f3f4!important;visibility:visible!important;opacity:1!important}.line-item span{display:block!important;color:#d0cdd0!important;visibility:visible!important;opacity:1!important}.line-item.total{margin-top:8px;padding-top:18px;font-weight:700}.line-item.total strong{font-size:18px}.seat-list{display:flex;flex-wrap:wrap;gap:8px}.seat-chip{color:var(--cp-text)}.payment{display:flex;align-items:center;justify-content:space-between;gap:14px;border-color:rgba(229,27,62,.42)}.payment h2{margin:0}.payment>strong{color:var(--cp-text);font-size:24px}.finish-button{--background:var(--cp-accent);--color:#fff;--border-radius:9px;--padding-top:16px;--padding-bottom:16px}.finish-button[disabled]{opacity:.55}.error{color:#ff9aaa}.empty ion-button,.confirmation ion-button{margin-top:18px;--background:var(--cp-accent);--color:#fff;--border-radius:9px}.confirmation{padding:clamp(24px,5vw,48px);text-align:center}.confirmation-mark{width:52px;height:52px;display:grid;place-items:center;margin:0 auto 18px;border-radius:50%;background:var(--cp-accent);color:#fff;font-size:26px}.confirmation h2{font-size:24px}.receipt-movie{display:flex;align-items:center;justify-content:center;gap:12px;margin:22px auto;text-align:left}.receipt-poster{width:58px;aspect-ratio:2/3;object-fit:cover;border-radius:6px}.receipt-movie div,.receipt-section{display:grid;gap:6px}.receipt-movie div strong,.receipt-section strong{color:var(--cp-text)}.receipt-movie div span,.receipt-section span{display:block!important;color:#d0cdd0!important;font-size:13px;visibility:visible!important;opacity:1!important}.receipt-section{padding:14px 0;border-top:1px solid var(--cp-border);text-align:left}.receipt-seat-list{display:flex;flex-wrap:wrap;gap:7px}.receipt-seat-list span{padding:6px 9px;border:1px solid var(--cp-border);border-radius:7px}.confirmation .confirmed-total{margin-top:18px}.booking-code,.confirmed-total{color:var(--cp-muted);font-size:14px}.booking-code strong,.confirmed-total{color:var(--cp-text)}.confirmed-total{font-size:18px;font-weight:700}@media(max-width:640px){.page{width:calc(100% - 32px);padding:34px 0 48px}.panel{padding:16px}.payment>strong{font-size:21px}.line-item{font-size:13px}}`],
})
export class ResumoPage {
  readonly booking = inject(BookingService);
  readonly ticketOptions = DEFAULT_TICKETS;

  quantityFor(category: TicketCategory): number {
    return this.booking.draft().tickets.find((ticket) => ticket.category === category)?.quantity ?? 0;
  }

  completedQuantity(completed: { tickets: { category: TicketCategory; quantity: number }[] }, category: TicketCategory): number {
    return completed.tickets.find((ticket) => ticket.category === category)?.quantity ?? 0;
  }
  readonly finalizeError = signal<string | null>(null);

  canFinalize(): boolean {
    const draft = this.booking.draft();
    const count = this.booking.totalTickets();
    return !!draft.movie && !!draft.session && count > 0 && this.booking.selectedSeats().length === count;
  }

  finalize(): void {
    this.finalizeError.set(null);
    if (!this.canFinalize()) {
      this.finalizeError.set('Confira a sessão e selecione uma poltrona para cada ingresso.');
      return;
    }
    if (!this.booking.finalizeBooking()) {
      this.finalizeError.set('Não foi possível finalizar: revise os dados da reserva.');
    }
  }
}
