import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
@Component({selector:'app-sessoes',standalone:true,imports:[IonContent,IonHeader,IonTitle,IonToolbar],template:`<ion-header><ion-toolbar><ion-title>Sessões</ion-title></ion-toolbar></ion-header><ion-content class="ion-padding"><main><h1>Sessões</h1><p>Estrutura inicial do CinePass.</p></main></ion-content>`,styles:[`main{max-width:960px;margin:0 auto;padding:1rem 0}h1{font-size:1.75rem}`]})
export class SessoesPage {}
