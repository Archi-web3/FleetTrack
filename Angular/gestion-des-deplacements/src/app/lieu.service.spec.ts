import { TestBed } from '@angular/core/testing';

import { Lieu } from './lieu';

describe('Lieu', () => {
  let service: Lieu;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Lieu);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
