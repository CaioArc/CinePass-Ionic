import { Directive, HostBinding, Input } from '@angular/core';
import { SeatStatus } from '../core/models/booking.model';

@Directive({
  selector: '[appSeatStatus]',
  standalone: true,
})
export class SeatStatusDirective {
  @Input({ required: true }) appSeatStatus: SeatStatus = 'available';

  @HostBinding('class.occupied')
  get occupiedClass(): boolean {
    return this.appSeatStatus === 'occupied';
  }

  @HostBinding('class.selected')
  get selectedClass(): boolean {
    return this.appSeatStatus === 'selected';
  }

  @HostBinding('attr.data-seat-status')
  get statusAttribute(): SeatStatus {
    return this.appSeatStatus;
  }

  @HostBinding('disabled')
  get disabled(): boolean {
    return this.appSeatStatus === 'occupied';
  }

  @HostBinding('attr.aria-pressed')
  get pressed(): boolean {
    return this.appSeatStatus === 'selected';
  }
}
