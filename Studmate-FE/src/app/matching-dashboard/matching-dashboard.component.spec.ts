import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchingDashboardComponent } from './matching-dashboard.component';

describe('MatchingDashboardComponent', () => {
  let component: MatchingDashboardComponent;
  let fixture: ComponentFixture<MatchingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MatchingDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MatchingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
