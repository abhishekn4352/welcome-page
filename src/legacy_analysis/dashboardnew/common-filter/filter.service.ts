import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// Define the filter types
export type FilterType = 'dropdown' | 'multiselect' | 'date-range' | 'text' | 'toggle';

// Define the filter interface
export interface Filter {
  id: string;
  field: string;
  label: string;
  type: FilterType;
  options?: string[]; // For dropdown and multiselect
  value?: any; // Current value
  placeholder?: string;
}

// Define the filter state
export interface FilterState {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  // Store the filter definitions
  private filtersSubject = new BehaviorSubject<Filter[]>([]);
  public filters$ = this.filtersSubject.asObservable();

  // Store the current filter values
  private filterStateSubject = new BehaviorSubject<FilterState>({});
  public filterState$ = this.filterStateSubject.asObservable();

  // Store the active filter presets
  private activePresetSubject = new BehaviorSubject<string | null>(null);
  public activePreset$ = this.activePresetSubject.asObservable();

  // Store filter presets
  private presets: { [key: string]: FilterState } = {};

  constructor() { }

  // Add a new filter
  addFilter(filter: Filter): void {
    const currentFilters = this.filtersSubject.value;
    this.filtersSubject.next([...currentFilters, filter]);
  }

  // Remove a filter
  removeFilter(filterId: string): void {
    const currentFilters = this.filtersSubject.value;
    const updatedFilters = currentFilters.filter(f => f.id !== filterId);
    this.filtersSubject.next(updatedFilters);
    
    // Also remove the filter value from state
    const currentState = this.filterStateSubject.value;
    const newState = { ...currentState };
    delete newState[filterId];
    this.filterStateSubject.next(newState);
  }

  // Update filter value
  updateFilterValue(filterId: string, value: any): void {
    console.log('=== FILTER SERVICE DEBUG INFO ===');
    console.log('Updating filter value for ID:', filterId);
    console.log('New value:', value);
    
    const currentState = this.filterStateSubject.value;
    const newState = {
      ...currentState,
      [filterId]: value
    };
    
    console.log('New filter state:', newState);
    this.filterStateSubject.next(newState);
    console.log('=== END FILTER SERVICE DEBUG ===');
  }

  // Get current filter values
  getFilterValues(): FilterState {
    return this.filterStateSubject.value;
  }

  // Reset all filters
  resetFilters(): void {
    const currentFilters = this.filtersSubject.value;
    const resetState: FilterState = {};
    
    // Initialize all filters with empty/default values
    currentFilters.forEach(filter => {
      switch (filter.type) {
        case 'multiselect':
          resetState[filter.id] = [];
          break;
        case 'date-range':
          resetState[filter.id] = { start: null, end: null };
          break;
        case 'toggle':
          resetState[filter.id] = false;
          break;
        default:
          resetState[filter.id] = '';
      }
    });
    
    this.filterStateSubject.next(resetState);
  }

  // Save current filter state as a preset
  savePreset(name: string): void {
    this.presets[name] = this.filterStateSubject.value;
  }

  // Load a preset
  loadPreset(name: string): void {
    if (this.presets[name]) {
      this.filterStateSubject.next(this.presets[name]);
      this.activePresetSubject.next(name);
    }
  }

  // Get all presets
  getPresets(): string[] {
    return Object.keys(this.presets);
  }

  // Delete a preset
  deletePreset(name: string): void {
    delete this.presets[name];
    if (this.activePresetSubject.value === name) {
      this.activePresetSubject.next(null);
    }
  }

  // Clear all presets
  clearPresets(): void {
    this.presets = {};
    this.activePresetSubject.next(null);
  }

  // Build query parameters for API calls
  buildQueryParams(): string {
    const filterValues = this.getFilterValues();
    const params = new URLSearchParams();
    
    Object.keys(filterValues).forEach(key => {
      const value = filterValues[key];
      if (value !== undefined && value !== null && value !== '') {
        if (typeof value === 'object') {
          // Handle date ranges and other objects
          if (value.hasOwnProperty('start') && value.hasOwnProperty('end')) {
            // Date range
            if (value.start) params.append(`${key}_start`, value.start);
            if (value.end) params.append(`${key}_end`, value.end);
          } else {
            // Other objects as JSON
            params.append(key, JSON.stringify(value));
          }
        } else {
          // Simple values
          params.append(key, value.toString());
        }
      }
    });
    
    return params.toString();
  }

  // Get filter definitions
  getFilters(): Filter[] {
    return this.filtersSubject.value;
  }

  // Update filter definitions
  setFilters(filters: Filter[]): void {
    this.filtersSubject.next(filters);
    
    // Initialize filter state with default values
    const initialState: FilterState = {};
    filters.forEach(filter => {
      switch (filter.type) {
        case 'multiselect':
          initialState[filter.id] = filter.value || [];
          break;
        case 'date-range':
          initialState[filter.id] = filter.value || { start: null, end: null };
          break;
        case 'toggle':
          initialState[filter.id] = filter.value || false;
          break;
        default:
          initialState[filter.id] = filter.value || '';
      }
    });
    
    this.filterStateSubject.next(initialState);
  }
}