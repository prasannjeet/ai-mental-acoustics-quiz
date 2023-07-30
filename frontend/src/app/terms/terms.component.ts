import { Component } from '@angular/core';
import {KeycloakService} from "keycloak-angular";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent {

  userName: string | undefined;
  quizTime: number = environment.quizTimeSeconds;
  recordTime: number = environment.recordingTimeSeconds;
  isHeadsetWore: boolean = false;
  checkbox1: boolean = false;
  checkbox2: boolean = false;
  checkbox3: boolean = false;
  userId: string | undefined;
  jwtToken: string | undefined;

  constructor(public keycloakService: KeycloakService, private http: HttpClient) {
    this.userName = this.keycloakService.getKeycloakInstance().tokenParsed?.['name'];
    this.userId = keycloakService.getKeycloakInstance().subject;
    this.jwtToken = keycloakService.getKeycloakInstance().token;
  }

  startEEGRecording() {
    if (this.userId && this.jwtToken) {
      const url = `${environment.flaskUrl}/start`;
      const body = {
        user_id: this.userId,
        jwt_token: this.jwtToken
      };

      this.http.post(url, body).subscribe(
        (response) => {
          console.log('EEG recording started successfully:', response);
        },
        (error) => {
          console.error('Error starting EEG recording:', error);
        }
      );
    } else {
      console.error('User ID or JWT token is missing');
    }
  }

}
