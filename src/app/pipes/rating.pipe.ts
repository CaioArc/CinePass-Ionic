import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'rating', standalone: true })
export class RatingPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) return 'Sem nota';
    const normalized = Math.min(10, Math.max(0, value));
    return normalized.toFixed(1) + '/10';
  }
}
