import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionVehicules } from './gestion-vehicules';

describe('GestionVehicules', () => {
  let component: GestionVehicules;
  let fixture: ComponentFixture<GestionVehicules>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionVehicules]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionVehicules);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
