import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {Meta} from '@angular/platform-browser';
import {environment} from "../environments/environment";
import { KeycloakService } from 'keycloak-angular';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'AiMentalAcousticsQuiz';
  userId: string | undefined;
  userName: string | undefined;
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  theRouter: Router;
  @ViewChild('scrollTarget', {static: true}) scrollTarget: ElementRef | undefined;

  constructor(private meta: Meta, public keycloakService: KeycloakService, router: Router) {
    this.theRouter = router;
    this.meta.addTag({ name: 'title', content: 'AiMentalAcoustics Quiz' });
    this.meta.addTag({ name: 'description', content: 'This quiz will help us learn more about how voice acoustics are related to mental stress. Thank you for participating in the test.' });
    this.meta.addTag({ property: 'og:title', content: 'AiMentalAcoustics Quiz' });
    this.meta.addTag({ property: 'og:description', content: 'This quiz will help us learn more about how voice acoustics are related to mental stress. Thank you for participating in the test.' });
    this.meta.addTag({ property: 'og:image', content: `${environment.hostname}/assets/quiz-meta.jpg` });

    this.userId = this.keycloakService.getKeycloakInstance().subject;
    this.userName = this.keycloakService.getKeycloakInstance().tokenParsed?.['name'];
    this.keycloakService.isLoggedIn().then(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
    this.isAdmin = this.keycloakService.getUserRoles().includes('aima-admin');
    // console.log(`userId: ${this.userId}, userName: ${this.userName}, isLoggedIn: ${this.isLoggedIn}`);
  }

  logout() {
    this.keycloakService.logout(`${environment.hostname}`).then(() => {
    });
  }

  ngOnInit() {
    window.scrollTo(0, document.body.scrollHeight);
  }
}
