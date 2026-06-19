import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateurDetail } from './generateur-detail';

describe('GenerateurDetail', () => {
  let component: GenerateurDetail;
  let fixture: ComponentFixture<GenerateurDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateurDetail]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateurDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
