import { Movie } from './movie.model';

export type ScreeningType = '2D' | '3D' | 'IMAX';
export type TicketCategory = 'inteira' | 'meia' | 'estudante' | 'idoso';
export type SeatStatus = 'available' | 'occupied' | 'selected';

export interface Cinema {
  id: string;
  name: string;
  address: string;
}

export interface ScreeningRoom {
  id: string;
  name: string;
  type: ScreeningType;
}

export interface Session {
  id: string;
  cinema: Cinema;
  room: ScreeningRoom;
  date: string;
  time: string;
  basePrice: number;
}

export interface TicketSelection {
  category: TicketCategory;
  label: string;
  unitPrice: number;
  quantity: number;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
}

export interface BookingDraft {
  movie: Movie | null;
  session: Session | null;
  tickets: TicketSelection[];
  seats: Seat[];
}

export interface CompletedBooking extends BookingDraft {
  bookingId: string;
  finalizedAt: string;
  total: number;
}

export const DEFAULT_TICKETS: TicketSelection[] = [
  { category: 'inteira', label: 'Inteira', unitPrice: 30, quantity: 0 },
  { category: 'meia', label: 'Meia-entrada', unitPrice: 15, quantity: 0 },
  { category: 'estudante', label: 'Meia estudante', unitPrice: 15, quantity: 0 },
  { category: 'idoso', label: 'Meia idoso', unitPrice: 15, quantity: 0 },
];
