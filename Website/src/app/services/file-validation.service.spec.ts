import { TestBed } from '@angular/core/testing';

import { FileValidationService } from './file-validation.service';

describe('FileValidationService', () => {
  let service: FileValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
