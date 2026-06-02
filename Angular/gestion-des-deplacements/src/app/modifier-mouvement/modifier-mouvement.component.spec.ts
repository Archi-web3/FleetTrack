import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierMouvement } from './modifier-mouvement';

describe('ModifierMouvement', () => {
  let component: ModifierMouvement;
  let fixture: ComponentFixture<ModifierMouvement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierMouvement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierMouvement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
