import { TestBed } from '@angular/core/testing';

import { Chauffeur } from './chauffeur';

describe('Chauffeur', () => {
  let service: Chauffeur;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Chauffeur);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
