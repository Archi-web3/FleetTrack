import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleProfile } from './vehicle-profile';

describe('VehicleProfile', () => {
  let component: VehicleProfile;
  let fixture: ComponentFixture<VehicleProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleProfile]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
