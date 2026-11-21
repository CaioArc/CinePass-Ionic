import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';
import { BookingService } from '../../core/services/booking.service';
import { SeatStatusDirective } from '../../directives/seat-status.directive';
import { Seat, SeatStatus } from '../../core/models/booking.model';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const SEATS_PER_ROW = 12;

interface SeatCell {
  id: string;
  row: string;
  number: number;
}

@Component({
  selector: 'app-poltronas',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, SeatStatusDirective, IonButton, RouterLink],
  template: `
    <main class="page">
      <p class="eyebrow">ESCOLHA SEU LUGAR</p>
      <h1>Poltronas</h1>

      @if (!ready()) {
        <section class="panel empty">
          <h2>Complete os passos anteriores</h2>
          <p>Selecione o filme, a sessão e a quantidade de ingressos antes de escolher as poltronas.</p>
          <ion-button routerLink="/filmes">Ver filmes</ion-button>
        </section>
      } @else {
        <section class="panel selected">
          <div>
            <span class="eyebrow">SESSÃO</span>
            <h2>{{ booking.draft().movie!.title }}</h2>
            <p>{{ booking.draft().session!.cinema.name }} · {{ booking.draft().session!.room.name }} · {{ booking.draft().session!.date | date:'dd/MM/yyyy':'UTC' }} às {{ booking.draft().session!.time }}</p>
          </div>
          <strong>{{ booking.totalPrice() | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</strong>
        </section>

        <section class="panel hall">
          <div class="screen" aria-hidden="true">TELA</div>

          <div class="hall-map" role="group" aria-label="Mapa de assentos">
            @for (seatRow of layout; track seatRow.row) {
              <div class="seat-row">
                <span class="row-label">{{ seatRow.row }}</span>
                <div class="seat-list">
                  @for (seat of seatRow.seats; track seat.id) {
                    @let status = statusOf(seat.id);
                    <button
                      type="button"
                      class="seat"
                      [appSeatStatus]="status"
                      [attr.aria-label]="'Fileira ' + seat.row + ' assento ' + seat.number + ', ' + labelFor(status)"
                      [attr.aria-pressed]="status === 'selected'"
                      (click)="toggle(seat)"
                    >{{ seat.number }}</button>
                  }
                </div>
                <span class="row-label">{{ seatRow.row }}</span>
              </div>
            }
          </div>

          <ul class="legend">
            <li><span class="swatch available"></span> Disponível</li>
            <li><span class="swatch selected"></span> Selecionado</li>
            <li><span class="swatch occupied"></span> Ocupado</li>
          </ul>

          <div class="summary">
            <p>
              <strong>{{ selectedCount() }} / {{ ticketCount() }}</strong>
              poltronas selecionadas
              @if (remaining() > 0) { · restam {{ remaining() }} }
            </p>
            @if (selectedCount()) {
              <p class="picks">{{ seatLabels() }}</p>
            }
          </div>

          @if (remaining() > 0) {
            <p class="hint">Selecione exatamente {{ ticketCount() }} poltrona(s) para continuar.</p>
          }

          <ion-button expand="block" [disabled]="!canContinue()" (click)="continue()">Ir para o resumo</ion-button>
        </section>
      }
    </main>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .page { width: min(100% - 48px, var(--cp-content-width)); min-height: 60vh; margin: auto; padding: 44px 0 70px; }
    .eyebrow { margin: 0 0 10px; color: var(--cp-accent); font-size: 10px; font-weight: 800; letter-spacing: .15em; }
    h1 { margin: 0 0 24px; color: var(--cp-text); font-size: clamp(32px, 5vw, 46px); letter-spacing: -.04em; }
    .panel { padding: 22px; border: 1px solid var(--cp-border); border-radius: 14px; background: var(--cp-surface); }
    .selected { display: flex; justify-content: space-between; gap: 16px; align-items: center; margin-bottom: 18px; }
    .selected h2, .empty h2 { margin: 0 0 8px; color: var(--cp-text); font-size: 18px; }
    .selected p, .empty p, .summary p, .hint { margin: 0; color: var(--cp-muted); font-size: 13px; }
    .selected strong { color: var(--cp-text); font-size: 20px; }
    .screen { margin: 0 auto 28px; width: min(100%, 520px); padding: 10px; border-radius: 0 0 40% 40% / 0 0 80% 80%; background: linear-gradient(180deg, #3a3a44, #1c1c22); color: var(--cp-subtle); text-align: center; letter-spacing: .3em; font-size: 11px; font-weight: 700; }
    .hall-map { display: flex; flex-direction: column; gap: 8px; width: 100%; min-height: 280px; overflow-x: auto; padding-bottom: 8px; }
    .seat-row { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 36px; }
    .row-label { flex: 0 0 22px; color: var(--cp-subtle); font-size: 12px; font-weight: 700; text-align: center; }
    .seat-list { display: flex; flex-wrap: nowrap; justify-content: center; gap: 6px; }
    .seat { flex: 0 0 34px; width: 34px; height: 34px; margin: 0; padding: 0; border: 1px solid var(--cp-border-strong); border-radius: 8px 8px 12px 12px; background: #0a0a0c; color: #f5f3f4; font-size: 11px; font-weight: 700; line-height: 34px; cursor: pointer; appearance: none; }
    .seat:hover:not(:disabled) { border-color: var(--cp-accent); }
    .seat.selected { background: var(--cp-accent); border-color: var(--cp-accent); color: #fff; }
    .seat.occupied, .seat:disabled { background: #2a2a31; color: #6d6a70; cursor: not-allowed; opacity: .7; }
    .legend { display: flex; flex-wrap: wrap; gap: 16px; margin: 22px 0 0; padding: 0; list-style: none; color: var(--cp-muted); font-size: 13px; }
    .legend li { display: flex; align-items: center; gap: 8px; }
    .swatch { width: 16px; height: 16px; border-radius: 4px; border: 1px solid var(--cp-border-strong); background: #0a0a0c; }
    .swatch.selected { background: var(--cp-accent); border-color: var(--cp-accent); }
    .swatch.occupied { background: #2a2a31; }
    .summary { margin: 22px 0 10px; }
    .summary strong { color: var(--cp-text); }
    .picks { margin-top: 6px; color: var(--cp-text); }
    .hint { margin-bottom: 12px; color: #ff9aaa; }
    ion-button[expand=block] { --background: var(--cp-accent); --color: #fff; --border-radius: 9px; --padding-top: 16px; --padding-bottom: 16px; }
    .empty ion-button { margin-top: 18px; --background: var(--cp-accent); --color: #fff; }
    @media (max-width: 640px) {
      .page { width: calc(100% - 32px); padding: 34px 0 48px; }
      .panel { padding: 16px; }
      .seat { flex-basis: 28px; width: 28px; height: 28px; line-height: 28px; font-size: 10px; }
      .selected { flex-direction: column; align-items: flex-start; }
    }
  `],
})
export class PoltronasPage {
  readonly booking = inject(BookingService);
  private readonly router = inject(Router);
  readonly layout = ROWS.map((row) => ({
    row,
    seats: Array.from({ length: SEATS_PER_ROW }, (_, index) => {
      const number = index + 1;
      return { id: `${row}${number}`, row, number } satisfies SeatCell;
    }),
  }));
  readonly ready = computed(() => !!this.booking.draft().session && !!this.booking.draft().movie && this.booking.totalTickets() > 0);
  readonly ticketCount = computed(() => this.booking.totalTickets());
  readonly selectedCount = computed(() => this.booking.selectedSeats()?.length ?? 0);
  readonly remaining = computed(() => Math.max(0, this.ticketCount() - this.selectedCount()));
  private readonly occupied = computed(() => this.occupiedForSession(this.booking.draft().session?.id ?? ''));

