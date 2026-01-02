import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionHistory } from './election-history';

describe('ElectionHistory', () => {
  let component: ElectionHistory;
  let fixture: ComponentFixture<ElectionHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ElectionHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ElectionHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
