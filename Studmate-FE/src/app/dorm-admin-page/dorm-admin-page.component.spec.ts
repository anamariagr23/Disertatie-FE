import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DormAdminPageComponent } from './dorm-admin-page.component';

describe('DormAdminPageComponent', () => {
  let component: DormAdminPageComponent;
  let fixture: ComponentFixture<DormAdminPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DormAdminPageComponent]
    });
    fixture = TestBed.createComponent(DormAdminPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
