import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CastVote } from './cast-vote';

describe('CastVote', () => {
  let component: CastVote;
  let fixture: ComponentFixture<CastVote>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CastVote]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CastVote);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
