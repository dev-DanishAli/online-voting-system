import { TestBed } from '@angular/core/testing';

import { Voters } from './voters';

describe('Voters', () => {
  let service: Voters;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Voters);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
