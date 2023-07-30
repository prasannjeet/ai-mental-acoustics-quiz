import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import {KeycloakService} from "keycloak-angular";

export interface UserRecording {
  user: string;
  recordings: (string | null)[];
  fifFile: string;
  plot: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserRecordingsService {
  constructor(private http: HttpClient, private keycloakService: KeycloakService) {}

  getUserRecordings(): Observable<UserRecording[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.keycloakService.getToken()}`,
    });
    const url = `${environment.appUrl}${environment.serverContextUrl}/users/userRecordings`;
    return this.http.get<UserRecording[]>(url, { headers });
  }
}
