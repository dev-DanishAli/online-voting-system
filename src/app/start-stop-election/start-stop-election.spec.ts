import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartStopElection } from './start-stop-election';

describe('StartStopElection', () => {
  let component: StartStopElection;
  let fixture: ComponentFixture<StartStopElection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StartStopElection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StartStopElection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