  statusOf(id: string): SeatStatus {
    if (this.occupied().has(id)) return 'occupied';
    if ((this.booking.selectedSeats() ?? []).some((seat) => seat.id === id)) return 'selected';
    return 'available';
  }

  labelFor(status: SeatStatus): string {
    if (status === 'occupied') return 'ocupado';
    if (status === 'selected') return 'selecionado';
    return 'disponível';
  }

  toggle(seat: SeatCell): void {
    if (this.occupied().has(seat.id)) return;
    const current = [...(this.booking.selectedSeats() ?? [])];
    const existing = current.find((item) => item.id === seat.id);
    if (existing) {
      this.booking.setSeats(current.filter((item) => item.id !== seat.id));
      return;
    }
    if (current.length >= this.ticketCount()) return;
    const next: Seat = { id: seat.id, row: seat.row, number: seat.number };
    this.booking.setSeats([...current, next].sort((a, b) => a.id.localeCompare(b.id, 'pt-BR', { numeric: true })));
  }

  seatLabels(): string {
    return (this.booking.selectedSeats() ?? []).map((seat) => seat.id).join(', ');
  }

  canContinue(): boolean {
    return this.selectedCount() === this.ticketCount() && this.ticketCount() > 0;
  }

  continue(): void {
    if (!this.canContinue()) return;
    void this.router.navigate(['/resumo']);
  }

  private occupiedForSession(sessionId: string): Set<string> {
    const occupied = new Set<string>();
    if (!sessionId) return occupied;
    let hash = 0;
    for (let index = 0; index < sessionId.length; index += 1) hash = (hash * 31 + sessionId.charCodeAt(index)) >>> 0;
    const total = ROWS.length * SEATS_PER_ROW;
    const count = 18 + (hash % 8);
    for (let offset = 0; offset < count; offset += 1) {
      const slot = (hash + offset * 7) % total;
      const row = ROWS[Math.floor(slot / SEATS_PER_ROW)];
      const number = (slot % SEATS_PER_ROW) + 1;
      occupied.add(`${row}${number}`);
    }
    return occupied;
  }
}
