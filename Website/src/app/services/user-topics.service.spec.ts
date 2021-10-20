import { TestBed } from '@angular/core/testing';

import { UserTopicsService } from './user-topics.service';

describe('UserTopicsService', () => {
  let service: UserTopicsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserTopicsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
