import { TestBed } from '@angular/core/testing';

import { BugService } from './bug.service';

describe('BugService', () => {
  let service: BugService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BugService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
