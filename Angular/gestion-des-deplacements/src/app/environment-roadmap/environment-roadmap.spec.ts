import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentRoadmap } from './environment-roadmap';

describe('EnvironmentRoadmap', () => {
  let component: EnvironmentRoadmap;
  let fixture: ComponentFixture<EnvironmentRoadmap>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EnvironmentRoadmap]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnvironmentRoadmap);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
