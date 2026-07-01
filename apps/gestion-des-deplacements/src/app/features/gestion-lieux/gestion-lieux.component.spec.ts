import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionLieux } from './gestion-lieux';

describe('GestionLieux', () => {
  let component: GestionLieux;
  let fixture: ComponentFixture<GestionLieux>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionLieux]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionLieux);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
