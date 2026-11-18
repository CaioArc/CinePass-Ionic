import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IonButton } from '@ionic/angular/standalone';
import { BookingService } from '../../core/services/booking.service';
import { MovieService } from '../../core/services/movie.service';
import { MovieDetails } from '../../core/models/movie.model';
import { Cinema, ScreeningType, Session } from '../../core/models/booking.model';

const CINEMAS: Cinema[] = [
  { id: 'centro', name: 'CinePass Centro', address: 'Av. Central, 1200' },
  { id: 'shopping', name: 'CinePass Shopping', address: 'Shopping CinePass, piso 2' },
];
const TYPES: ScreeningType[] = ['2D', '3D', 'IMAX'];
const TIMES = ['14:10', '16:40', '19:20', '21:50'];

@Component({
  selector: 'app-sessoes',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, DecimalPipe, IonButton, RouterLink],
  template: `
    <main class="page">
      <p class="eyebrow">ESCOLHA SUA EXPERIÊNCIA</p>
      <h1>Sessões</h1>
      @if (loading()) {
        <p class="state">Carregando informações do filme…</p>
      } @else if (error()) {
        <section class="panel state error"><h2>Não foi possível abrir as sessões</h2><p>{{ error() }}</p><ion-button fill="outline" routerLink="/filmes">Voltar aos filmes</ion-button></section>
      } @else if (movie(); as film) {
        <section class="movie panel">
          @if (film.posterUrl) { <img [src]="film.posterUrl" [alt]="'Pôster de ' + film.title" /> }
          <div><span class="eyebrow">FILME SELECIONADO</span><h2>{{ film.title }}</h2><p>{{ film.releaseDate ? (film.releaseDate | date:'dd/MM/yyyy') : 'Data não informada' }} · {{ film.rating | number:'1.1-1' }}/10</p></div>
        </section>

        <section class="panel choices">
          <h2>Selecione o cinema</h2>
          <div class="options">
            @for (cinema of cinemas; track cinema.id) {
              <button class="option" [class.active]="selectedCinema() === cinema.id" (click)="selectedCinema.set(cinema.id)">
                <strong>{{ cinema.name }}</strong><span>{{ cinema.address }}</span>
              </button>
            }
          </div>
          <h2>Data</h2>
          <div class="options dates">
            @for (date of dates(); track date.iso) {
              <button class="option date-option" [class.active]="selectedDate() === date.iso" (click)="selectedDate.set(date.iso)"><strong>{{ date.label }}</strong><span>{{ date.iso | date:'dd/MM/yyyy':'UTC' }}</span></button>
            }
          </div>
          <h2>Tipo de sala</h2>
          <div class="options types">
            @for (type of types; track type) {
              <button class="option type-option" [class.active]="selectedType() === type" (click)="selectedType.set(type)">{{ type }}</button>
            }
          </div>
          <h2>Horário</h2>
          <div class="options times">
            @for (time of times; track time) {
              <button class="option time-option" [class.active]="selectedTime() === time" (click)="selectedTime.set(time)">{{ time }}</button>
            }
          </div>
          @if (selectedSession(); as session) {
            <div class="summary"><div><strong>{{ session.cinema.name }} · {{ session.room.type }}</strong><span>{{ session.date | date:'dd/MM/yyyy':'UTC' }} às {{ session.time }} · {{ session.room.name }}</span><span>Ingresso base: {{ session.basePrice | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}</span></div></div>
          }
          <ion-button expand="block" [disabled]="!selectedSession()" (click)="continueToTickets()">Continuar para ingressos</ion-button>
        </section>
      } @else {
        <p class="state">Filme não encontrado.</p>
      }
    </main>
  `,
  styles: [`:host{display:block}.page{width:min(100% - 48px,var(--cp-content-width));min-height:60vh;margin:auto;padding:44px 0 70px}.eyebrow{margin:0 0 10px;color:var(--cp-accent);font-size:10px;font-weight:800;letter-spacing:.15em}h1{margin:0 0 24px;color:var(--cp-text);font-size:clamp(32px,5vw,46px);letter-spacing:-.04em}.panel{padding:22px;border:1px solid var(--cp-border);border-radius:14px;background:var(--cp-surface)}.movie{display:flex;align-items:center;gap:18px;margin-bottom:18px}.movie img{width:76px;aspect-ratio:2/3;object-fit:cover;border-radius:8px}.movie h2{margin:0;color:var(--cp-text);font-size:20px}.movie p,.option span{margin:6px 0 0;color:var(--cp-muted);font-size:13px}.choices h2{margin:22px 0 12px;color:var(--cp-text);font-size:16px}.choices h2:first-child{margin-top:0}.options{display:flex;flex-wrap:wrap;gap:10px}.option{display:flex;flex-direction:column;align-items:flex-start;min-width:130px;padding:12px 14px;border:1px solid var(--cp-border);border-radius:10px;background:var(--cp-background);color:var(--cp-text);text-align:left;cursor:pointer}.option:hover,.option.active{border-color:var(--cp-accent);background:rgba(229,27,62,.1)}.date-option,.type-option,.time-option{min-width:78px;align-items:center}.summary{display:flex;justify-content:space-between;margin:24px 0 16px;padding:15px;border-radius:10px;background:var(--cp-background);color:var(--cp-text)}.summary div{display:grid;gap:5px}.summary span,.state{color:var(--cp-muted);font-size:13px}.state{padding:20px}.error{color:#ff9aaa}.error h2{color:var(--cp-text)}ion-button{--background:var(--cp-accent);--border-radius:9px;--color:#fff;--padding-top:17px;--padding-bottom:17px}@media(max-width:640px){.page{width:calc(100% - 32px);padding:34px 0 48px}.panel{padding:16px}.option{flex:1 1 auto}}`],
})
export class SessoesPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly movies = inject(MovieService);
  private readonly booking = inject(BookingService);
  readonly movie = signal<MovieDetails | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly cinemas = CINEMAS;
  readonly types = TYPES;
  readonly times = TIMES;
  readonly dates = computed(() => Array.from({ length: 6 }, (_, offset) => {
    const date = new Date(); date.setHours(12, 0, 0, 0); date.setDate(date.getDate() + offset);
    return { iso: date.toISOString().slice(0, 10), label: new Intl.DateTimeFormat('pt-BR', { weekday: 'short' }).format(date).replace('.', '') };
  }));
  readonly selectedCinema = signal(CINEMAS[0].id);
  readonly selectedDate = signal(this.dates()[0].iso);
  readonly selectedType = signal<ScreeningType>('2D');
  readonly selectedTime = signal(TIMES[0]);
  readonly selectedSession = computed<Session | null>(() => {
    const cinema = CINEMAS.find((item) => item.id === this.selectedCinema());
    if (!cinema) return null;
    const type = this.selectedType();
    return {
      id: [cinema.id, this.selectedDate(), type, this.selectedTime()].join('-'),
      cinema,
      room: { id: type.toLowerCase(), name: type === 'IMAX' ? 'Sala IMAX' : 'Sala ' + type, type },
      date: this.selectedDate(),
      time: this.selectedTime(),
      basePrice: type === '2D' ? 30 : type === '3D' ? 36 : 45,
    };
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('O ID do filme na rota é inválido.'); this.loading.set(false); return;
    }
    this.movies.getDetalhesFilme(id).subscribe({
      next: (movie) => { this.movie.set(movie); this.booking.setMovie(movie); this.loading.set(false); },
      error: (e: unknown) => { this.error.set(e instanceof Error ? e.message : 'Erro ao carregar filme.'); this.loading.set(false); },
    });
  }

  continueToTickets(): void {
    const session = this.selectedSession();
    if (!session || !this.movie()) return;
    this.booking.setSession(session);
    void this.router.navigate(['/ingressos']);
  }
}
