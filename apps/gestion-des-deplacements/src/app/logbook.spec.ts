import { TestBed } from '@angular/core/testing';

import { Logbook } from './logbook';

describe('Logbook', () => {
  let service: Logbook;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Logbook);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
