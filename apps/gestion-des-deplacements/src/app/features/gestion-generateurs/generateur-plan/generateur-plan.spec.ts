import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateurPlan } from './generateur-plan';

describe('GenerateurPlan', () => {
  let component: GenerateurPlan;
  let fixture: ComponentFixture<GenerateurPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateurPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateurPlan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
