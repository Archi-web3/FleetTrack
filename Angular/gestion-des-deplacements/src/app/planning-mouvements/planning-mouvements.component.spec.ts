import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanningMouvements } from './planning-mouvements';

describe('PlanningMouvements', () => {
  let component: PlanningMouvements;
  let fixture: ComponentFixture<PlanningMouvements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanningMouvements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanningMouvements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
