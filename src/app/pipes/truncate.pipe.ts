import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, limit = 120): string {
    const text = (value ?? '').trim();
    const safeLimit = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 120;
    if (text.length <= safeLimit) return text;
    if (safeLimit === 0) return '…';
    return text.slice(0, safeLimit).trimEnd() + '…';
  }
}
