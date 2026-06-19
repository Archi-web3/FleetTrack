import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateurLogbook } from './generateur-logbook';

describe('GenerateurLogbook', () => {
  let component: GenerateurLogbook;
  let fixture: ComponentFixture<GenerateurLogbook>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateurLogbook]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateurLogbook);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
