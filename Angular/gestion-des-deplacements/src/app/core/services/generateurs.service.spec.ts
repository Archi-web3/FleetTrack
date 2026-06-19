import { TestBed } from '@angular/core/testing';

import { Generateurs } from './generateurs';

describe('Generateurs', () => {
  let service: Generateurs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Generateurs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
