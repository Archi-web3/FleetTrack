import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateursList } from './generateurs-list';

describe('GenerateursList', () => {
  let component: GenerateursList;
  let fixture: ComponentFixture<GenerateursList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerateursList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateursList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
