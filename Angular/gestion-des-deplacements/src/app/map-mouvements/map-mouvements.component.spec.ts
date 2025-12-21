import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapMouvements } from './map-mouvements';

describe('MapMouvements', () => {
  let component: MapMouvements;
  let fixture: ComponentFixture<MapMouvements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapMouvements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapMouvements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
