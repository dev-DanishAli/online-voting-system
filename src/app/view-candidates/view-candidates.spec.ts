import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCandidates } from './view-candidates';

describe('ViewCandidates', () => {
  let component: ViewCandidates;
  let fixture: ComponentFixture<ViewCandidates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewCandidates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewCandidates);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
