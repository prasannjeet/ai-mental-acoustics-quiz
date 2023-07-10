import {APP_INITIALIZER, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { initializer } from 'src/utils/app-inits';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  NbThemeModule,
  NbLayoutModule,
  NbCardModule,
  NbRadioModule,
  NbButtonModule,
  NbProgressBarModule, NbIconModule, NbToastrService, NbOverlayService, NbToastrModule
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { IntroComponent } from './intro/intro.component';
import { QuizComponent } from './quiz/quiz.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { RecordComponent } from './record/record.component';
import { ProgressComponent } from './progress/progress.component';

@NgModule({
  declarations: [
    AppComponent,
    IntroComponent,
    QuizComponent,
    RecordComponent,
    ProgressComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({name: 'cosmic'}),
    NbLayoutModule,
    NbEvaIconsModule,
    NbCardModule,
    NbRadioModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NbProgressBarModule,
    NbIconModule,
    NbToastrModule.forRoot(),
    KeycloakAngularModule, // add keycloakAngular module
  ],
  providers: [
    NbToastrService,
    NbOverlayService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      deps: [KeycloakService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
