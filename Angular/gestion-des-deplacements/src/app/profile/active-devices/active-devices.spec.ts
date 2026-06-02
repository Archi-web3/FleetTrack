import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveDevices } from './active-devices';

describe('ActiveDevices', () => {
  let component: ActiveDevices;
  let fixture: ComponentFixture<ActiveDevices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActiveDevices]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActiveDevices);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
