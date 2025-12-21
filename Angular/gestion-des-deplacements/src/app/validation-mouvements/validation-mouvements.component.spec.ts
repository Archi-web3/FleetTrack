import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidationMouvements } from './validation-mouvements';

describe('ValidationMouvements', () => {
  let component: ValidationMouvements;
  let fixture: ComponentFixture<ValidationMouvements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidationMouvements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidationMouvements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
