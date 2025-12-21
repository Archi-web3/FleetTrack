import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionChauffeurs } from './gestion-chauffeurs';

describe('GestionChauffeurs', () => {
  let component: GestionChauffeurs;
  let fixture: ComponentFixture<GestionChauffeurs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionChauffeurs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionChauffeurs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
