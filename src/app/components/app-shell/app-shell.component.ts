import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IonContent, IonFooter, IonHeader } from '@ionic/angular/standalone';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [IonHeader, IonContent, IonFooter, RouterOutlet, NavbarComponent, FooterComponent],
  host: { class: 'ion-page' },
  template: `
    <ion-header>
      <app-navbar />
    </ion-header>
    <ion-content class="shell-content" [scrollY]="true">
      <router-outlet />
    </ion-content>
    <ion-footer>
      <app-footer />
    </ion-footer>
  `,
  styles: [
    `:host{display:flex;flex-direction:column;width:100%;height:100%;background:var(--cp-background)}ion-header,ion-footer{flex:0 0 auto}ion-content{flex:1 1 auto;min-height:0;--background:var(--cp-background);--overflow:auto}ion-footer{background:var(--cp-surface)}`,
  ],
})
export class AppShellComponent {}
