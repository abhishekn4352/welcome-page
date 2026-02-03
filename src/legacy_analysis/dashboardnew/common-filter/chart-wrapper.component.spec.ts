import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartWrapperComponent } from './chart-wrapper.component';
import { FilterService } from './filter.service';

describe('ChartWrapperComponent', () => {
  let component: ChartWrapperComponent;
  let fixture: ComponentFixture<ChartWrapperComponent>;
  let filterService: FilterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartWrapperComponent],
      providers: [FilterService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChartWrapperComponent);
    component = fixture.componentInstance;
    filterService = TestBed.inject(FilterService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to filter changes on init', () => {
    spyOn(filterService.filterState$, 'subscribe');
    component.ngOnInit();
    expect(filterService.filterState$.subscribe).toHaveBeenCalled();
  });

  it('should unsubscribe from filter changes on destroy', () => {
    component.ngOnInit();
    spyOn(component['filterSubscription']!, 'unsubscribe');
    component.ngOnDestroy();
    expect(component['filterSubscription']!.unsubscribe).toHaveBeenCalled();
  });
});