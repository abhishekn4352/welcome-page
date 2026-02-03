import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonFilterComponent } from './common-filter.component';
import { FilterService } from './filter.service';

describe('CommonFilterComponent', () => {
  let component: CommonFilterComponent;
  let fixture: ComponentFixture<CommonFilterComponent>;
  let filterService: FilterService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [CommonFilterComponent],
      providers: [FormBuilder, FilterService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommonFilterComponent);
    component = fixture.componentInstance;
    filterService = TestBed.inject(FilterService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new filter', () => {
    const initialFilters = filterService.getFilters().length;
    component.addFilter();
    const updatedFilters = filterService.getFilters().length;
    expect(updatedFilters).toBe(initialFilters + 1);
  });

  it('should remove a filter', () => {
    // Add a filter first
    component.addFilter();
    const filterId = filterService.getFilters()[0].id;
    
    // Then remove it
    const initialFilters = filterService.getFilters().length;
    component.removeFilter(filterId);
    const updatedFilters = filterService.getFilters().length;
    expect(updatedFilters).toBe(initialFilters - 1);
  });

  it('should update filter properties', () => {
    // Add a filter
    component.addFilter();
    const filter = filterService.getFilters()[0];
    
    // Update the filter label
    component.updateFilter(filter.id, 'label', 'Updated Label');
    const updatedFilters = filterService.getFilters();
    expect(updatedFilters[0].label).toBe('Updated Label');
  });

  it('should handle filter value changes', () => {
    const filterId = 'test-filter';
    const testValue = 'test value';
    
    // Mock the filter service method
    spyOn(filterService, 'updateFilterValue');
    
    component.onFilterChange(filterId, testValue);
    expect(filterService.updateFilterValue).toHaveBeenCalledWith(filterId, testValue);
  });

  it('should reset filters', () => {
    spyOn(filterService, 'resetFilters');
    component.resetFilters();
    expect(filterService.resetFilters).toHaveBeenCalled();
  });

  it('should save and load presets', () => {
    spyOn(filterService, 'savePreset');
    spyOn(filterService, 'loadPreset');
    
    // Test save preset
    component.newPresetName = 'Test Preset';
    component.savePreset();
    expect(filterService.savePreset).toHaveBeenCalledWith('Test Preset');
    
    // Test load preset
    component.loadPreset('Test Preset');
    expect(filterService.loadPreset).toHaveBeenCalledWith('Test Preset');
  });
});