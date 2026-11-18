import { Injectable, signal } from '@angular/core';
import { BookingDraft, DEFAULT_TICKETS, Session, TicketCategory } from '../models/booking.model';
import { Movie } from '../models/movie.model';

const STORAGE_KEY = 'cinepass-booking-draft';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly draftSignal = signal<BookingDraft>(this.loadDraft());
  readonly draft = this.draftSignal.asReadonly();

  setMovie(movie: Movie): void {
    this.update({ movie });
  }

  setSession(session: Session): void {
    this.update({ session });
  }

  setTicketQuantity(category: TicketCategory, quantity: number): void {
    const safeQuantity = Math.max(0, Math.floor(quantity));
    const current = this.draftSignal().tickets;
    const tickets = DEFAULT_TICKETS.map((base) => {
      const ticket = current.find((item) => item.category === base.category) ?? base;
      return base.category === category ? { ...base, quantity: safeQuantity } : { ...base, quantity: ticket.quantity };
    });
    this.update({ tickets });
  }

  resetTickets(): void {
    this.update({ tickets: DEFAULT_TICKETS.map((ticket) => ({ ...ticket })) });
  }

  get totalTickets(): number {
    return this.draftSignal().tickets.reduce((total, ticket) => total + ticket.quantity, 0);
  }

  get totalPrice(): number {
    return this.draftSignal().tickets.reduce((total, ticket) => total + ticket.quantity * ticket.unitPrice, 0);
  }

  private update(changes: Partial<BookingDraft>): void {
    const next = { ...this.draftSignal(), ...changes };
    this.draftSignal.set(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // O fluxo continua disponível em memória quando o armazenamento estiver bloqueado.
    }
  }

  private loadDraft(): BookingDraft {
    const empty: BookingDraft = { movie: null, session: null, tickets: DEFAULT_TICKETS.map((ticket) => ({ ...ticket })) };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return empty;
      const saved = JSON.parse(raw) as Partial<BookingDraft>;
      const tickets = DEFAULT_TICKETS.map((base) => {
        const old = saved.tickets?.find((ticket) => ticket.category === base.category);
        return { ...base, quantity: Math.max(0, Math.floor(old?.quantity ?? 0)) };
      });
      return { movie: saved.movie ?? null, session: saved.session ?? null, tickets };
    } catch {
      return empty;
    }
  }
}
