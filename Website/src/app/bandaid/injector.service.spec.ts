import { TestBed } from '@angular/core/testing';

import { InjectorService } from './injector.service';

describe('InjectorService', () => {
  let service: InjectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InjectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
