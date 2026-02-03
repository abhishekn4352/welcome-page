import { Component, OnInit, OnDestroy, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Filter, FilterService, FilterType } from './filter.service';

@Component({
  selector: 'app-common-filter',
  templateUrl: './common-filter.component.html',
  styleUrls: ['./common-filter.component.scss']
})
export class CommonFilterComponent implements OnInit, OnDestroy {
  @Input() baseFilters: any[] = [];
  @Input() drilldownFilters: any[] = [];
  @Input() drilldownLayers: any[] = [];
  @Input() fieldName: string;
  @Input() connection: number;
  
  filters: Filter[] = [];
  filterForm: FormGroup;
  presets: string[] = [];
  activePreset: string | null = null;
  newPresetName: string = '';
  
  private subscriptions: Subscription[] = [];

  constructor(
    private filterService: FilterService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({});
  }

  ngOnInit(): void {
    // Subscribe to filter definitions
    this.subscriptions.push(
      this.filterService.filters$.subscribe(filters => {
        this.filters = filters;
        this.buildForm();
      })
    );
    
    // Subscribe to filter state changes
    this.subscriptions.push(
      this.filterService.filterState$.subscribe(state => {
        this.updateFormValues(state);
      })
    );
    
    // Subscribe to preset changes
    this.subscriptions.push(
      this.filterService.activePreset$.subscribe(preset => {
        this.activePreset = preset;
      })
    );
    
    // Get initial presets
    this.presets = this.filterService.getPresets();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  // Handle window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Trigger change detection to reflow the layout
    setTimeout(() => {
      // This will cause the grid to recalculate its layout
      this.filters = [...this.filters];
    }, 100);
  }

  // Build the form based on current filters
  private buildForm(): void {
    // Clear existing form controls
    Object.keys(this.filterForm.controls).forEach(key => {
      this.filterForm.removeControl(key);
    });
    
    // Add controls for each filter
    this.filters.forEach(filter => {
      let initialValue: any;
      
      switch (filter.type) {
        case 'multiselect':
          initialValue = filter.value || [];
          break;
        case 'date-range':
          initialValue = filter.value || { start: null, end: null };
          break;
        case 'toggle':
          initialValue = filter.value || false;
          break;
        default:
          initialValue = filter.value || '';
      }
      
      const control = this.fb.control(initialValue);
      
      // Subscribe to value changes for this control
      control.valueChanges.subscribe(value => {
        this.onFilterChange(filter.id, value);
      });
      
      this.filterForm.addControl(filter.id, control);
    });
  }

  // Update form values based on filter state
  private updateFormValues(state: any): void {
    Object.keys(state).forEach(key => {
      if (this.filterForm.contains(key)) {
        this.filterForm.get(key)?.setValue(state[key], { emitEvent: false });
      }
    });
  }

  // Handle filter value changes
  onFilterChange(filterId: string, value: any): void {
    console.log('=== COMMON FILTER DEBUG INFO ===');
    console.log('Filter value changed for ID:', filterId);
    console.log('New value:', value);
    
    const filterDef = this.filters.find(f => f.id === filterId);
    console.log('Filter definition:', filterDef);
    
    this.filterService.updateFilterValue(filterId, value);
    console.log('=== END COMMON FILTER DEBUG ===');
  }

  // Handle multiselect changes
  onMultiselectChange(filterId: string, selectedValues: string[]): void {
    this.filterService.updateFilterValue(filterId, selectedValues);
  }

  // Handle date range changes
  onDateRangeChange(filterId: string, dateRange: { start: string | null, end: string | null }): void {
    this.filterService.updateFilterValue(filterId, dateRange);
  }

  // Handle toggle changes
  onToggleChange(filterId: string, checked: boolean): void {
    this.filterService.updateFilterValue(filterId, checked);
  }

  // Reset all filters
  resetFilters(): void {
    this.filterService.resetFilters();
  }

  // Save current filter state as preset
  savePreset(): void {
    if (this.newPresetName.trim()) {
      this.filterService.savePreset(this.newPresetName.trim());
      this.presets = this.filterService.getPresets();
      this.newPresetName = '';
    }
  }

  // Load a preset
  loadPreset(presetName: string): void {
    this.filterService.loadPreset(presetName);
  }

  // Delete a preset
  deletePreset(presetName: string): void {
    this.filterService.deletePreset(presetName);
    this.presets = this.filterService.getPresets();
  }

  // Add a new filter
  addFilter(): void {
    const newFilter: Filter = {
      id: `filter_${Date.now()}`,
      field: '',
      label: 'New Filter',
      type: 'text'
    };
    this.filterService.addFilter(newFilter);
  }

  // Remove a filter
  removeFilter(filterId: string): void {
    this.filterService.removeFilter(filterId);
  }

  // Update filter properties
  updateFilter(filterId: string, property: string, value: any): void {
    const filterIndex = this.filters.findIndex(f => f.id === filterId);
    if (filterIndex !== -1) {
      const updatedFilters = [...this.filters];
      (updatedFilters[filterIndex] as any)[property] = value;
      this.filterService.setFilters(updatedFilters);
    }
  }
}