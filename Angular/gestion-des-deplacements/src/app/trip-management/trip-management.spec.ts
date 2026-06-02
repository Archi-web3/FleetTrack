import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripManagement } from './trip-management';

describe('TripManagement', () => {
  let component: TripManagement;
  let fixture: ComponentFixture<TripManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripManagement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TripManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
