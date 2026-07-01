import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateurGuide } from './generateur-guide';

describe('GenerateurGuide', () => {
  let component: GenerateurGuide;
  let fixture: ComponentFixture<GenerateurGuide>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateurGuide]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateurGuide);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
