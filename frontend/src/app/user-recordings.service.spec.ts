import { TestBed } from '@angular/core/testing';

import { UserRecordingsService } from './user-recordings.service';

describe('UserRecordingsService', () => {
  let service: UserRecordingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserRecordingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
