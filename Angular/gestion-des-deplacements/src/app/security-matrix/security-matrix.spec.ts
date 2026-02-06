import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityMatrix } from './security-matrix';

describe('SecurityMatrix', () => {
  let component: SecurityMatrix;
  let fixture: ComponentFixture<SecurityMatrix>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SecurityMatrix]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecurityMatrix);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
