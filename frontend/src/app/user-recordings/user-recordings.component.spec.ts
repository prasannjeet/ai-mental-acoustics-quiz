import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRecordingsComponent } from './user-recordings.component';

describe('UserRecordingsComponent', () => {
  let component: UserRecordingsComponent;
  let fixture: ComponentFixture<UserRecordingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserRecordingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserRecordingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
