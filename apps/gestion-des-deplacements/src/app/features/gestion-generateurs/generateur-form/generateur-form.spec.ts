import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateurForm } from './generateur-form';

describe('GenerateurForm', () => {
  let component: GenerateurForm;
  let fixture: ComponentFixture<GenerateurForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateurForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateurForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
