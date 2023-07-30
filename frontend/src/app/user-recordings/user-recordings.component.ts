import { Component, OnInit } from '@angular/core';
import { UserRecordingsService, UserRecording } from '../user-recordings.service';
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-user-recordings',
  templateUrl: './user-recordings.component.html',
  styleUrls: ['./user-recordings.component.scss'],
})
export class UserRecordingsComponent implements OnInit {
  users: UserRecording[] = [];
  selectedUser: UserRecording | null = null;
  menuItems: { title: string }[] = [];

  constructor(private userRecordingsService: UserRecordingsService, private http: HttpClient) {}

  ngOnInit(): void {
    this.userRecordingsService.getUserRecordings().subscribe((data: UserRecording[]) => {
      this.users = data;
      this.menuItems = data.map((_, index) => ({
        title: `User ${index + 1}`,
      }));
    });
  }

  selectUser(index: number) {
    this.selectedUser = this.users[index];
  }
}
