import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnifiedChartComponent } from './unified-chart.component';

describe('UnifiedChartComponent', () => {
  let component: UnifiedChartComponent;
  let fixture: ComponentFixture<UnifiedChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnifiedChartComponent]
    });
    fixture = TestBed.createComponent(UnifiedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});