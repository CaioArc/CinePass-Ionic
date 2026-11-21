import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { BookingService } from '../services/booking.service';

export const requireSessionForTickets: CanActivateFn = () => {
  const booking = inject(BookingService);
  const router = inject(Router);
  const draft = booking.draft();

  if (draft.movie && draft.session) return true;
  if (draft.movie) return router.createUrlTree(['/sessoes', draft.movie.id]);
  return router.createUrlTree(['/filmes']);
};

export const requireTicketsForSeats: CanActivateFn = () => {
  const booking = inject(BookingService);
  const router = inject(Router);
  const draft = booking.draft();

  if (!draft.movie) return router.createUrlTree(['/filmes']);
  if (!draft.session) return router.createUrlTree(['/sessoes', draft.movie.id]);
  if (booking.totalTickets() < 1) return router.createUrlTree(['/ingressos']);
  return true;
};

export const requireCompleteBookingForSummary: CanActivateFn = () => {
  const booking = inject(BookingService);
  const router = inject(Router);
  const draft = booking.draft();

  const hasCompleteDraft = !!draft.movie
    && !!draft.session
    && booking.totalTickets() > 0
    && booking.selectedSeats().length === booking.totalTickets();

  if (hasCompleteDraft) return true;

  const noActiveDraft = !draft.movie && !draft.session && booking.totalTickets() === 0;
  if (noActiveDraft && booking.completedBooking()) return true;

  if (!draft.movie) return router.createUrlTree(['/filmes']);
  if (!draft.session) return router.createUrlTree(['/sessoes', draft.movie.id]);
  if (booking.totalTickets() < 1) return router.createUrlTree(['/ingressos']);
  return router.createUrlTree(['/poltronas']);
};
