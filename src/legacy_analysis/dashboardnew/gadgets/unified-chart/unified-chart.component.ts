import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { Dashboard3Service } from '../../services/dashboard3.service';
import { FilterService } from '../../common-filter/filter.service';
import { Subscription, fromEvent } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartDataset } from 'chart.js';
import { DynamicChartLoaderService } from '../../services/dynamic-chart-loader.service';

@Component({
  selector: 'app-unified-chart',
  templateUrl: './unified-chart.component.html',
  styleUrls: ['./unified-chart.component.scss']
})
export class UnifiedChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() chartType: string;
  @Input() xAxis: string;
  @Input() yAxis: string | string[];
  @Input() table: string;
  @Input() datastore: string;
  @Input() charttitle: string;
  @Input() chartlegend: boolean = true;
  @Input() showlabel: boolean = true;
  @Input() chartcolor: boolean;
  @Input() slices: boolean;
  @Input() donut: boolean;
  @Input() charturl: string;
  @Input() chartparameter: string;
  @Input() datasource: string;
  @Input() fieldName: string;
  @Input() connection: number;

  // Drilldown configuration inputs
  @Input() drilldownEnabled: boolean = false;
  @Input() drilldownApiUrl: string;
  @Input() drilldownXAxis: string;
  @Input() drilldownYAxis: string;
  @Input() drilldownParameter: string;
  @Input() baseFilters: any[] = [];
  @Input() drilldownFilters: any[] = [];
  @Input() drilldownLayers: any[] = [];

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  // Chart data properties
  chartLabels: string[] = [];
  chartData: any[] = [];
  chartOptions: any = {};
  chartPlugins = [];
  chartLegend: boolean = true;

  // Bubble chart specific properties
  bubbleChartData: ChartDataset[] = [];

  // No data state
  noDataAvailable: boolean = false;

  // Loading state
  isLoading: boolean = false;

  // Multi-layer drilldown state tracking
  drilldownStack: any[] = [];
  currentDrilldownLevel: number = 0;
  originalChartData: any = {};

  // Filter visibility toggle
  showFilters: boolean = false;

  // Flag to prevent infinite loops
  private isFetchingData: boolean = false;

  // Subscriptions to unsubscribe on destroy
  private subscriptions: Subscription[] = [];

  // Filter properties
  private openMultiselects: Map<string, string> = new Map();
  private documentClickHandler: ((event: MouseEvent) => void) | null = null;
  private filtersInitialized: boolean = false;

  // Dynamic template properties
  dynamicTemplate: string = '';
  dynamicStyles: string = '';
  dynamicOptions: any = null;
  
  // Properties to hold extracted values from dynamic template
  extractedChartType: string = '';
  extractedDatasetsBinding: string = '';
  extractedLabelsBinding: string = '';
  extractedOptionsBinding: string = '';
  extractedLegendBinding: string = '';
  extractedChartClickBinding: string = '';
  extractedChartHoverBinding: string = '';

  // Add setter to log when dynamicTemplate changes
  setDynamicTemplate(value: string) {
    console.log('Setting dynamic template:', value);
    this.dynamicTemplate = value;
    
    // Extract values from the dynamic template
    this.extractTemplateValues(value);
    
    // Apply dynamic options if they were extracted
    if (this.dynamicOptions) {
      this.mergeDynamicOptions();
    }
    
    // Apply dynamic styles if they were extracted
    if (this.dynamicStyles) {
      this.applyDynamicStyles();
    }
    
    // Trigger change detection to ensure the template is rendered
    setTimeout(() => {
      console.log('Dynamic template updated in DOM');
      // Check if the dynamic template container exists
      const dynamicContainer = this.el.nativeElement.querySelector('.dynamic-template-container');
      console.log('Dynamic template container:', dynamicContainer);
      if (dynamicContainer) {
        console.log('Dynamic container innerHTML:', dynamicContainer.innerHTML);
      }
      // Check if the canvas element exists in the DOM
      const canvasElements = this.el.nativeElement.querySelectorAll('canvas');
      console.log('Canvas elements found in DOM:', canvasElements.length);
      if (canvasElements.length > 0) {
        console.log('First canvas element:', canvasElements[0]);
        // Check if it has the baseChart directive processed
        const firstCanvas = canvasElements[0];
        console.log('Canvas has baseChart directive processed:', firstCanvas.classList.contains('chartjs-render-monitor'));
      } else {
        console.log('No canvas elements found - checking if template was inserted but not processed');
        // Check if there's HTML content in the dynamic container
        if (dynamicContainer) {
          const htmlContent = dynamicContainer.innerHTML;
          console.log('HTML content in dynamic container:', htmlContent);
          if (htmlContent && htmlContent.includes('canvas')) {
            console.log('Canvas tag found in HTML but not processed by Angular');
          }
        }
      }
    }, 100);
  }

  // Extract values from dynamic template HTML
  private extractTemplateValues(template: string): void {
    console.log('Extracting values from template:', template);
    
    // Reset extracted values
    this.extractedChartType = this.chartType || '';
    this.extractedDatasetsBinding = 'chartData';
    this.extractedLabelsBinding = 'chartLabels';
    this.extractedOptionsBinding = 'chartOptions';
    this.extractedLegendBinding = 'chartLegend';
    this.extractedChartClickBinding = 'chartClicked($event)';
    this.extractedChartHoverBinding = 'chartHovered($event)';
    
    if (!template) {
      console.log('No template to extract values from');
      return;
    }
    
    // Parse the template to extract bindings
    // Look for [chartType] binding
    const chartTypeMatch = template.match(/\[chartType\]="([^"]+)"/);
    if (chartTypeMatch && chartTypeMatch[1]) {
      this.extractedChartType = chartTypeMatch[1];
      console.log('Extracted chartType binding:', this.extractedChartType);
    }
    
    // Look for [datasets] binding
    const datasetsMatch = template.match(/\[datasets\]="([^"]+)"/);
    if (datasetsMatch && datasetsMatch[1]) {
      this.extractedDatasetsBinding = datasetsMatch[1];
      console.log('Extracted datasets binding:', this.extractedDatasetsBinding);
    }
    
    // Look for [labels] binding
    const labelsMatch = template.match(/\[labels\]="([^"]+)"/);
    if (labelsMatch && labelsMatch[1]) {
      this.extractedLabelsBinding = labelsMatch[1];
      console.log('Extracted labels binding:', this.extractedLabelsBinding);
    }
    
    // Look for [options] binding
    const optionsMatch = template.match(/\[options\]="([^"]+)"/);
    if (optionsMatch && optionsMatch[1]) {
      this.extractedOptionsBinding = optionsMatch[1];
      console.log('Extracted options binding:', this.extractedOptionsBinding);
    }
    
    // Look for [legend] binding
    const legendMatch = template.match(/\[legend\]="([^"]+)"/);
    if (legendMatch && legendMatch[1]) {
      this.extractedLegendBinding = legendMatch[1];
      console.log('Extracted legend binding:', this.extractedLegendBinding);
    }
    
    // Look for (chartClick) binding
    const chartClickMatch = template.match(/\(chartClick\)="([^"]+)"/);
    if (chartClickMatch && chartClickMatch[1]) {
      this.extractedChartClickBinding = chartClickMatch[1];
      console.log('Extracted chartClick binding:', this.extractedChartClickBinding);
    }
    
    // Look for (chartHover) binding
    const chartHoverMatch = template.match(/\(chartHover\)="([^"]+)"/);
    if (chartHoverMatch && chartHoverMatch[1]) {
      this.extractedChartHoverBinding = chartHoverMatch[1];
      console.log('Extracted chartHover binding:', this.extractedChartHoverBinding);
    }
    
    // Extract CSS styles if present in the template
    const styleMatch = template.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    if (styleMatch && styleMatch[1]) {
      this.dynamicStyles = styleMatch[1];
      console.log('Extracted CSS styles:', this.dynamicStyles);
    }
  }

  constructor(
    private dashboardService: Dashboard3Service,
    private filterService: FilterService,
    private dynamicChartLoader: DynamicChartLoaderService,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit(): void {
    // Subscribe to filter changes
    this.subscriptions.push(
      this.filterService.filterState$.subscribe(filters => {
        this.fetchChartData();
      })
    );

    // Log initial input values for debugging
    console.log('UnifiedChartComponent ngOnInit - initial input values:', {
      chartType: this.chartType,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      table: this.table,
      baseFilters: this.baseFilters,
      drilldownFilters: this.drilldownFilters,
      drilldownLayers: this.drilldownLayers
    });

    // Check if filters are available
    console.log('Has filters in ngOnInit:', this.hasFilters());

    // Initialize filter values if they haven't been initialized yet
    if (!this.filtersInitialized) {
      this.initializeFilterValues();
      this.filtersInitialized = true;
    }

    // Initialize chart options with default structure
    this.initializeChartOptions();

    // Load dynamic template and options for this chart type
    this.loadDynamicChartConfig();

    this.fetchChartData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('UnifiedChartComponent input changes:', changes);

    // Log chartType changes specifically
    if (changes.chartType) {
      console.log('Chart type changed from', changes.chartType.previousValue, 'to', changes.chartType.currentValue);
    }

    // Log all input values for debugging
    console.log('Current input values:', {
      chartType: this.chartType,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      table: this.table,
      baseFilters: this.baseFilters,
      drilldownFilters: this.drilldownFilters,
      drilldownLayers: this.drilldownLayers
    });

    // Initialize filter values if they haven't been initialized yet
    if (!this.filtersInitialized && (changes.baseFilters || changes.drilldownFilters || changes.drilldownLayers)) {
      this.initializeFilterValues();
      this.filtersInitialized = true;
    }

    // Check if any of the key properties have changed
    const chartTypeChanged = changes.chartType && !changes.chartType.firstChange;
    const xAxisChanged = changes.xAxis && !changes.xAxis.firstChange;
    const yAxisChanged = changes.yAxis && !changes.yAxis.firstChange;
    const tableChanged = changes.table && !changes.table.firstChange;
    const connectionChanged = changes.connection && !changes.connection.firstChange;
    const baseFiltersChanged = changes.baseFilters && !changes.baseFilters.firstChange;
    const drilldownFiltersChanged = changes.drilldownFilters && !changes.drilldownFilters.firstChange;

    // Drilldown configuration changes
    const drilldownEnabledChanged = changes.drilldownEnabled && !changes.drilldownEnabled.firstChange;
    const drilldownApiUrlChanged = changes.drilldownApiUrl && !changes.drilldownApiUrl.firstChange;
    const drilldownXAxisChanged = changes.drilldownXAxis && !changes.drilldownXAxis.firstChange;
    const drilldownYAxisChanged = changes.drilldownYAxis && !changes.drilldownYAxis.firstChange;
    const drilldownLayersChanged = changes.drilldownLayers && !changes.drilldownLayers.firstChange;

    // Log base filters changes for debugging
    if (baseFiltersChanged) {
      console.log('Base filters changed:', changes.baseFilters);
      console.log('Current base filters:', this.baseFilters);
      // Log detailed information about each filter
      if (this.baseFilters && Array.isArray(this.baseFilters)) {
        this.baseFilters.forEach((filter, index) => {
          console.log(`Base filter ${index} details:`, {
            field: filter.field,
            value: filter.value,
            type: filter.type,
            options: filter.options
          });
        });
      }
    }

    // Also log when baseFilters is not changed but we still have filters
    if (!baseFiltersChanged && this.baseFilters && this.baseFilters.length > 0) {
      console.log('Base filters present but not changed, logging current state:');
      this.baseFilters.forEach((filter, index) => {
        console.log(`Base filter ${index} details:`, {
          field: filter.field,
          value: filter.value,
          type: filter.type,
          options: filter.options
        });
      });
    }

    // Load dynamic template and options if chart type changed
    if (chartTypeChanged) {
      this.loadDynamicChartConfig();
    }

    // Only fetch data if the actual chart configuration changed and we're not already fetching
    if (!this.isFetchingData && (chartTypeChanged || xAxisChanged || yAxisChanged || tableChanged || connectionChanged || baseFiltersChanged || drilldownFiltersChanged ||
      drilldownEnabledChanged || drilldownApiUrlChanged || drilldownXAxisChanged || drilldownYAxisChanged ||
      drilldownLayersChanged)) {
      console.log('Chart configuration changed, fetching new data');
      this.initializeChartOptions();
      this.fetchChartData();
    }

    // Update legend visibility if it changed
    if (changes.chartlegend !== undefined) {
      this.chartLegend = changes.chartlegend.currentValue;
      // Ensure chartOptions and required structures exist before accessing legend
      if (!this.chartOptions) {
        this.chartOptions = {};
      }
      if (!this.chartOptions.plugins) {
        this.chartOptions.plugins = {};
      }
      if (!this.chartOptions.plugins.legend) {
        this.chartOptions.plugins.legend = { display: this.chartLegend };
      } else {
        this.chartOptions.plugins.legend.display = this.chartLegend;
      }
      console.log('Chart legend changed to:', this.chartLegend);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());

    // Remove document click handler
    if (this.documentClickHandler) {
      document.removeEventListener('click', this.documentClickHandler);
    }
  }

  // Load dynamic chart configuration (template, styles, and options) for the current chart type
  private loadDynamicChartConfig(): void {
    if (!this.chartType) {
      console.log('No chart type specified, skipping dynamic chart config loading');
      return;
    }

    console.log(`Loading dynamic chart configuration for chart type: ${this.chartType}`);
    console.log('Current dynamic template:', this.dynamicTemplate);

    // Get chart type by name and load its configuration
    console.log('Calling getChartTypeByName with:', this.chartType);
    this.dynamicChartLoader.getChartTypeByName(this.chartType).subscribe({
      next: (chartType) => {
        console.log('Received chart type by name :', chartType);
        if (chartType) {
          console.log('Found chart type:', chartType);

          // Load the complete configuration for this chart type
          console.log('Loading chart configuration for chart type ID:', chartType.id);
          this.dynamicChartLoader.loadChartConfiguration(chartType.id).subscribe({
            next: (config) => {
              console.log('Received chart configuration:', config);
              console.log('Loaded chart configuration:', config);

              // Apply the first template if available (for CSS styles)
              if (config.templates && config.templates.length > 0) {
                const defaultTemplate = config.templates.find(t => t.isDefault) || config.templates[0];
                if (defaultTemplate) {
                  const templateHtml = defaultTemplate.templateHtml || '';
                  console.log('Template HTML to be set:', templateHtml);
                  this.setDynamicTemplate(templateHtml);
                  this.dynamicStyles = defaultTemplate.templateCss || '';

                  // Apply styles to the component
                  this.applyDynamicStyles();

                  console.log('Applied dynamic template and styles', {
                    template: this.dynamicTemplate,
                    styles: this.dynamicStyles
                  });
                }
              } else {
                console.log('No templates found for chart type:', this.chartType);
              }

              // Apply dynamic options if available
              console.log('Checking for dynamic fields:', config.dynamicFields);
              if (config.dynamicFields && config.dynamicFields.length > 0) {
                // Find the field that contains chart options
                const optionsField = config.dynamicFields.find(field =>
                  field.fieldName === 'chartOptions' || field.fieldName.toLowerCase().includes('options'));

                if (!optionsField) {
                  console.log('No chartOptions field found in dynamic fields');
                }

                if (optionsField && optionsField.fieldOptions) {
                  try {
                    this.dynamicOptions = JSON.parse(optionsField.fieldOptions);
                    console.log('Applied dynamic chart options:', this.dynamicOptions);

                    // Merge dynamic options with current chart options
                    this.mergeDynamicOptions();
                  } catch (e) {
                    console.error('Error parsing dynamic chart options:', e);
                  }
                }
              } else {
                console.log('No dynamic fields found for chart type:', this.chartType);
              }
            },
            error: (error) => {
              console.error('Error loading chart configuration:', error);
            }
          });
        } else {
          console.log(`Chart type ${this.chartType} not found in database`);
          // Log available chart types for debugging
          console.log('Available chart types in database:');
          this.dynamicChartLoader.loadAllChartConfigurations().subscribe({
            next: (chartTypes) => {
              console.log('All chart types:', chartTypes);
            },
            error: (error) => {
              console.error('Error loading chart types:', error);
            }
          });
        }
      },
      error: (error) => {
        console.error('Error loading chart type:', error);
      }
    });
  }

  // Merge dynamic options with current chart options
  private mergeDynamicOptions(): void {
    if (this.dynamicOptions) {
      console.log('Merging dynamic options with existing chart options:', {
        existing: this.chartOptions,
        dynamic: this.dynamicOptions
      });
      
      // Deep merge dynamic options with existing chart options
      this.chartOptions = this.deepMerge(this.chartOptions, this.dynamicOptions);
      
      console.log('Merged chart options:', this.chartOptions);

      // If we have a chart instance, update it
      if (this.chart) {
        this.chart.options = this.chartOptions;
        this.chart.render();
      }
    }
  }
  
  // Helper method for deep merging objects
  private deepMerge(target: any, source: any): any {
    const result = { ...target };
    
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          // Recursively merge objects
          result[key] = this.deepMerge(result[key] || {}, source[key]);
        } else {
          // Override with source value
          result[key] = source[key];
        }
      }
    }
    
    return result;
  }

  // Apply dynamic styles to the component
  private applyDynamicStyles(): void {
    // Remove any previously applied dynamic styles
    const existingStyles = this.el.nativeElement.querySelectorAll('.dynamic-chart-styles');
    existingStyles.forEach((style: HTMLElement) => {
      style.remove();
    });

    // Apply new styles if available
    if (this.dynamicStyles) {
      const styleElement = this.renderer.createElement('style');
      this.renderer.setAttribute(styleElement, 'class', 'dynamic-chart-styles');
      this.renderer.setProperty(styleElement, 'textContent', this.dynamicStyles);
      this.renderer.appendChild(this.el.nativeElement, styleElement);
      console.log('Applied dynamic styles to component');
    }
  }

  // Initialize chart after dynamic template is rendered
  private initializeDynamicChart(): void {
    // This is a complex issue - Angular directives in dynamically inserted HTML
    // don't get processed automatically. We would need to use a different approach
    // such as creating components dynamically or using a different template mechanism.
    console.log('Initializing dynamic chart - this is where we would handle chart initialization');
    
    // NOTE: The baseChart directive in dynamically inserted HTML via [innerHTML] 
    // will not be processed by Angular. This is a limitation of Angular's change detection.
    // Possible solutions:
    // 1. Use Angular's dynamic component creation API
    // 2. Modify the approach to use a different template mechanism
    // 3. Keep the canvas element in the static template and only load options dynamically
  }

  // Check if filters are available
  hasFilters(): boolean {
    const hasBaseFilters = this.baseFilters && this.baseFilters.length > 0;
    // console.log('Checking for filters - baseFilters:', this.baseFilters, 'hasBaseFilters:', hasBaseFilters);
    return hasBaseFilters;
  }

  // Toggle filter visibility
  toggleFilters(): void {
    console.log('Toggling filters. Current state:', this.showFilters);
    console.log('Base filters available:', this.hasFilters());
    this.showFilters = !this.showFilters;
    console.log('New state:', this.showFilters);
  }

  // Initialize filter values with proper default values based on type
  private initializeFilterValues(): void {
    console.log('Initializing filter values');
    console.log('Base filters before initialization:', this.baseFilters);

    // Initialize base filters
    if (this.baseFilters && Array.isArray(this.baseFilters)) {
      this.baseFilters.forEach((filter, index) => {
        console.log(`Processing base filter ${index}:`, filter);
        if (filter.value === undefined || filter.value === null) {
          switch (filter.type) {
            case 'multiselect':
              filter.value = [];
              break;
            case 'date-range':
              filter.value = { start: null, end: null };
              break;
            case 'toggle':
              filter.value = false;
              break;
            default:
              filter.value = '';
          }
          console.log(`Initialized base filter ${index} value to:`, filter.value);
        } else {
          console.log(`Base filter ${index} already has value:`, filter.value);
        }
      });
    } else {
      // Initialize as empty array if not provided
      this.baseFilters = [];
    }

    console.log('Base filters after initialization:', this.baseFilters);

    // Initialize drilldown filters
    if (this.drilldownFilters && Array.isArray(this.drilldownFilters)) {
      this.drilldownFilters.forEach((filter, index) => {
        console.log(`Processing drilldown filter ${index}:`, filter);
        if (filter.value === undefined || filter.value === null) {
          switch (filter.type) {
            case 'multiselect':
              filter.value = [];
              break;
            case 'date-range':
              filter.value = { start: null, end: null };
              break;
            case 'toggle':
              filter.value = false;
              break;
            default:
              filter.value = '';
          }
          console.log(`Initialized drilldown filter ${index} value to:`, filter.value);
        } else {
          console.log(`Drilldown filter ${index} already has value:`, filter.value);
        }
      });
    } else {
      // Initialize as empty array if not provided
      this.drilldownFilters = [];
    }

    // Initialize layer filters
    if (this.drilldownLayers && Array.isArray(this.drilldownLayers)) {
      this.drilldownLayers.forEach((layer, layerIndex) => {
        console.log(`Processing drilldown layer ${layerIndex}:`, layer);
        if (layer.filters && Array.isArray(layer.filters)) {
          layer.filters.forEach((filter, filterIndex) => {
            console.log(`Processing layer ${layerIndex} filter ${filterIndex}:`, filter);
            if (filter.value === undefined || filter.value === null) {
              switch (filter.type) {
                case 'multiselect':
                  filter.value = [];
                  break;
                case 'date-range':
                  filter.value = { start: null, end: null };
                  break;
                case 'toggle':
                  filter.value = false;
                  break;
                default:
                  filter.value = '';
              }
              console.log(`Initialized layer ${layerIndex} filter ${filterIndex} value to:`, filter.value);
            } else {
              console.log(`Layer ${layerIndex} filter ${filterIndex} already has value:`, filter.value);
            }
          });
        }
      });
    } else {
      // Initialize as empty array if not provided
      this.drilldownLayers = [];
    }

    console.log('Filter values initialized:', {
      baseFilters: this.baseFilters,
      drilldownFilters: this.drilldownFilters,
      drilldownLayers: this.drilldownLayers
    });
  }

  // Initialize chart options based on chart type
  private initializeChartOptions(): void {
    // Initialize with default structure to ensure plugins.legend exists
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    };

    // If we have dynamic options, use them instead of the default ones
    if (this.dynamicOptions) {
      this.mergeDynamicOptions();
      return;
    }

    switch (this.chartType) {
      // case 'bar':
      //   this.initializeBarChartOptions();
      //   break;
      // case 'line':
      //   this.initializeLineChartOptions();
      //   break;
      // case 'pie':
      //   this.initializePieChartOptions();
      //   break;
      // case 'doughnut':
      //   this.initializeDoughnutChartOptions();
      //   break;
      // case 'bubble':
      //   this.initializeBubbleChartOptions();
      //   break;
      // case 'radar':
      //   this.initializeRadarChartOptions();
      //   break;
      // case 'polar':
      //   this.initializePolarChartOptions();
      //   break;
      // case 'scatter':
      //   this.initializeScatterChartOptions();
      //   break;
      default:
        this.initializeDefaultChartOptions();
    }
  }

  private initializeBarChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      barPercentage: 0.6, // Reduced from 0.8 to create more spacing between bars
      categoryPercentage: 0.8, // Reduced from 0.9 to create more spacing between categories
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
            padding: 15,
            font: {
              size: 12
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 12
            }
          },
          // Add some padding to the y-axis to prevent bars from touching the top
          suggestedMax: 10
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: 12
            },
            // Add padding to legend items
            padding: 20
          }
        },
        tooltip: {
          enabled: true,
          // Improve tooltip appearance
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: {
            size: 14
          },
          bodyFont: {
            size: 12
          }
        }
      },
      layout: {
        padding: {
          bottom: 60,
          left: 15,
          right: 15,
          top: 15
        }
      },
      // Add bar chart specific options
      indexAxis: 'x', // Horizontal bars
      elements: {
        bar: {
          borderWidth: 2, // Increased border width for better visibility
          borderSkipped: false, // Show all borders for better separation
          // Add border color to make bars more distinct
          borderColor: 'rgba(255, 255, 255, 0.8)' // White border for better separation
        }
      },
      // Animation settings for smoother transitions
      animation: {
        duration: 1000,
        easing: 'easeInOutQuart'
      }
    };
  }

  private initializeLineChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45,
            padding: 15,
            font: {
              size: 12
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 12
            }
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          enabled: true
        }
      },
      layout: {
        padding: {
          bottom: 60,
          left: 15,
          right: 15,
          top: 15
        }
      }
    };
  }

  private initializePieChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          enabled: true
        }
      }
    };
  }

  private initializeDoughnutChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            font: {
              size: 12
            }
          }
        },
        tooltip: {
          enabled: true
        }
      }
    };
  }

  private initializeBubbleChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'X Axis'
          },
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Y Axis'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
          mode: 'point',
          intersect: false,
          callbacks: {
            label: function (context: any) {
              const point: any = context.raw;
              if (point && point.hasOwnProperty('y') && point.hasOwnProperty('r')) {
                const yValue = parseFloat(point.y);
                const rValue = parseFloat(point.r);
                if (!isNaN(yValue) && !isNaN(rValue)) {
                  return `Value: ${yValue.toFixed(2)}, Size: ${rValue.toFixed(1)}`;
                }
              }
              return context.dataset.label || '';
            }
          }
        }
      },
      animation: {
        duration: 800,
        easing: 'easeInOutQuart'
      },
      elements: {
        point: {
          hoverRadius: 12,
          hoverBorderWidth: 3
        }
      },
      layout: {
        padding: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 30
        }
      }
    };
  }

  private initializeRadarChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: {
            display: true
          },
          suggestedMin: 0,
          ticks: {
            backdropColor: 'rgba(0, 0, 0, 0)'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    };
  }

  private initializePolarChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    };
  }

  private initializeScatterChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          type: 'linear',
          position: 'bottom'
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    };
  }

  private initializeDefaultChartOptions(): void {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    };
  }

  fetchChartData(): void {
    // Set flag to prevent recursive calls
    this.isFetchingData = true;
    this.isLoading = true;
    this.noDataAvailable = false;

    // Ensure chart options are initialized
    if (!this.chartOptions) {
      this.initializeChartOptions();
    }

    console.log('Starting fetchChartData for chart type:', this.chartType);

    // If we're in drilldown mode, fetch the appropriate drilldown data
    if (this.currentDrilldownLevel > 0 && this.drilldownStack.length > 0) {
      console.log('Fetching drilldown data');
      this.fetchDrilldownData();
      return;
    }

    // If we have the necessary data, fetch chart data from the service
    if (this.table && this.xAxis && this.yAxis) {
      console.log('Fetching chart data for:', {
        chartType: this.chartType,
        table: this.table,
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        connection: this.connection
      });

      // Convert yAxis to string if it's an array
      const yAxisString = Array.isArray(this.yAxis) ? this.yAxis.join(',') : this.yAxis;

      // Convert baseFilters to filter parameters
      let filterParams = '';
      if (this.baseFilters && this.baseFilters.length > 0) {
        const filterObj = {};
        this.baseFilters.forEach(filter => {
          if (filter.field && filter.value) {
            filterObj[filter.field] = filter.value;
          }
        });
        if (Object.keys(filterObj).length > 0) {
          filterParams = JSON.stringify(filterObj);
        }
      }

      // Add common filters to filter parameters
      const commonFilters = this.filterService.getFilterValues();
      console.log('Common filters from service:', commonFilters);

      if (Object.keys(commonFilters).length > 0) {
        // Merge common filters with base filters
        const mergedFilterObj = {};

        // Add base filters first
        if (filterParams) {
          try {
            const baseFilterObj = JSON.parse(filterParams);
            Object.assign(mergedFilterObj, baseFilterObj);
          } catch (e) {
            console.warn('Failed to parse base filter parameters:', e);
          }
        }

        // Add common filters using the field name as the key, not the filter id
        Object.keys(commonFilters).forEach(filterId => {
          const filterValue = commonFilters[filterId];
          // Find the filter definition to get the field name
          const filterDef = this.filterService.getFilters().find(f => f.id === filterId);
          if (filterDef && filterDef.field) {
            const fieldName = filterDef.field;
            if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
              mergedFilterObj[fieldName] = filterValue;
            }
          } else {
            // Fallback to using filterId as field name if no field is defined
            if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
              mergedFilterObj[filterId] = filterValue;
            }
          }
        });

        if (Object.keys(mergedFilterObj).length > 0) {
          filterParams = JSON.stringify(mergedFilterObj);
        }
      }

      console.log('Final filter parameters:', filterParams);

      // Fetch data from the dashboard service
      this.dashboardService.getChartData(
        this.table,
        this.chartType,
        this.xAxis,
        yAxisString,
        this.connection,
        '',
        '',
        filterParams
      ).subscribe(
        (data: any) => {
          console.log('Received chart data:', data);

          if (data === null || data === undefined) {
            console.warn('Chart API returned null/undefined data.');
            this.noDataAvailable = true;
          } else if (data && data.chartLabels && data.chartData) {
            // Handle the standard format
            this.noDataAvailable = data.chartLabels.length === 0;

            if (this.chartType === 'bubble') {
              // For bubble charts, transform the data
              this.bubbleChartData = this.transformToBubbleData(data.chartLabels, data.chartData);
            } else {
              this.chartLabels = data.chartLabels;
              this.chartData = data.chartData;
            }
          } else if (data && data.labels && data.datasets) {
            // Handle the legacy format
            this.noDataAvailable = data.labels.length === 0;

            if (this.chartType === 'bubble') {
              // For bubble charts, use the datasets directly
              this.bubbleChartData = data.datasets;
            } else {
              this.chartLabels = data.labels;
              this.chartData = data.datasets;
            }
          } else {
            console.warn('Chart received data does not have expected structure', data);
            this.noDataAvailable = true;
          }

          // Reset flags after fetching
          this.isFetchingData = false;
          this.isLoading = false;

          // Trigger chart update
          setTimeout(() => {
            if (this.chart) {
              this.chart.update();
            }
          }, 100);
        },
        (error) => {
          console.error('Error fetching chart data:', error);
          this.noDataAvailable = true;
          this.chartLabels = [];
          this.chartData = [];
          this.bubbleChartData = [];

          // Reset flags after fetching
          this.isFetchingData = false;
          this.isLoading = false;
        }
      );
    } else {
      console.log('Missing required data for chart:', {
        chartType: this.chartType,
        table: this.table,
        xAxis: this.xAxis,
        yAxis: this.yAxis,
        connection: this.connection
      });
      this.noDataAvailable = true;
      this.chartLabels = [];
      this.chartData = [];
      this.bubbleChartData = [];

      // Reset flags after fetching
      this.isFetchingData = false;
      this.isLoading = false;
    }
  }

  // Fetch drilldown data based on current drilldown level
  fetchDrilldownData(): void {
    console.log('Fetching drilldown data, current level:', this.currentDrilldownLevel);
    console.log('Drilldown stack:', this.drilldownStack);

    // Get the current drilldown configuration based on the current level
    let drilldownConfig;
    if (this.currentDrilldownLevel === 1) {
      // Base drilldown level
      drilldownConfig = {
        apiUrl: this.drilldownApiUrl,
        xAxis: this.drilldownXAxis,
        yAxis: this.drilldownYAxis,
        parameter: this.drilldownParameter
      };
    } else {
      // Multi-layer drilldown level
      const layerIndex = this.currentDrilldownLevel - 2; // -2 because level 1 is base drilldown
      if (layerIndex >= 0 && layerIndex < this.drilldownLayers.length) {
        drilldownConfig = this.drilldownLayers[layerIndex];
      } else {
        console.warn('Invalid drilldown layer index:', layerIndex);
        this.noDataAvailable = true;
        this.chartLabels = [];
        this.chartData = [];
        this.bubbleChartData = [];
        return;
      }
    }

    console.log('Drilldown config for level', this.currentDrilldownLevel, ':', drilldownConfig);

    // Check if we have valid drilldown configuration
    if (!drilldownConfig || !drilldownConfig.apiUrl || !drilldownConfig.xAxis || !drilldownConfig.yAxis) {
      console.warn('Missing drilldown configuration for level:', this.currentDrilldownLevel);
      this.noDataAvailable = true;
      this.chartLabels = [];
      this.chartData = [];
      this.bubbleChartData = [];
      return;
    }

    // Get the parameter value from the drilldown stack
    let parameterValue = '';
    if (this.drilldownStack.length > 0) {
      const lastEntry = this.drilldownStack[this.drilldownStack.length - 1];
      parameterValue = lastEntry.clickedValue || '';
      console.log('Parameter value from last click:', parameterValue);
    }

    // Get the parameter field from drilldown config
    const parameterField = drilldownConfig.parameter || '';
    console.log('Parameter field:', parameterField);

    console.log('Fetching drilldown data for level:', this.currentDrilldownLevel, {
      apiUrl: drilldownConfig.apiUrl,
      xAxis: drilldownConfig.xAxis,
      yAxis: drilldownConfig.yAxis,
      parameterField: parameterField,
      parameterValue: parameterValue,
      connection: this.connection
    });

    // Build the actual API URL with parameter replacement
    let actualApiUrl = drilldownConfig.apiUrl;
    console.log('Original API URL:', actualApiUrl);
    console.log('Parameter value to use:', parameterValue);
    console.log('Parameter field:', parameterField);

    // Check if the URL contains angle brackets for parameter replacement
    const hasAngleBrackets = /<[^>]+>/.test(actualApiUrl);

    if (hasAngleBrackets && parameterValue) {
      // Replace angle brackets placeholder with actual value
      console.log('Replacing angle brackets with parameter value');
      const encodedValue = encodeURIComponent(parameterValue);
      actualApiUrl = actualApiUrl.replace(/<[^>]+>/g, encodedValue);
      console.log('URL after angle bracket replacement:', actualApiUrl);
    }

    // Convert drilldown layer filters to filter parameters (if applicable)
    const filterObj = {};

    // Add drilldown layer filters
    if (drilldownConfig.filters && drilldownConfig.filters.length > 0) {
      drilldownConfig.filters.forEach((filter: any) => {
        if (filter.field && filter.value) {
          filterObj[filter.field] = filter.value;
        }
      });
    }

    // Add drilldownFilters
    if (this.drilldownFilters && this.drilldownFilters.length > 0) {
      this.drilldownFilters.forEach(filter => {
        if (filter.field && filter.value) {
          filterObj[filter.field] = filter.value;
        }
      });
    }

    // Add common filters
    const commonFilters = this.filterService.getFilterValues();
    Object.keys(commonFilters).forEach(filterId => {
      const filterValue = commonFilters[filterId];

      // Find the filter definition to get the field name
      const filterDef = this.filterService.getFilters().find(f => f.id === filterId);

      if (filterDef && filterDef.field) {
        const fieldName = filterDef.field;
        if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
          filterObj[fieldName] = filterValue;
        }
      }
    });

    // Convert to JSON string for API call
    let drilldownFilterParams = '';
    if (Object.keys(filterObj).length > 0) {
      drilldownFilterParams = JSON.stringify(filterObj);
    }

    console.log('Drilldown filter parameters:', drilldownFilterParams);

    // Fetch data from the dashboard service
    this.dashboardService.getChartData(
      actualApiUrl,
      this.chartType,
      drilldownConfig.xAxis,
      drilldownConfig.yAxis,
      this.connection,
      parameterField,
      parameterValue,
      drilldownFilterParams
    ).subscribe(
      (data: any) => {
        console.log('Received drilldown data:', data);
        if (data === null) {
          console.warn('Drilldown API returned null data.');
          this.noDataAvailable = true;
          this.chartLabels = [];
          this.chartData = [];
          this.bubbleChartData = [];
          return;
        }

        // Handle the actual data structure returned by the API
        if (data && data.chartLabels && data.chartData) {
          // Backend has already filtered the data, just display it
          this.noDataAvailable = data.chartLabels.length === 0;

          if (this.chartType === 'bubble') {
            // For bubble charts, transform the data
            this.bubbleChartData = this.transformToBubbleData(data.chartLabels, data.chartData);
          } else {
            this.chartLabels = data.chartLabels;
            this.chartData = data.chartData;
          }

          console.log('Updated chart with drilldown data:', {
            labels: this.chartLabels,
            data: this.chartData,
            bubbleData: this.bubbleChartData
          });
        } else if (data && data.labels && data.datasets) {
          // Handle the legacy format
          this.noDataAvailable = data.labels.length === 0;

          if (this.chartType === 'bubble') {
            // For bubble charts, use the datasets directly
            this.bubbleChartData = data.datasets;
          } else {
            this.chartLabels = data.labels;
            this.chartData = data.datasets;
          }

          console.log('Updated chart with drilldown legacy data format:', {
            labels: this.chartLabels,
            data: this.chartData,
            bubbleData: this.bubbleChartData
          });
        } else {
          console.warn('Drilldown received data does not have expected structure', data);
          this.noDataAvailable = true;
          this.chartLabels = [];
          this.chartData = [];
          this.bubbleChartData = [];
        }

        // Set loading state to false
        this.isLoading = false;

        // Trigger chart update
        setTimeout(() => {
          if (this.chart) {
            this.chart.update();
          }
        }, 100);
      },
      (error) => {
        console.error('Error fetching drilldown data:', error);
        this.noDataAvailable = true;
        this.chartLabels = [];
        this.chartData = [];
        this.bubbleChartData = [];
        this.isLoading = false;
      }
    );
  }

  // Transform data to bubble chart format
  private transformToBubbleData(labels: any[], data: any[]): ChartDataset[] {
    console.log('Transforming data to bubble format:', { labels, data });

    // Handle null/undefined data
    if (!labels || !data) {
      console.log('Labels or data is null/undefined, returning empty dataset');
      return [];
    }

    // If we have the expected bubble data format, return it as is
    if (data && data.length > 0 && data[0].data && data[0].data.length > 0 &&
      typeof data[0].data[0] === 'object' && data[0].data[0].hasOwnProperty('x') &&
      data[0].data[0].hasOwnProperty('y') && data[0].data[0].hasOwnProperty('r')) {
      console.log('Data is already in bubble format, returning as is');
      return data;
    }

    // Transform the data properly for bubble chart
    // Assuming labels are x-values and data[0].data are y-values
    if (labels && data && data.length > 0 && data[0].data) {
      console.log('Transforming regular data to bubble format');
      const yValues = data[0].data;
      const label = data[0].label || 'Dataset 1';

      // Handle case where yValues might not be an array
      if (!Array.isArray(yValues)) {
        console.log('yValues is not an array, returning empty dataset');
        return [];
      }

      console.log('yValues type:', typeof yValues);
      console.log('yValues length:', yValues.length);
      console.log('First few yValues:', yValues.slice(0, 5));

      // Find min and max values for scaling
      let minValue = Infinity;
      let maxValue = -Infinity;
      const validYValues = [];

      // First pass: collect valid values and find min/max
      for (let i = 0; i < yValues.length; i++) {
        let y;
        if (typeof yValues[i] === 'string') {
          y = parseFloat(yValues[i]);
        } else {
          y = yValues[i];
        }

        if (!isNaN(y)) {
          validYValues.push(y);
          minValue = Math.min(minValue, y);
          maxValue = Math.max(maxValue, y);
        }
      }

      console.log('Value range:', { minValue, maxValue });

      // Adjust radius range based on number of data points
      const dataPointCount = Math.min(labels.length, yValues.length);
      let minRadius = 3;
      let maxRadius = 30;

      // Adjust radius range based on data point count
      if (dataPointCount > 50) {
        minRadius = 2;
        maxRadius = 20;
      } else if (dataPointCount > 20) {
        minRadius = 3;
        maxRadius = 25;
      }

      console.log('Radius range:', { minRadius, maxRadius, dataPointCount });

      // Create bubble points from labels (x) and data (y)
      const bubblePoints = [];
      const bubbleColors = [];
      const minLength = Math.min(labels.length, yValues.length);

      console.log('Processing data points:', { labels, yValues, minLength });

      for (let i = 0; i < minLength; i++) {
        // Convert y to number if it's a string
        let y;
        if (typeof yValues[i] === 'string') {
          y = parseFloat(yValues[i]);
          console.log(`Converted string yValue to number: ${yValues[i]} -> ${y}`);
        } else {
          y = yValues[i];
        }

        // Handle NaN values
        if (isNaN(y)) {
          console.log(`Skipping point ${i} due to NaN y value: ${yValues[i]}`);
          continue;
        }

        // Calculate radius based on the y-value with logarithmic scaling
        const r = this.logScale(y, minValue, maxValue, minRadius, maxRadius);

        console.log(`Value: ${y}, Radius: ${r}`);

        // For x-value, we'll use the index position since labels are strings
        const x = i;

        // Generate a unique color for this bubble
        const backgroundColor = this.generateBubbleColor(i, y, minLength);

        // Store the color for the dataset
        bubbleColors.push(backgroundColor);

        // Add the point
        const point = {
          x,
          y,
          r
        };
        console.log(`Adding point ${i}:`, point);
        bubblePoints.push(point);
      }

      console.log('Generated bubble points:', bubblePoints);
      console.log('Generated bubble points count:', bubblePoints.length);
      console.log('Generated bubble colors count:', bubbleColors.length);

      // If we have no valid points, return empty array
      if (bubblePoints.length === 0) {
        console.log('No valid bubble points generated, returning empty dataset');
        return [];
      }

      // Create a single dataset with all bubble points
      const bubbleDatasets: ChartDataset[] = [
        {
          data: bubblePoints,
          label: label,
          backgroundColor: bubbleColors,
          borderColor: bubbleColors.map(color => this.replaceAlpha(color, 1)),
          hoverBackgroundColor: bubbleColors.map(color => this.replaceAlpha(color, 0.9)),
          hoverBorderColor: 'rgba(255, 255, 255, 1)',
          borderWidth: 2,
          pointHoverRadius: 10,
        }
      ];

      console.log('Transformed bubble data:', bubbleDatasets);
      return bubbleDatasets;
    }

    console.log('Could not transform data, returning empty dataset');
    return [];
  }

  // Helper function to calculate logarithmic scaling
  private logScale(value: number, min: number, max: number, minRadius: number, maxRadius: number): number {
    if (min === max) return (minRadius + maxRadius) / 2;

    // Normalize value to 0-1 range
    const normalized = (value - min) / (max - min);

    // Apply logarithmic scaling (base 10)
    // Add 1 to avoid log(0) and scale to 1-10 range
    const logValue = Math.log10(normalized * 9 + 1);

    // Scale to desired radius range
    return minRadius + (logValue / Math.log10(10)) * (maxRadius - minRadius);
  }

  // Helper function to generate different colors for bubbles
  private generateBubbleColor(index: number, value: number, total: number): string {
    // Generate colors based on index or value
    // Using HSL color model for better color distribution
    const hue = (index * 137.508) % 360; // Golden angle approximation for good distribution
    const saturation = 80 + (index % 20); // High saturation for vibrant colors
    const lightness = 40 + (index % 30); // Vary lightness for contrast

    // Convert HSL to RGB
    const h = hue / 360;
    const s = saturation / 100;
    const l = lightness / 100;

    const rgb = this.hslToRgb(h, s, l);
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.7)`;
  }

  // Helper function to convert HSL to RGB
  private hslToRgb(h: number, s: number, l: number): { r: number, g: number, b: number } {
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  // Helper function to replace alpha value in RGBA color string
  private replaceAlpha(color: string, newAlpha: number): string {
    // Match rgba(r, g, b, a) format and replace alpha value
    return color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/, `rgba($1, $2, $3, ${newAlpha})`);
  }

  // Reset to original data (go back to base level)
  resetToOriginalData(): void {
    console.log('Resetting to original data');
    console.log('Current stack before reset:', this.drilldownStack);
    console.log('Current level before reset:', this.currentDrilldownLevel);

    this.currentDrilldownLevel = 0;
    this.drilldownStack = [];

    if (this.originalChartData.labels && this.originalChartData.data) {
      this.chartLabels = [...this.originalChartData.labels];
      this.chartData = [...this.originalChartData.data];
      console.log('Restored original data');
    }

    console.log('After reset - data:', { labels: this.chartLabels, data: this.chartData });

    // Re-fetch original data
    this.fetchChartData();
  }

  // Navigate back to previous drilldown level
  navigateBack(): void {
    console.log('Navigating back, current stack:', this.drilldownStack);
    console.log('Current level:', this.currentDrilldownLevel);

    if (this.drilldownStack.length > 0) {
      // Remove the last entry from the stack
      const removedEntry = this.drilldownStack.pop();
      console.log('Removed entry from stack:', removedEntry);

      // Update the current drilldown level
      this.currentDrilldownLevel = this.drilldownStack.length;
      console.log('New level after pop:', this.currentDrilldownLevel);
      console.log('Stack after pop:', this.drilldownStack);

      if (this.drilldownStack.length > 0) {
        // Fetch data for the previous level
        console.log('Fetching data for previous level');
        this.fetchDrilldownData();
      } else {
        // Back to base level
        console.log('Back to base level, resetting to original data');
        this.resetToOriginalData();
      }
    } else {
      // Already at base level, reset to original data
      console.log('Already at base level, resetting to original data');
      this.resetToOriginalData();
    }
  }

  // Chart click handler
  public chartClicked(e: any): void {
    console.log('Chart clicked:', e);

    // If drilldown is enabled and we have a valid click event
    if (this.drilldownEnabled && e.active && e.active.length > 0) {
      // Get the index of the clicked element
      const clickedIndex = e.active[0].index;

      // Get the dataset index
      const datasetIndex = e.active[0].datasetIndex;

      // Get the data point
      let dataPoint;
      if (this.chartType === 'bubble') {
        dataPoint = this.bubbleChartData[datasetIndex].data[clickedIndex];
      } else {
        dataPoint = this.chartData[datasetIndex].data[clickedIndex];
      }

      console.log('Clicked on chart element:', { datasetIndex, clickedIndex, dataPoint });

      // If we're not at the base level, store original data
      if (this.currentDrilldownLevel === 0) {
        // Store original data before entering drilldown mode
        this.originalChartData = {
          labels: [...this.chartLabels],
          data: JSON.parse(JSON.stringify(this.chartData)),
          bubbleData: JSON.parse(JSON.stringify(this.bubbleChartData))
        };
        console.log('Stored original data for drilldown');
      }

      // Determine the next drilldown level
      const nextDrilldownLevel = this.currentDrilldownLevel + 1;

      console.log('Next drilldown level will be:', nextDrilldownLevel);

      // Check if there's a drilldown configuration for this level
      let hasDrilldownConfig = false;
      let drilldownConfig;

      if (nextDrilldownLevel === 1) {
        // Base drilldown level
        drilldownConfig = {
          apiUrl: this.drilldownApiUrl,
          xAxis: this.drilldownXAxis,
          yAxis: this.drilldownYAxis,
          parameter: this.drilldownParameter
        };
        hasDrilldownConfig = !!this.drilldownApiUrl && !!this.drilldownXAxis && !!this.drilldownYAxis;
      } else {
        // Multi-layer drilldown level
        const layerIndex = nextDrilldownLevel - 2; // -2 because level 1 is base drilldown
        if (layerIndex < this.drilldownLayers.length) {
          drilldownConfig = this.drilldownLayers[layerIndex];
          hasDrilldownConfig = drilldownConfig.enabled &&
            !!drilldownConfig.apiUrl &&
            !!drilldownConfig.xAxis &&
            !!drilldownConfig.yAxis;
        }
      }

      console.log('Drilldown config for next level:', drilldownConfig);
      console.log('Has drilldown config:', hasDrilldownConfig);

      // If there's a drilldown configuration for the next level, proceed
      if (hasDrilldownConfig) {
        // Add this click to the drilldown stack
        const stackEntry = {
          level: nextDrilldownLevel,
          datasetIndex: datasetIndex,
          clickedIndex: clickedIndex,
          dataPoint: dataPoint,
          clickedValue: dataPoint // Using data point as value for now
        };

        this.drilldownStack.push(stackEntry);

        console.log('Added to drilldown stack:', stackEntry);
        console.log('Current drilldown stack:', this.drilldownStack);

        // Update the current drilldown level
        this.currentDrilldownLevel = nextDrilldownLevel;

        console.log('Entering drilldown level:', this.currentDrilldownLevel);

        // Fetch drilldown data for the new level
        this.fetchDrilldownData();
      } else {
        console.log('No drilldown configuration for level:', nextDrilldownLevel);
      }
    } else {
      console.log('Drilldown not enabled or invalid click event');
    }
  }

  public chartHovered(e: any): void {
    // console.log('Chart hovered:', e);
  }

  // Method to check if chart data is valid
  public isChartDataValid(): boolean {
    if (this.chartType === 'bubble') {
      console.log('Checking if bubble chart data is valid:', this.bubbleChartData);
      if (!this.bubbleChartData || this.bubbleChartData.length === 0) {
        console.log('Bubble chart data is null or empty');
        return false;
      }

      // Check if any dataset has data
      for (const dataset of this.bubbleChartData) {
        console.log('Checking dataset:', dataset);
        if (dataset.data && dataset.data.length > 0) {
          console.log('Dataset has data, length:', dataset.data.length);
          // For bubble charts, check if data points have x, y, r properties
          for (const point of dataset.data) {
            console.log('Checking point:', point);
            if (typeof point === 'object' && point.hasOwnProperty('x') && point.hasOwnProperty('y') && point.hasOwnProperty('r')) {
              // Valid bubble point
              console.log('Found valid bubble point');
              return true;
            }
          }
        }
      }

      console.log('No valid bubble chart data found');
      return false;
    } else {
      console.log('Checking if chart data is valid:', { labels: this.chartLabels, data: this.chartData });
      if (!this.chartLabels || !this.chartData) {
        console.log('Chart labels or data is null');
        return false;
      }

      if (this.chartLabels.length === 0 || this.chartData.length === 0) {
        console.log('Chart labels or data is empty');
        return false;
      }

      // Check if any dataset has data
      for (const dataset of this.chartData) {
        if (dataset.data && dataset.data.length > 0) {
          console.log('Found valid chart data');
          return true;
        }
      }

      console.log('No valid chart data found');
      return false;
    }
  }

  // Check if there are active filters
  hasActiveFilters(): boolean {
    return (this.baseFilters && this.baseFilters.length > 0) ||
      (this.drilldownFilters && this.drilldownFilters.length > 0) ||
      this.hasActiveLayerFilters();
  }

  // Check if there are active layer filters for current drilldown level
  hasActiveLayerFilters(): boolean {
    if (this.currentDrilldownLevel > 1 && this.drilldownLayers && this.drilldownLayers.length > 0) {
      const layerIndex = this.currentDrilldownLevel - 2; // -2 because level 1 is base drilldown
      return layerIndex < this.drilldownLayers.length &&
        this.drilldownLayers[layerIndex].filters &&
        this.drilldownLayers[layerIndex].filters.length > 0;
    }
    return false;
  }

  // Get active layer filters for current drilldown level
  getActiveLayerFilters(): any[] {
    if (this.currentDrilldownLevel > 1 && this.drilldownLayers && this.drilldownLayers.length > 0) {
      const layerIndex = this.currentDrilldownLevel - 2; // -2 because level 1 is base drilldown
      if (layerIndex < this.drilldownLayers.length &&
        this.drilldownLayers[layerIndex].filters) {
        return this.drilldownLayers[layerIndex].filters;
      }
    }
    return [];
  }

  // Get filter options for dropdown/multiselect filters
  getFilterOptions(filter: any): string[] {
    if (filter.options) {
      if (Array.isArray(filter.options)) {
        return filter.options;
      } else if (typeof filter.options === 'string') {
        return filter.options.split(',').map(opt => opt.trim()).filter(opt => opt);
      }
    }
    return [];
  }

  // Check if an option is selected for multiselect filters
  isOptionSelected(filter: any, option: string): boolean {
    if (!filter.value) {
      return false;
    }

    if (Array.isArray(filter.value)) {
      return filter.value.includes(option);
    }

    return filter.value === option;
  }

  // Handle base filter changes
  onBaseFilterChange(filter: any): void {
    console.log('Base filter changed:', filter);
    // Refresh data when filter changes
    this.fetchChartData();
  }

  // Handle drilldown filter changes
  onDrilldownFilterChange(filter: any): void {
    console.log('Drilldown filter changed:', filter);
    // Refresh data when filter changes
    this.fetchChartData();
  }

  // Handle layer filter changes
  onLayerFilterChange(filter: any): void {
    console.log('Layer filter changed:', filter);
    // Refresh data when filter changes
    this.fetchChartData();
  }

  // Handle multiselect changes
  onMultiSelectChange(filter: any, option: string, event: any): void {
    const checked = event.target.checked;

    // Initialize filter.value as array if it's not already
    if (!Array.isArray(filter.value)) {
      filter.value = [];
    }

    if (checked) {
      // Add option to array if not already present
      if (!filter.value.includes(option)) {
        filter.value.push(option);
      }
    } else {
      // Remove option from array
      filter.value = filter.value.filter((item: string) => item !== option);
    }

    // Refresh data when filter changes
    this.fetchChartData();
  }

  // Handle date range changes
  onDateRangeChange(filter: any, event: any): void {
    // For date range filters, we need to handle the change differently
    // since we're binding to individual start/end properties
    if (!filter.value) {
      filter.value = { start: null, end: null };
    }

    // Refresh data when filter changes
    this.fetchChartData();
  }

  // Handle date range input changes for start/end dates
  onDateRangeInputChange(filter: any, dateType: string, event: any): void {
    // Initialize filter.value if it doesn't exist
    if (!filter.value) {
      filter.value = { start: null, end: null };
    }

    // Update the specific date type (start or end)
    filter.value[dateType] = event.target.value;

    // Refresh data when filter changes
    this.fetchChartData();
  }

  // Handle toggle changes
  onToggleChange(filter: any, checked: boolean): void {
    filter.value = checked;
    // Refresh data when filter changes
    this.fetchChartData();
  }

  // Toggle multiselect dropdown visibility
  toggleMultiselect(filter: any, context: string): void {
    const filterId = `${context}-${filter.field}`;
    if (this.isMultiselectOpen(filter, context)) {
      this.openMultiselects.delete(filterId);
    } else {
      // Close all other multiselects first
      this.openMultiselects.clear();
      this.openMultiselects.set(filterId, context);

      // Add document click handler to close dropdown when clicking outside
      this.addDocumentClickHandler();
    }
  }

  // Add document click handler to close dropdowns when clicking outside
  private addDocumentClickHandler(): void {
    if (!this.documentClickHandler) {
      this.documentClickHandler = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        // Check if click is outside any multiselect dropdown
        if (!target.closest('.multiselect-container')) {
          this.openMultiselects.clear();
          this.removeDocumentClickHandler();
        }
      };

      // Use setTimeout to ensure the click event that opened the dropdown doesn't immediately close it
      setTimeout(() => {
        document.addEventListener('click', this.documentClickHandler!);
      }, 0);
    }
  }

  // Remove document click handler
  private removeDocumentClickHandler(): void {
    if (this.documentClickHandler) {
      document.removeEventListener('click', this.documentClickHandler);
      this.documentClickHandler = null;
    }
  }

  // Check if multiselect dropdown is open
  isMultiselectOpen(filter: any, context: string): boolean {
    const filterId = `${context}-${filter.field}`;
    return this.openMultiselects.has(filterId);
  }

  // Get count of selected options for a multiselect filter
  getSelectedOptionsCount(filter: any): number {
    if (!filter.value) {
      return 0;
    }

    if (Array.isArray(filter.value)) {
      return filter.value.length;
    }

    return 0;
  }



  // Clear all filters
  clearAllFilters(): void {
    // Clear base filters
    if (this.baseFilters) {
      this.baseFilters.forEach(filter => {
        if (filter.type === 'multiselect') {
          filter.value = [];
        } else if (filter.type === 'date-range') {
          filter.value = { start: null, end: null };
        } else if (filter.type === 'toggle') {
          filter.value = false;
        } else {
          filter.value = '';
        }
      });
    }

    // Clear drilldown filters
    if (this.drilldownFilters) {
      this.drilldownFilters.forEach(filter => {
        if (filter.type === 'multiselect') {
          filter.value = [];
        } else if (filter.type === 'date-range') {
          filter.value = { start: null, end: null };
        } else if (filter.type === 'toggle') {
          filter.value = false;
        } else {
          filter.value = '';
        }
      });
    }

    // Clear layer filters
    if (this.drilldownLayers) {
      this.drilldownLayers.forEach(layer => {
        if (layer.filters) {
          layer.filters.forEach((filter: any) => {
            if (filter.type === 'multiselect') {
              filter.value = [];
            } else if (filter.type === 'date-range') {
              filter.value = { start: null, end: null };
            } else if (filter.type === 'toggle') {
              filter.value = false;
            } else {
              filter.value = '';
            }
          });
        }
      });
    }

    // Close all multiselect dropdowns
    this.openMultiselects.clear();

    // Refresh data
    this.fetchChartData();
  }
}