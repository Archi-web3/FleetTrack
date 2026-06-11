import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoBanner } from './info-banner';

describe('InfoBanner', () => {
  let component: InfoBanner;
  let fixture: ComponentFixture<InfoBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoBanner]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoBanner);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
