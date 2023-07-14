import { Component } from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent {

  userName: string | undefined;
  quizTime: number = environment.quizTimeSeconds;
  recordTime: number = environment.recordingTimeSeconds;
  checkbox1: boolean = false;
  checkbox2: boolean = false;
  checkbox3: boolean = false;

  constructor(public keycloakService: KeycloakService) {
    this.userName = this.keycloakService.getKeycloakInstance().tokenParsed?.['name'];
  }

}
