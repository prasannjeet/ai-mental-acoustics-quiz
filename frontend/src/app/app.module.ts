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
  NbProgressBarModule,
  NbIconModule,
  NbToastrService,
  NbOverlayService,
  NbToastrModule,
  NbStepperModule,
  NbCheckboxModule, NbListModule, NbTabsetModule, NbMenuModule, NbAccordionModule, NbSidebarModule, NbSidebarService
} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { IntroComponent } from './intro/intro.component';
import { QuizComponent } from './quiz/quiz.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { RecordComponent } from './record/record.component';
import { ProgressComponent } from './progress/progress.component';
import { AngularFireModule} from "@angular/fire/compat";
import { AngularFireStorageModule} from "@angular/fire/compat/storage";
import { environment } from '../environments/environment';
import { TermsComponent } from './terms/terms.component';
import { UserRecordingsComponent } from './user-recordings/user-recordings.component';
import {NbMenuInternalService} from "@nebular/theme/components/menu/menu.service";

@NgModule({
  declarations: [
    AppComponent,
    IntroComponent,
    QuizComponent,
    RecordComponent,
    ProgressComponent,
    TermsComponent,
    UserRecordingsComponent,
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
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    NbStepperModule,
    NbCheckboxModule,
    NbListModule,
    NbTabsetModule,
    NbMenuModule.forRoot(),
    NbAccordionModule,
    NbSidebarModule,
    NbMenuModule,
  ],
  providers: [
    NbToastrService,
    NbSidebarService,
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
