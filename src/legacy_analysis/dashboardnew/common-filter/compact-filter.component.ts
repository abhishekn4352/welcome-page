import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { FilterService, Filter } from './filter.service';
import { AlertsService } from 'src/app/services/fnd/alerts.service';

@Component({
  selector: 'app-compact-filter',
  templateUrl: './compact-filter.component.html',
  styleUrls: ['./compact-filter.component.scss']
})
export class CompactFilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() filterKey: string = '';
  @Input() filterType: string = 'text';
  @Input() filterOptions: string[] = [];
  @Input() filterLabel: string = '';
  @Input() apiUrl: string = '';
  @Input() connectionId: number | undefined;
  @Output() filterChange = new EventEmitter<any>();
  @Output() configChange = new EventEmitter<any>();
  
  selectedFilter: Filter | null = null;
  filterValue: any = '';
  availableFilters: Filter[] = [];
  availableKeys: string[] = [];
  availableValues: string[] = [];
  
  // Multiselect dropdown state
  showMultiselectDropdown: boolean = false;
  
  // Configuration properties
  isConfigMode: boolean = false;
  configFilterKey: string = '';
  configFilterType: string = 'text';
  configFilterOptions: string = '';
  configFilterLabel: string = '';
  configApiUrl: string = '';
  configConnectionId: number | undefined;
  
  constructor(
    private filterService: FilterService,
    private alertService: AlertsService
  ) { }

  ngOnInit(): void {
    // Initialize configuration from inputs
    this.configFilterKey = this.filterKey;
    this.configFilterType = this.filterType;
    this.configFilterLabel = this.filterLabel;
    this.configFilterOptions = this.filterOptions.join(',');
    this.configApiUrl = this.apiUrl;
    this.configConnectionId = this.connectionId;
    
    // Load available keys and values if API URL and filter key are provided
    if (this.apiUrl) {
      this.loadAvailableKeys();
      // Load available values for the current filter key if it's a dropdown or multiselect
      if ((this.filterType === 'dropdown' || this.filterType === 'multiselect') && this.filterKey) {
        this.loadAvailableValues(this.filterKey);
      }
    }
    
    // Register this filter with the filter service
    this.registerFilter();
    
    // Subscribe to filter definitions to get available filters
    this.filterService.filters$.subscribe(filters => {
      this.availableFilters = filters;
      this.updateSelectedFilter();
    });
    
    // Subscribe to filter state changes
    this.filterService.filterState$.subscribe(state => {
      if (this.selectedFilter && state.hasOwnProperty(this.selectedFilter.id)) {
        this.filterValue = state[this.selectedFilter.id];
      }
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // If filterKey changes, clear the previous filter value and remove old filter from service
    if (changes.filterKey) {
      // Clear the previous filter value
      this.filterValue = '';
      
      // Clear filter options
      this.filterOptions = [];
      
      // Clear available values
      this.availableValues = [];
      
      // If we had a previous selected filter, clear its value in the service
      if (this.selectedFilter && changes.filterKey.previousValue) {
        const oldFilterId = changes.filterKey.previousValue;
        this.filterService.updateFilterValue(oldFilterId, '');
      }
    }
    
    // If filterKey or filterType changes, re-register the filter
    if (changes.filterKey || changes.filterType) {
      // Load available values for the current filter key if it's a dropdown or multiselect
      if ((this.filterType === 'dropdown' || this.filterType === 'multiselect') && this.filterKey) {
        this.loadAvailableValues(this.filterKey);
      }
      this.registerFilter();
    }
    
    // Handle API URL changes
    if (changes.apiUrl && !changes.apiUrl.firstChange) {
      if (this.apiUrl) {
        this.loadAvailableKeys();
      }
    }
  }
  
  // Register this filter with the filter service
  registerFilter(): void {
    if (this.filterKey) {
      // Get current filter values from the service
      const currentFilterValues = this.filterService.getFilterValues();
      
      // Create a filter definition for this compact filter
      const filterDef: Filter = {
        id: `${this.filterKey}`,
        field: this.filterKey,
        label: this.filterLabel || this.filterKey,
        type: this.filterType as any,
        options: this.filterOptions,
        value: this.filterValue // Use the current filter value
      };
      
      // Get current filters
      const currentFilters = this.filterService.getFilters();
      
      // Check if this filter is already registered
      const existingFilterIndex = currentFilters.findIndex(f => f.id === filterDef.id);
      
      if (existingFilterIndex >= 0) {
        // Preserve the existing filter configuration
        const existingFilter = currentFilters[existingFilterIndex];
        
        // Preserve the existing filter value if it exists in the service
        if (currentFilterValues.hasOwnProperty(existingFilter.id)) {
          filterDef.value = currentFilterValues[existingFilter.id];
          this.filterValue = filterDef.value; // Update local value
        } else if (existingFilter.value !== undefined) {
          // Fallback to existing filter's value if no service value
          filterDef.value = existingFilter.value;
          this.filterValue = filterDef.value;
        }
        
        // Preserve other configuration properties
        filterDef.label = existingFilter.label;
        filterDef.options = existingFilter.options || this.filterOptions;
        
        // Update existing filter
        currentFilters[existingFilterIndex] = filterDef;
      } else {
        // For new filters, check if there's already a value in the service
        if (currentFilterValues.hasOwnProperty(filterDef.id)) {
          filterDef.value = currentFilterValues[filterDef.id];
          this.filterValue = filterDef.value; // Update local value
        }
        
        // Add new filter
        currentFilters.push(filterDef);
      }
      
      // Update the filter service with the new filter list
      this.filterService.setFilters(currentFilters);
      
      // Update the selected filter reference
      this.selectedFilter = filterDef;
    }
  }
  
  updateSelectedFilter(): void {
    if (this.filterKey && this.availableFilters.length > 0) {
      this.selectedFilter = this.availableFilters.find(f => f.field === this.filterKey) || null;
      if (this.selectedFilter) {
        // Get current value for this filter from the service
        const currentState = this.filterService.getFilterValues();
        const filterValue = currentState[this.selectedFilter.id];
        if (filterValue !== undefined) {
          this.filterValue = filterValue;
        } else if (this.selectedFilter.value !== undefined) {
          // Use the filter's default value if no service value
          this.filterValue = this.selectedFilter.value;
        } else {
          // Use the current filter value as fallback
          this.filterValue = this.filterValue || '';
        }
        
        // Also update configuration properties from the selected filter
        this.configFilterKey = this.selectedFilter.field;
        this.configFilterType = this.selectedFilter.type;
        this.configFilterLabel = this.selectedFilter.label;
        this.configFilterOptions = (this.selectedFilter.options || []).join(',');
      }
    }
  }
  
  onFilterValueChange(value: any): void {
    if (this.selectedFilter) {
      this.filterValue = value;
      this.filterService.updateFilterValue(this.selectedFilter.id, value);
      this.filterChange.emit({ filterId: this.selectedFilter.id, value: value });
      
      // Update the filter definition in the service to reflect the new value
      const currentFilters = this.filterService.getFilters();
      const filterIndex = currentFilters.findIndex(f => f.id === this.selectedFilter.id);
      if (filterIndex >= 0) {
        currentFilters[filterIndex].value = value;
        this.filterService.setFilters(currentFilters);
      }
    }
  }
  
  onToggleChange(checked: boolean): void {
    this.onFilterValueChange(checked);
  }
  
  onDateRangeChange(dateRange: { start: string | null, end: string | null }): void {
    this.onFilterValueChange(dateRange);
  }
  
  ngOnDestroy(): void {
    // Component cleanup - remove this filter from the filter service
    if (this.selectedFilter) {
      // Use the proper removeFilter method which handles both filter definition and state
      this.filterService.removeFilter(this.selectedFilter.id);
    }
  }
  
  // Load available keys from API
  loadAvailableKeys(): void {
    if (this.apiUrl) {
      this.alertService.getColumnfromurl(this.apiUrl, this.connectionId).subscribe(
        (keys: string[]) => {
          this.availableKeys = keys;
        },
        (error) => {
          console.error('Error loading available keys:', error);
          this.availableKeys = [];
        }
      );
    }
  }
  
  // Load available values for a specific key
  loadAvailableValues(key: string): void {
    if (this.apiUrl && key) {
      this.alertService.getValuesFromUrl(this.apiUrl, this.connectionId, key).subscribe(
        (values: string[]) => {
          this.availableValues = values;
          // Update filter options if this is a dropdown or multiselect
          if (this.filterType === 'dropdown' || this.filterType === 'multiselect') {
            this.filterOptions = values;
          }
        },
        (error) => {
          console.error('Error loading available values:', error);
          this.availableValues = [];
        }
      );
    }
  }
  
  // Configuration methods
  toggleConfigMode(): void {
    this.isConfigMode = !this.isConfigMode;
    if (this.isConfigMode) {
      // Initialize config values from current filter if available
      if (this.selectedFilter) {
        this.configFilterKey = this.selectedFilter.field;
        this.configFilterType = this.selectedFilter.type;
        this.configFilterLabel = this.selectedFilter.label;
        this.configFilterOptions = (this.selectedFilter.options || []).join(',');
      } else {
        // Fallback to current properties
        this.configFilterKey = this.filterKey;
        this.configFilterType = this.filterType;
        this.configFilterLabel = this.filterLabel;
        this.configFilterOptions = this.filterOptions.join(',');
      }
      this.configApiUrl = this.apiUrl;
      this.configConnectionId = this.connectionId;
    }
  }
  
  saveConfiguration(): void {
    const config = {
      filterKey: this.configFilterKey,
      filterType: this.configFilterType,
      filterLabel: this.configFilterLabel,
      filterOptions: this.configFilterOptions.split(',').map(opt => opt.trim()).filter(opt => opt),
      apiUrl: this.configApiUrl,
      connectionId: this.configConnectionId
    };
    
    // Emit configuration change
    this.configChange.emit(config);
    
    // Update local properties
    this.filterKey = config.filterKey;
    this.filterType = config.filterType;
    this.filterLabel = config.filterLabel;
    this.filterOptions = config.filterOptions;
    this.apiUrl = config.apiUrl;
    this.connectionId = config.connectionId;
    
    // Clear filter value when changing configuration
    this.filterValue = '';
    
    // Load available keys if API URL is provided
    if (this.apiUrl) {
      this.loadAvailableKeys();
    }
    
    // Load available values for the selected key if it's a dropdown or multiselect
    if ((this.configFilterType === 'dropdown' || this.configFilterType === 'multiselect') && this.configFilterKey) {
      this.loadAvailableValues(this.configFilterKey);
    }
    
    // Register the updated filter with the filter service
    this.registerFilter();
    
    // Update selected filter
    this.updateSelectedFilter();
    
    // Exit config mode
    this.isConfigMode = false;
  }
  
  cancelConfiguration(): void {
    this.isConfigMode = false;
  }
  
  // Handle filter key change in configuration
  onFilterKeyChange(key: string): void {
    // Clear the previous filter value when changing keys
    this.filterValue = '';
    
    // Clear filter options until new values are loaded
    this.filterOptions = [];
    
    this.configFilterKey = key;
    
    // Load available values for the selected key if it's a dropdown or multiselect
    if ((this.configFilterType === 'dropdown' || this.configFilterType === 'multiselect') && key) {
      this.loadAvailableValues(key);
    }
    
    // Clear the filter service value for the previous filter key
    if (this.selectedFilter) {
      this.filterService.updateFilterValue(this.selectedFilter.id, '');
    }
  }
  
  // Handle API URL change in configuration
  onApiUrlChange(url: string): void {
    this.configApiUrl = url;
    // Load available keys when API URL changes
    if (url) {
      this.loadAvailableKeys();
      // Also clear available values since the API has changed
      this.availableValues = [];
      this.filterOptions = [];
    }
  }
  
  // Handle filter type change in configuration
  onFilterTypeChange(type: string): void {
    this.configFilterType = type;
    // If changing to dropdown or multiselect and we have a key selected, load values
    if ((type === 'dropdown' || type === 'multiselect') && this.configFilterKey) {
      this.loadAvailableValues(this.configFilterKey);
    }
  }
  
  // Add method to check if an option is selected for checkboxes
  isOptionSelected(option: string): boolean {
    if (!this.filterValue) {
      return false;
    }
    
    // Ensure filterValue is an array for multiselect
    if (!Array.isArray(this.filterValue)) {
      this.filterValue = [];
      return false;
    }
    
    return this.filterValue.includes(option);
  }
  // need to check this 
  // Add method to handle multiselect option change
  onMultiselectOptionChange(event: any, option: string): void {
    // Initialize filterValue array if it doesn't exist
    if (!this.filterValue) {
      this.filterValue = [];
    }
    
    // Ensure filterValue is an array
    if (!Array.isArray(this.filterValue)) {
      this.filterValue = [];
    }
    
    if (event.target.checked) {
      // Add option if not already in array
      if (!this.filterValue.includes(option)) {
        this.filterValue.push(option);
      }
    } else {
      // Remove option from array
      const index = this.filterValue.indexOf(option);
      if (index > -1) {
        this.filterValue.splice(index, 1);
      }
    }
    
    // Emit the change event
    this.onFilterValueChange(this.filterValue);
  }
  
  // Add method to toggle multiselect dropdown visibility
  toggleMultiselectDropdown(): void {
    this.showMultiselectDropdown = !this.showMultiselectDropdown;
    
    // Add document click handler to close dropdown when clicking outside
    if (this.showMultiselectDropdown) {
      setTimeout(() => {
        const handleClick = (event: MouseEvent) => {
          const target = event.target as HTMLElement;
          if (!target.closest('.compact-multiselect-display') && !target.closest('.compact-multiselect-dropdown')) {
            this.showMultiselectDropdown = false;
            document.removeEventListener('click', handleClick);
          }
        };
        document.addEventListener('click', handleClick);
      }, 0);
    }
  }
}