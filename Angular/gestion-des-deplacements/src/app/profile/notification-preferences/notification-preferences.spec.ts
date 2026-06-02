import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationPreferences } from './notification-preferences';

describe('NotificationPreferences', () => {
  let component: NotificationPreferences;
  let fixture: ComponentFixture<NotificationPreferences>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationPreferences]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationPreferences);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
