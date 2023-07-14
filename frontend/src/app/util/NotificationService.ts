import {EventEmitter, Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class NotificationService {
  onAudioRecorded: EventEmitter<{url: string}> = new EventEmitter();
  constructor() {}
}
