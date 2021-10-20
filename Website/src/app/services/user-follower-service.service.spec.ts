import { TestBed } from '@angular/core/testing';

import { UserFollowerServiceService } from './user-follower-service.service';

describe('UserFollowerServiceService', () => {
  let service: UserFollowerServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserFollowerServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
