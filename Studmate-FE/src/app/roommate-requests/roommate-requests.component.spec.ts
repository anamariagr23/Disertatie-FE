import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoommateRequestsComponent } from './roommate-requests.component';

describe('RoommateRequestsComponent', () => {
  let component: RoommateRequestsComponent;
  let fixture: ComponentFixture<RoommateRequestsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoommateRequestsComponent]
    });
    fixture = TestBed.createComponent(RoommateRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
