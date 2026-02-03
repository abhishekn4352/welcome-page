import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardnewComponent } from './dashboardnew.component';

describe('DashboardnewComponent', () => {
  let component: DashboardnewComponent;
  let fixture: ComponentFixture<DashboardnewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardnewComponent]
    });
    fixture = TestBed.createComponent(DashboardnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
