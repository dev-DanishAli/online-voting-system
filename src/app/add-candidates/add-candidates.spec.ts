import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCandidates } from './add-candidates';

describe('AddCandidates', () => {
  let component: AddCandidates;
  let fixture: ComponentFixture<AddCandidates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCandidates]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCandidates);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
