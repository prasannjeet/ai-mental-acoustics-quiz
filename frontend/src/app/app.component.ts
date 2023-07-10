import {Component, ElementRef, ViewChild} from '@angular/core';
import {Meta} from '@angular/platform-browser';
import {environment} from "../environments/environment";
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'AiMentalAcousticsQuiz';
  @ViewChild('scrollTarget', {static: true}) scrollTarget: ElementRef | undefined;

  constructor(private meta: Meta) {
    this.meta.addTag({ name: 'title', content: 'AiMentalAcoustics Quiz' });
    this.meta.addTag({ name: 'description', content: 'This quiz will help us learn more about how voice acoustics are related to mental stress. Thank you for participating in the test.' });
    this.meta.addTag({ property: 'og:title', content: 'AiMentalAcoustics Quiz' });
    this.meta.addTag({ property: 'og:description', content: 'This quiz will help us learn more about how voice acoustics are related to mental stress. Thank you for participating in the test.' });
    this.meta.addTag({ property: 'og:image', content: `${environment.hostname}/assets/quiz-meta.jpg` });
  }

  ngOnInit() {
    window.scrollTo(0, document.body.scrollHeight);
  }
}
