import { TestBed } from '@angular/core/testing';

import { CheckSideService } from './check-side.service';

describe('CheckSideService', () => {
  let service: CheckSideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckSideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
