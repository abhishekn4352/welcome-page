import { TestBed } from '@angular/core/testing';
import { FilterService, Filter } from './filter.service';

describe('FilterService', () => {
  let service: FilterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add and remove filters', () => {
    const filter: Filter = {
      id: 'test-filter',
      field: 'testField',
      label: 'Test Field',
      type: 'text'
    };

    // Add filter
    service.addFilter(filter);
    const filters = service.getFilters();
    expect(filters.length).toBe(1);
    expect(filters[0]).toEqual(filter);

    // Remove filter
    service.removeFilter('test-filter');
    const updatedFilters = service.getFilters();
    expect(updatedFilters.length).toBe(0);
  });

  it('should update filter values', () => {
    const filter: Filter = {
      id: 'name-filter',
      field: 'name',
      label: 'Name',
      type: 'text'
    };

    service.addFilter(filter);
    service.updateFilterValue('name-filter', 'John Doe');

    const filterValues = service.getFilterValues();
    expect(filterValues['name-filter']).toBe('John Doe');
  });

  it('should reset filters', () => {
    const textFilter: Filter = {
      id: 'name',
      field: 'name',
      label: 'Name',
      type: 'text',
      value: 'John'
    };

    const toggleFilter: Filter = {
      id: 'active',
      field: 'isActive',
      label: 'Active',
      type: 'toggle',
      value: true
    };

    service.setFilters([textFilter, toggleFilter]);
    service.resetFilters();

    const filterValues = service.getFilterValues();
    expect(filterValues['name']).toBe('');
    expect(filterValues['active']).toBe(false);
  });

  it('should manage presets', () => {
    const filter: Filter = {
      id: 'category',
      field: 'category',
      label: 'Category',
      type: 'dropdown',
      value: 'Electronics'
    };

    service.addFilter(filter);
    
    // Save preset
    service.savePreset('Electronics View');
    const presets = service.getPresets();
    expect(presets).toContain('Electronics View');

    // Update filter and load preset
    service.updateFilterValue('category', 'Clothing');
    service.loadPreset('Electronics View');
    
    const filterValues = service.getFilterValues();
    expect(filterValues['category']).toBe('Electronics');

    // Delete preset
    service.deletePreset('Electronics View');
    const updatedPresets = service.getPresets();
    expect(updatedPresets).not.toContain('Electronics View');
  });

  it('should build query parameters', () => {
    const textFilter: Filter = {
      id: 'name',
      field: 'name',
      label: 'Name',
      type: 'text'
    };

    const dateFilter: Filter = {
      id: 'dateRange',
      field: 'date',
      label: 'Date Range',
      type: 'date-range'
    };

    service.setFilters([textFilter, dateFilter]);
    service.updateFilterValue('name', 'John Doe');
    service.updateFilterValue('dateRange', { start: '2023-01-01', end: '2023-12-31' });

    const queryParams = service.buildQueryParams();
    expect(queryParams).toContain('name=John%20Doe');
    expect(queryParams).toContain('dateRange_start=2023-01-01');
    expect(queryParams).toContain('dateRange_end=2023-12-31');
  });
});