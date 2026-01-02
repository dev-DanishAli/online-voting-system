import { TestBed } from '@angular/core/testing';

import { Votes } from './votes';

describe('Votes', () => {
  let service: Votes;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Votes);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
