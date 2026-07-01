import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogbookDashboard } from './logbook-dashboard';

describe('LogbookDashboard', () => {
  let component: LogbookDashboard;
  let fixture: ComponentFixture<LogbookDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogbookDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogbookDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
