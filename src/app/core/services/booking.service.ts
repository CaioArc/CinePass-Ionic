import { Injectable, computed, signal } from '@angular/core';
import { BookingDraft, CompletedBooking, DEFAULT_TICKETS, Seat, Session, TicketCategory, TicketSelection } from '../models/booking.model';
import { Movie } from '../models/movie.model';

const STORAGE_KEY = 'cinepass_booking';
const COMPLETED_STORAGE_KEY = 'cinepass_completed_booking';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly draftSignal = signal<BookingDraft>(this.loadDraft());
  private readonly completedSignal = signal<CompletedBooking | null>(this.loadCompleted());

  readonly draft = this.draftSignal.asReadonly();
  readonly ticketSelections = computed(() => this.normalizeTickets(this.draftSignal().tickets));
  readonly selectedSeats = computed(() => this.normalizeSeats(this.draftSignal().seats));
  readonly completedBooking = computed(() => {
    const completed = this.completedSignal();
    return completed ? { ...completed, tickets: this.normalizeTickets(completed.tickets), seats: this.normalizeSeats(completed.seats), total: this.calculateTotal(completed.tickets) } : null;
  });
  readonly totalTickets = computed(() => this.ticketSelections().reduce((sum, ticket) => sum + ticket.quantity, 0));
  readonly totalPrice = computed(() => this.calculateTotal(this.ticketSelections()));

  saveBooking(changes: Partial<BookingDraft>): void { this.update(changes); }
  getBooking(): BookingDraft { return this.draftSignal(); }

  setMovie(movie: Movie): void { this.update({ movie }); }

  setSession(session: Session): void {
    const sameSession = this.draftSignal().session?.id === session.id;
    this.update({
      session,
      seats: sameSession ? this.selectedSeats() : [],
      tickets: sameSession ? this.ticketSelections() : this.normalizeTickets(),
    });
  }

  setTickets(tickets: TicketSelection[]): void { this.update({ tickets: this.normalizeTickets(tickets) }); }

  setTicketQuantity(category: TicketCategory, quantity: number): void {
    const tickets = this.ticketSelections().map((ticket) => ticket.category === category
      ? { ...ticket, quantity: this.toCount(quantity) }
      : ticket);
    this.update({ tickets, seats: this.selectedSeats().slice(0, tickets.reduce((sum, ticket) => sum + ticket.quantity, 0)) });
  }

  setSeats(seats: Seat[]): void {
    const normalized = this.normalizeSeats(seats);
    this.update({ seats: normalized.slice(0, this.totalTickets()) });
  }

  finalizeBooking(): CompletedBooking | null {
    const draft = this.draftSignal();
    const tickets = this.ticketSelections();
    const seats = this.selectedSeats();
    const ticketCount = tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    if (!draft.movie || !draft.session || ticketCount < 1 || seats.length !== ticketCount) return null;
    if (new Set(seats.map((seat) => seat['id'])).size !== seats.length) return null;

    const completed: CompletedBooking = {
      ...JSON.parse(JSON.stringify(draft)) as BookingDraft,
      tickets,
      seats,
      bookingId: 'CP-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 7).toUpperCase(),
      finalizedAt: new Date().toISOString(),
      total: this.calculateTotal(tickets),
    };
    this.completedSignal.set(completed);
    try { localStorage.setItem(COMPLETED_STORAGE_KEY, JSON.stringify(completed)); } catch { /* Mantém a confirmação em memória. */ }
    this.clearBooking();
    return completed;
  }

  resetTickets(): void { this.update({ tickets: this.normalizeTickets(), seats: [] }); }

  clearBooking(): void {
    this.draftSignal.set(this.emptyDraft());
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Mantém o fluxo em memória. */ }
  }

  calculateTotal(tickets: TicketSelection[] = this.ticketSelections()): number {
    return this.normalizeTickets(tickets).reduce((sum, ticket) => sum + ticket.quantity * ticket.unitPrice, 0);
  }

  private toCount(value: unknown): number {
    const numeric = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(numeric) ? Math.max(0, Math.floor(numeric)) : 0;
  }

  private normalizeCategory(value: unknown): TicketCategory | null {
    const key = String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    if (key.includes('estud')) return 'estudante';
    if (key.includes('idos')) return 'idoso';
    if (key.includes('inteir') || key === 'full') return 'inteira';
    if (key.includes('meia') || key === 'half') return 'meia';
    return null;
  }

  private normalizeTickets(input: unknown = []): TicketSelection[] {
    let source: Record<string, unknown>[] = [];
    if (Array.isArray(input)) {
      source = input.map((item, index) => item && typeof item === 'object' ? item as Record<string, unknown> : { category: DEFAULT_TICKETS[index]?.category, quantity: item });
    } else if (input && typeof input === 'object') {
      source = Object.entries(input as Record<string, unknown>).map(([category, value]) =>
        value && typeof value === 'object' ? { category, ...(value as Record<string, unknown>) } : { category, quantity: value });
    }

    return DEFAULT_TICKETS.map((base, index) => {
      const categoryOf = (item: Record<string, unknown>) => this.normalizeCategory(item['category'] ?? item['ticketCategory'] ?? item['type'] ?? item['ticketType'] ?? item['kind'] ?? item['label'] ?? item['name'] ?? item['title']);
      const saved = source.find((item) => categoryOf(item) === base.category)
        ?? (!source.some((item) => categoryOf(item)) && source.length <= DEFAULT_TICKETS.length ? source[index] : undefined);
      const quantity = saved?.['quantity'] ?? saved?.['count'] ?? saved?.['qty'] ?? saved?.['amount'] ?? saved?.['quantidade'];
      return { ...base, quantity: this.toCount(quantity), unitPrice: base.unitPrice };
    });
  }

  private normalizeSeats(input: unknown): Seat[] {
    if (!Array.isArray(input)) return [];
    return input.flatMap((item, index): Seat[] => {
      const seat = item && typeof item === 'object' ? item as Record<string, unknown> : {};
      const idValue = typeof item === 'string' || typeof item === 'number' ? item : seat['id'] ?? seat['code'] ?? seat['assento'];
      const id = String(idValue ?? '').toUpperCase().replace(/\s+/g, '');
      const match = /^([A-Z])[-]?0*(\d{1,2})$/.exec(id);
      const trailingNumber = /(?:[A-Z]+[-]?)?0*(\d{1,2})$/.exec(id);
      const row = String(seat['row'] ?? seat['fileira'] ?? match?.[1] ?? String.fromCharCode(65 + Math.floor(index / 12))).toUpperCase();
      const number = this.toCount(seat['number'] ?? seat['numero'] ?? match?.[2] ?? trailingNumber?.[1] ?? (index % 12) + 1);
      if (number < 1) return [];
      return [{ id: id || row + number, row, number }];
    });
  }

  private update(changes: Partial<BookingDraft>): void {
    const merged = { ...this.draftSignal(), ...changes };
    const next: BookingDraft = {
      ...merged,
      tickets: this.normalizeTickets(merged.tickets),
      seats: this.normalizeSeats(merged.seats),
    };
    this.draftSignal.set(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Mantém o fluxo em memória. */ }
  }

  private loadCompleted(): CompletedBooking | null {
    try {
      const raw = localStorage.getItem(COMPLETED_STORAGE_KEY);
      if (!raw) return null;
      const saved = JSON.parse(raw) as Partial<CompletedBooking>;
      if (!saved.bookingId || !saved.movie || !saved.session) return null;
      const tickets = this.normalizeTickets(saved.tickets);
      const seats = this.normalizeSeats(saved.seats);
      return {
        ...saved,
        movie: saved.movie,
        session: saved.session,
        tickets,
        seats,
        total: this.calculateTotal(tickets),
        bookingId: saved.bookingId,
        finalizedAt: saved.finalizedAt ?? new Date().toISOString(),
      } as CompletedBooking;
    } catch { return null; }
  }

  private emptyDraft(): BookingDraft {
    return { movie: null, session: null, tickets: this.normalizeTickets(), seats: [] };
  }

  private loadDraft(): BookingDraft {
    const empty = this.emptyDraft();
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return empty;
      const saved = JSON.parse(raw) as Partial<BookingDraft>;
      return { movie: saved.movie ?? null, session: saved.session ?? null, tickets: this.normalizeTickets(saved.tickets), seats: this.normalizeSeats(saved.seats) };
    } catch { return empty; }
  }
}
