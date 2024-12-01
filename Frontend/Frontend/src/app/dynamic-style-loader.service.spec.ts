import { TestBed } from '@angular/core/testing';

import { DynamicStyleLoaderService } from './dynamic-style-loader.service';

describe('DynamicStyleLoaderService', () => {
  let service: DynamicStyleLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicStyleLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
