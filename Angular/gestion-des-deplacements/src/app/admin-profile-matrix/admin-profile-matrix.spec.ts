import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProfileMatrix } from './admin-profile-matrix';

describe('AdminProfileMatrix', () => {
  let component: AdminProfileMatrix;
  let fixture: ComponentFixture<AdminProfileMatrix>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProfileMatrix]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProfileMatrix);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
