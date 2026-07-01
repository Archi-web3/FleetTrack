import { TestBed } from '@angular/core/testing';

import { MouvementService } from './core/services/mouvement.service';

describe('MouvementService', () => {
  let service: MouvementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouvementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
