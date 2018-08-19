import { TestBed, inject } from '@angular/core/testing';

import { WyreService } from './wyre.service';

describe('WyreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WyreService]
    });
  });

  it('should be created', inject([WyreService], (service: WyreService) => {
    expect(service).toBeTruthy();
  }));
});
