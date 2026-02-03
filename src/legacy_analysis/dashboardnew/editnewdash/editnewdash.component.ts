import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GridsterConfig } from 'angular-gridster2';
import { ToastrService } from 'ngx-toastr';
import { DashboardContentModel, DashboardModel, WidgetModel } from '../../../../../models/builder/dashboard';
import { Dashboard3Service } from '../services/dashboard3.service';
import { GridViewComponent } from '../gadgets/grid-view/grid-view.component';
import { DatastoreService } from '../services/datastore.service';
import { AlertsService } from '../services/alerts.service';
import { isArray } from 'highcharts';
// Add the SureconnectService import
import { SureconnectService } from '../sureconnect/sureconnect.service';
// Add the CommonFilterComponent import
import { CommonFilterComponent } from '../common-filter/common-filter.component';
// Add the CompactFilterComponent import
import { CompactFilterComponent } from '../common-filter';
// Add the FilterService import
import { FilterService } from '../common-filter/filter.service';
// Add the UnifiedChartComponent import
import { UnifiedChartComponent } from '../gadgets/unified-chart';
// Add the DynamicChartLoaderService import
import { DynamicChartLoaderService } from '../chart-config/dynamic-chart-loader.service';

function isNullArray(arr) {
  return !Array.isArray(arr) || arr.length === 0;
}

@Component({
  selector: 'app-editnewdash',
  templateUrl: './editnewdash.component.html',
  styleUrls: ['./editnewdash.component.scss']
})



export class EditnewdashComponent implements OnInit {

  editId: number;
  toggle: boolean;
  modeledit: boolean = false;
  commonFilterModalOpen: boolean = false; // Add common filter modal state
  public entryForm: FormGroup;
  public commonFilterForm: FormGroup; // Add common filter form
  
  // Add filterOptionsString property for compact filter
  filterOptionsString: string = '';
  
  // Add availableKeys property for compact filter
  availableKeys: string[] = [];

  // Initialize with default widgets and update dynamically
  WidgetsMock: WidgetModel[] = [
    {
      name: 'Common Filter',
      identifier: 'common_filter'
    },
    // {
    //   name: 'Radar Chart',
    //   identifier: 'radar_chart'
    // },
    // {
    //   name: 'Doughnut Chart',
    //   identifier: 'doughnut_chart'
    // },
    // {
    //   name: 'Line Chart',
    //   identifier: 'line_chart'
    // },
    // {
    //   name: 'Bar Chart',
    //   identifier: 'bar_chart'
    // },
    // {
    //   name: 'Pie Chart',
    //   identifier: 'pie_chart'
    // },
    // {
    //   name: 'Polar Area Chart',
    //   identifier: 'polar_area_chart'
    // },
    // {
    //   name: 'Bubble Chart',
    //   identifier: 'bubble_chart'
    // },
    // {
    //   name: 'Scatter Chart',
    //   identifier: 'scatter_chart'
    // },
    // {
    // name: 'Dynamic Chart',
    // identifier: 'dynamic_chart'
    // },
    // {
    // name: 'Financial Chart',
    // identifier: 'financial_chart'
    // },
    // {
    //   name: 'To Do',
    //   identifier: 'to_do_chart'
    // },
    // {
    //   name: 'Grid View',
    //   identifier: 'grid_view'
    // },
    {
      name: 'Compact Filter',
      identifier: 'compact_filter'
    },
    {
      name: 'Unified Chart',
      identifier: 'unified_chart'
    }
  ]

  public options: GridsterConfig;
  protected dashboardId: number;
  protected dashboardCollection: DashboardModel;
  //dashboardCollection:any;
  protected dashboardCollection1: DashboardModel[];
  public dashboardArray: DashboardContentModel[];
  public dashArr: [];

  protected componentCollection = [
    { name: "Common Filter", componentInstance: CommonFilterComponent },
    { name: "Line Chart", componentInstance: UnifiedChartComponent },
    { name: "Doughnut Chart", componentInstance: UnifiedChartComponent },
    { name: "Radar Chart", componentInstance: UnifiedChartComponent },
    { name: "Bar Chart", componentInstance: UnifiedChartComponent },
    { name: "Pie Chart", componentInstance: UnifiedChartComponent },
    { name: "Polar Area Chart", componentInstance: UnifiedChartComponent },
    { name: "Bubble Chart", componentInstance: UnifiedChartComponent },
    { name: "Scatter Chart", componentInstance: UnifiedChartComponent },
    { name: "Dynamic Chart", componentInstance: UnifiedChartComponent },
    { name: "Financial Chart", componentInstance: UnifiedChartComponent },
    { name: "To Do Chart", componentInstance: ToDoChartComponent },
    { name: "Grid View", componentInstance: GridViewComponent },
    { name: "Compact Filter", componentInstance: CompactFilterComponent },
    { name: "Unified Chart", componentInstance: UnifiedChartComponent },
  ];
  model: any;
  linesdata: any;
  id: any;

  // Add common filter data property
  commonFilterData = {
    connection: '',
    apiUrl: '',
    filters: [] as any[]
  };
  
  // Add common filter column data property
  commonFilterColumnData: any[] = [];

  gadgetsEditdata = {
    donut: '',
    chartlegend: '',
    showlabel: '',
    charturl: '',
    chartparameter: '',
    datastore: '',
    table: '',
    datasource: '',
    charttitle: '',
    id: '',
    fieldName: '',
    chartcolor: '',
    slices: '',
    yAxis: '',
    xAxis: '',
    connection: '', // Add connection field
    chartType: '', // Add chartType field
    // Drilldown configuration properties (base level)
    drilldownEnabled: false,
    drilldownApiUrl: '',
    // Removed drilldownParameterKey since we're using URL templates
    drilldownXAxis: '',
    drilldownYAxis: '',
    drilldownParameter: '', // Add drilldown parameter property
    baseFilters: [] as any[], // Add base filters for API
    drilldownFilters: [] as any[], // Add separate drilldown filters
    // Multi-layer drilldown configurations
    drilldownLayers: [] as any[],
    // Common filter properties
    commonFilterEnabled: false,
    commonFilterEnabledDrilldown: false,
    // Compact filter properties
    filterKey: '',
    filterType: 'text',
    filterLabel: '',
    filterOptions: [] as string[]
  };

  // Add sureconnect data property
  sureconnectData: any[] = [];
  layerColumnData: { [key: number]: any[] } = {}; // Add layer column data property

  // Add drilldown column data property
  drilldownColumnData = []; // Add drilldown column data property

  // Add chart types property for dynamic chart selection
  chartTypes: any[] = [];

  constructor(private route: ActivatedRoute,
    private router: Router,
    private dashboardService: Dashboard3Service,
    private toastr: ToastrService,
    private _fb: FormBuilder,
    private datastoreService: DatastoreService,
    private alertService: AlertsService,
    private sureconnectService: SureconnectService,
    private filterService: FilterService,
    private dynamicChartLoader: DynamicChartLoaderService) { } // Add SureconnectService, FilterService, and DynamicChartLoaderService to constructor

  // Add property to track if coming from dashboard runner
  fromRunner: boolean = false;
  
  ngOnInit(): void {
    // Reset the filter service when the component is initialized
    this.filterService.resetFilters();

    // Grid options
    this.options = {
      gridType: "fit",
      enableEmptyCellDrop: true,
      emptyCellDropCallback: this.onDrop,
      pushItems: true,
      swap: true,
      pushDirections: { north: true, east: true, south: true, west: true },
      resizable: { enabled: true },
      itemChangeCallback: this.itemChange.bind(this),
      draggable: {
        enabled: true,
        ignoreContent: true,
        dropOverItems: true,
        dragHandleClass: "drag-handler",
        ignoreContentClass: "no-drag",
      },
      displayGrid: "always",
      minCols: 10,
      minRows: 10,
      // Add resize callback to handle chart resizing
      itemResizeCallback: this.itemResize.bind(this)
    };
    
    // Check if coming from dashboard runner
    this.route.queryParams.subscribe(params => {
      if (params['fromRunner'] === 'true') {
        this.fromRunner = true;
      }
    });

    this.editId = this.route.snapshot.params.id;
    console.log(this.editId);
    this.dashboardService.getById(this.editId).subscribe((data) => {
      console.log("ngOnInit", data);
      this.linesdata = data;
      this.id = data.dashbord1_Line[0].id;
      console.log("this.id ", this.id);
    },
      (error: any) => {

      }
    );

    this.entryForm = this._fb.group({
      donut: [null],
      chartlegend: [null],
      showlabel: [null],
      charturl: [null],
      chartparameter: [null],
      datastore: [null],
      table: [null],
      fieldName: [null],
      datasource: [null],
      charttitle: [null],
      id: [null],
      chartcolor: [null],
      slices: [null],
      yAxis: [null],
      xAxis: [null],
      connection: [null], // Add connection to form group
      // Base drilldown configuration form controls
      drilldownEnabled: [null],
      drilldownApiUrl: [null],
      drilldownXAxis: [null],
      drilldownYAxis: [null],
      drilldownParameter: [null] // Add drilldown parameter to form group
      // Note: Dynamic drilldown layers and filters will be handled separately since they're complex objects
    });
    
    // Initialize common filter form
    this.commonFilterForm = this._fb.group({
      connection: [''],
      apiUrl: ['']
    });
    
    // Load chart types for dynamic chart selection
    this.loadChartTypesForSelection();
    
    // Load sureconnect data first, then load dashboard data
    this.loadSureconnectData();
    
    // Load common filter data if it exists
    this.loadCommonFilterData();
  }

  // Add method to load all chart types for dynamic selection
  loadChartTypesForSelection() {
  console.log('Loading chart types for selection');
  this.dynamicChartLoader.loadActiveChartTypes().subscribe({
    next: (chartTypes) => {
      console.log('Loaded chart types for selection:', chartTypes);
      this.chartTypes = chartTypes;

      // Convert each chart type to a WidgetModel
      const newWidgets = chartTypes.map(ct => ({
        name: ct.displayName || ct.name,
        // identifier: ct.name.toLowerCase().replace(/\s+/g, '_')
        identifier: `${ct.name.toLowerCase().replace(/\s+/g, '_')}_chart`
      }));

      // Filter out duplicates by identifier
      const existingIds = new Set(this.WidgetsMock.map(w => w.identifier));
      const uniqueNewWidgets = newWidgets.filter(w => !existingIds.has(w.identifier));

      // Append unique new widgets to WidgetsMock
      this.WidgetsMock = [...this.WidgetsMock, ...uniqueNewWidgets];

      console.log('Updated WidgetsMock:', this.WidgetsMock);
    },
    error: (error) => {
      console.error('Error loading chart types for selection:', error);
    }
  });
}

  
  // Add method to load sureconnect data
  loadSureconnectData() {
    this.sureconnectService.getAll().subscribe((data: any[]) => {
      this.sureconnectData = data;
      console.log('Sureconnect data loaded:', this.sureconnectData);
      // Now that sureconnect data is loaded, we can safely load dashboard data
      this.getData();
    }, (error) => {
      console.log('Error loading sureconnect data:', error);
      // Even if there's an error loading sureconnect data, we still need to load dashboard data
      this.getData();
    });
  }
  
  // Add method to load common filter data
  loadCommonFilterData() {
    // In a real implementation, this would fetch common filter data from the server
    // For now, we'll initialize with empty values
    console.log('Loading common filter data');
  }
  
  toggleMenu() {
    this.toggle = !this.toggle;
  }

  onDrag(event, identifier) {
    console.log("on drag", identifier);
    console.log("on drag ", event);
    event.dataTransfer.setData('widgetIdentifier', identifier);
  }
  datagadgets: any;
  dashboardLine: any;
  dashboardName: any;
  getData() {
    // Reset the filter service when switching between dashboard records
    this.filterService.resetFilters();
    
    // We get the id in get current router dashboard/:id
    this.route.params.subscribe(params => {
      // + is used to cast string to int
      this.dashboardId = +params["id"];
      // We make a get request with the dashboard id
      this.dashboardService.getById(this.dashboardId).subscribe(dashboard => {
        // We fill our dashboardCollection with returned Observable
        this.dashboardName = dashboard.dashboard_name;
        this.datagadgets = dashboard;
        this.dashboardLine = dashboard.dashbord1_Line;
        //this.dashboardCollection = dashboard.dashbord1_Line.model;
        console.log("this.datagadgets", this.datagadgets);
        console.log("this.dashboardLine", this.dashboardLine);
        this.dashboardCollection = JSON.parse(this.dashboardLine[0].model);
        //this.dashboardCollection =this.dashboardLine[0].model ;
        console.log("this.dasboard  ", this.dashboardCollection);
        console.log(this.dashboardCollection);
        // We parse serialized Json to generate components on the fly
        this.parseJson(this.dashboardCollection);
        
        // Set default connections for all gadgets if sureconnect data is available
        if (this.sureconnectData && this.sureconnectData.length > 0) {
          this.dashboardCollection.dashboard.forEach(item => {
            if (!item['connection'] || item['connection'] === '') {
              item['connection'] = this.sureconnectData[0].id;
            }
          });
        }
        
        // We copy array without reference
        this.dashboardArray = this.dashboardCollection.dashboard.slice();
        console.log("this.dashboardArray", this.dashboardArray);
      });
    });
  }

  // Super TOKENIZER 2.0 POWERED BY NATCHOIN
  parseJson(dashboardCollection: DashboardModel) {
    // We loop on our dashboardCollection
    dashboardCollection.dashboard.forEach(dashboard => {
      // We loop on our componentCollection
      this.componentCollection.forEach(component => {
        // We check if component key in our dashboardCollection
        // is equal to our component name key in our componentCollection
        if (dashboard.component === component.name) {
          // If it is, we replace our serialized key by our component instance
          dashboard.component = component.componentInstance;
        }
      });
      
      // Map chart names to unified chart types
      const chartTypeMap = {
        'Radar Chart': 'radar',
        'Line Chart': 'line',
        'Doughnut Chart': 'doughnut',
        'Bar Chart': 'bar',
        'Pie Chart': 'pie',
        'Polar Area Chart': 'polar',
        'Bubble Chart': 'bubble',
        'Scatter Chart': 'scatter',
        'Dynamic Chart': 'line',
        'Financial Chart': 'line'
      };
      
      // If this is a chart, set the chartType property
      if (chartTypeMap.hasOwnProperty(dashboard.name)) {
        dashboard.chartType = chartTypeMap[dashboard.name];
        // Keep the original name instead of changing it to "Unified Chart"
        // dashboard.name = "Unified Chart";
      }
      
      // Ensure compact filter configuration properties are properly initialized
      if (dashboard.component === 'Compact Filter' || dashboard.name === 'Compact Filter') {
        // Make sure all compact filter properties exist
        if (dashboard.filterKey === undefined) dashboard.filterKey = '';
        if (dashboard.filterType === undefined) dashboard.filterType = 'text';
        if (dashboard.filterLabel === undefined) dashboard.filterLabel = '';
        if (dashboard.filterOptions === undefined) dashboard.filterOptions = [];
        // table and connection properties should already exist for all components
      }
    });
  }

  serialize(dashboardCollection) {
    // We loop on our dashboardCollection
    dashboardCollection.forEach(dashboard => {
      // We loop on our componentCollection
      this.componentCollection.forEach(component => {
        // We check if component key in our dashboardCollection
        // is equal to our component name key in our componentCollection
        if (dashboard.name === component.name) {
          dashboard.component = component.name;
        }
      });
      
      // Map unified chart types back to chart names for serialization
      const chartNameMap = {
        'radar': 'Radar Chart',
        'line': 'Line Chart',
        'doughnut': 'Doughnut Chart',
        'bar': 'Bar Chart',
        'pie': 'Pie Chart',
        'polar': 'Polar Area Chart',
        'bubble': 'Bubble Chart',
        'scatter': 'Scatter Chart'
        // Removed hardcoded heatmap entry to make it fully dynamic
      };
      
      // If this is a unified chart, set the name back to the appropriate chart name
      if (dashboard.name === 'Unified Chart' && dashboard.chartType && chartNameMap.hasOwnProperty(dashboard.chartType)) {
        dashboard.name = chartNameMap[dashboard.chartType];
      }
      // Also handle the case where the chart already has the correct name
      else if (dashboard.chartType && chartNameMap.hasOwnProperty(dashboard.chartType) && 
               dashboard.name === chartNameMap[dashboard.chartType]) {
        // The name is already correct, no need to change it
        dashboard.component = "Unified Chart";
      }
      
      // Ensure compact filter configuration properties are preserved
      if (dashboard.name === 'Compact Filter') {
        // Make sure all compact filter properties exist
        if (dashboard.filterKey === undefined) dashboard.filterKey = '';
        if (dashboard.filterType === undefined) dashboard.filterType = 'text';
        if (dashboard.filterLabel === undefined) dashboard.filterLabel = '';
        if (dashboard.filterOptions === undefined) dashboard.filterOptions = [];
        // table and connection properties should already exist for all components
      }
    });
  }
  
  // Add method to get available fields for a filter dropdown (excluding already selected fields)
  getAvailableFields(filters: any[], currentIndex: number, allFields: string[]): string[] {
    if (!filters || !allFields) {
      return allFields || [];
    }
    
    // Get all selected fields except the current one
    const selectedFields = filters
      .filter((filter, index) => filter.field && index !== currentIndex)
      .map(filter => filter.field);
      
    // Return fields that haven't been selected yet
    return allFields.filter(field => !selectedFields.includes(field));
  }
  
  itemChange() {
    this.dashboardCollection.dashboard = this.dashboardArray;
    console.log("itemChange this.dashboardCollection.dashboard ", this.dashboardCollection.dashboard);
    console.log("itemChange this.dashboardCollection ", this.dashboardCollection);
    console.log("itemChange this.dashboardCollection type", typeof this.dashboardCollection);
    console.log("itemChange this.dashboardArray ", this.dashboardArray);
    let tmp = JSON.stringify(this.dashboardCollection);
    console.log("temp data", tmp);
    let parsed: DashboardModel = JSON.parse(tmp);
    console.log("parsed data", parsed);
    console.log("let parsed ", typeof parsed);
    this.serialize(parsed.dashboard);
    console.log("item chnage function ", typeof this.dashboardArray);
    //this._ds.updateDashboard(this.dashboardId, parsed).subscribe();
  }

  onDrop = (ev) => {
    console.log("on drop event ", ev);
    const componentType = ev.dataTransfer.getData("widgetIdentifier");
    // Safely calculate maxChartId, handling cases where chartid might be NaN or missing
    console.log("on drop ", componentType);
    let maxChartId = 0;
    if (this.dashboardArray && this.dashboardArray.length > 0) {
      const validChartIds = this.dashboardArray
        .map(item => item.chartid)
        .filter(chartid => typeof chartid === 'number' && !isNaN(chartid));
      
      if (validChartIds.length > 0) {
        maxChartId = Math.max(...validChartIds);
      }
    }
    switch (componentType) {
      // Handle all chart types by converting them to unified charts
      case "radar_chart":
        // Use dynamic chart creation for all chart types
        return this.createDynamicChart('radar', maxChartId);
      case "line_chart":
        return this.createDynamicChart('line', maxChartId);
      case "doughnut_chart":
        return this.createDynamicChart('doughnut', maxChartId);
      case "bar_chart":
        return this.createDynamicChart('bar', maxChartId);
      case "pie_chart":
        return this.createDynamicChart('pie', maxChartId);
      case "polar_area_chart":
        return this.createDynamicChart('polar', maxChartId);
      case "bubble_chart":
        return this.createDynamicChart('bubble', maxChartId);
      case "scatter_chart":
        return this.createDynamicChart('scatter', maxChartId);
      case "dynamic_chart":
        return this.createDynamicChart('line', maxChartId); // Default to line for dynamic chart
      case "financial_chart":
        return this.createDynamicChart('line', maxChartId); // Default to line for financial chart
      case "to_do_chart":
        return this.dashboardArray.push({
          cols: 5,
          rows: 5,
          x: 0,
          y: 0,
          chartid: maxChartId + 1,
          component: ToDoChartComponent,
          name: "To Do Chart"
        });
      case "common_filter":
        return this.dashboardArray.push({
          cols: 10,
          rows: 3,
          x: 0,
          y: 0,
          chartid: maxChartId + 1,
          component: CommonFilterComponent,
          name: "Common Filter"
        });
      case "compact_filter":
        return this.dashboardArray.push({
          cols: 3,
          rows: 2,
          x: 0,
          y: 0,
          chartid: maxChartId + 1,
          component: CompactFilterComponent,
          name: "Compact Filter",
          // Add default configuration for compact filter
          filterKey: '',
          filterType: 'text',
          filterLabel: '',
          filterOptions: []
        });
      case "grid_view":
        return this.dashboardArray.push({
          cols: 5,
          rows: 5,
          x: 0,
          y: 0,
          chartid: maxChartId + 1,
          component: GridViewComponent,
          name: "Grid View"
        });
      case "unified_chart":
        return this.createDynamicChart('bar', maxChartId); // Default to bar for unified chart
      default:
        // Handle any other chart types dynamically
        // Extract chart type name from identifier (e.g., "heatmap_chart" -> "heatmap")
        const chartTypeName = componentType.replace('_chart', '');
        console.log('Creating dynamic chart of type:', chartTypeName);
        console.log('Display name for chart:', this.getChartDisplayName(chartTypeName));
        
        // Use dynamic chart creation for all chart types
        return this.createDynamicChart(chartTypeName, maxChartId);
    }
  }
  removeItem(item) {
    this.dashboardArray.splice(
      this.dashboardArray.indexOf(item),
      1
    );
    this.itemChange();
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  modelid: number;
  // Update the editGadget method to initialize filter properties
  editGadget(item) {
    // If coming from dashboard runner, skip showing the config modal
    if (this.fromRunner) {
      console.log('Coming from dashboard runner, skipping config modal');
      return;
    }
    
    this.modeledit = true;
    this.modelid = item.chartid;
    console.log(this.modelid);
    this.gadgetsEditdata = item;
    this.gadgetsEditdata.fieldName = item.name;
    if (item.showlabel === undefined) { item.showlabel = true; }
    if (item.chartcolor === undefined) { item.chartcolor = true; }
    if (item.chartlegend === undefined) { item.chartlegend = true; }
    // Initialize common filter property if not present
    if (item['commonFilterEnabled'] === undefined) { 
      this.gadgetsEditdata['commonFilterEnabled'] = false; 
    }
    // Initialize drilldown common filter property if not present
    if (item['commonFilterEnabledDrilldown'] === undefined) { 
      this.gadgetsEditdata['commonFilterEnabledDrilldown'] = false; 
    }
    // Initialize compact filter properties if not present
    if (item['filterKey'] === undefined) { 
      this.gadgetsEditdata['filterKey'] = ''; 
    }
    if (item['filterType'] === undefined) { 
      this.gadgetsEditdata['filterType'] = 'text'; 
    }
    if (item['filterLabel'] === undefined) { 
      this.gadgetsEditdata['filterLabel'] = ''; 
    }
    if (item['filterOptions'] === undefined) { 
      this.gadgetsEditdata['filterOptions'] = []; 
    }
    // Initialize chartType property if not present (for unified chart)
    if (item['chartType'] === undefined) { 
      this.gadgetsEditdata['chartType'] = 'bar'; 
    }
    
    // Initialize filterOptionsString for compact filter
    if (item.name === 'Compact Filter') {
      this.filterOptionsString = this.gadgetsEditdata['filterOptions'].join(', ');
      // Load available keys when editing a compact filter
      if (this.gadgetsEditdata['table']) {
        this.loadAvailableKeys(this.gadgetsEditdata['table'], this.gadgetsEditdata['connection']);
      }
    } else {
      this.filterOptionsString = '';
    }
    
    // Initialize base filters with type and options if not present
    if (item['baseFilters'] === undefined) { 
      this.gadgetsEditdata['baseFilters'] = []; 
    } else {
      // Ensure each base filter has type and options properties
      this.gadgetsEditdata['baseFilters'] = this.gadgetsEditdata['baseFilters'].map(filter => ({
        field: filter.field || '',
        value: filter.value || '',
        type: filter.type || 'text',
        options: filter.options || '',
        availableValues: filter.availableValues || ''
      }));
    }
    
    // Initialize drilldown filters with type and options if not present
    if (item['drilldownFilters'] === undefined) { 
      this.gadgetsEditdata['drilldownFilters'] = []; 
    } else {
      // Ensure each drilldown filter has type and options properties
      this.gadgetsEditdata['drilldownFilters'] = this.gadgetsEditdata['drilldownFilters'].map(filter => ({
        field: filter.field || '',
        value: filter.value || '',
        type: filter.type || 'text',
        options: filter.options || '',
        availableValues: filter.availableValues || ''
      }));
    }
    
    // Initialize drilldown layers with proper filter structure if not present
    if (item['drilldownLayers'] === undefined) { 
      this.gadgetsEditdata['drilldownLayers'] = []; 
    } else {
      // Ensure each layer has proper filter structure
      this.gadgetsEditdata['drilldownLayers'] = this.gadgetsEditdata['drilldownLayers'].map(layer => {
        // Initialize parameter if not present
        if (layer['parameter'] === undefined) {
          layer['parameter'] = '';
        }
        // Initialize filters if not present
        if (layer['filters'] === undefined) {
          layer['filters'] = [];
        } else {
          // Ensure each layer filter has type and options properties
          layer['filters'] = layer['filters'].map(filter => ({
            field: filter.field || '',
            value: filter.value || '',
            type: filter.type || 'text',
            options: filter.options || '',
            availableValues: filter.availableValues || ''
          }));
        }
        // Initialize common filter property for layer if not present
        if (layer['commonFilterEnabled'] === undefined) {
          layer['commonFilterEnabled'] = false;
        }
        return layer;
      });
    }
    
    this.getStores();
    
    // Set default connection if none is set and we have connections
    if ((!item['connection'] || item['connection'] === '') && this.sureconnectData && this.sureconnectData.length > 0) {
      this.gadgetsEditdata['connection'] = this.sureconnectData[0].id;
      // Also update the form control
      this.entryForm.patchValue({ connection: this.sureconnectData[0].id });
    }
    
    // Initialize base drilldown properties if not present
    if (item['drilldownEnabled'] === undefined) { 
      this.gadgetsEditdata['drilldownEnabled'] = false; 
    }
    if (item['drilldownApiUrl'] === undefined) { 
      this.gadgetsEditdata['drilldownApiUrl'] = ''; 
    }
    // Removed drilldownParameterKey initialization
    if (item['drilldownXAxis'] === undefined) { 
      this.gadgetsEditdata['drilldownXAxis'] = ''; 
    }
    if (item['drilldownYAxis'] === undefined) { 
      this.gadgetsEditdata['drilldownYAxis'] = ''; 
    }
    if (item['drilldownParameter'] === undefined) { 
      this.gadgetsEditdata['drilldownParameter'] = ''; 
    }
    
    // Reset drilldown column data
    this.drilldownColumnData = [];
    
    // If drilldown is enabled and we have a drilldown API URL, fetch the drilldown column data
    if (this.gadgetsEditdata.drilldownEnabled && this.gadgetsEditdata.drilldownApiUrl) {
      this.refreshBaseDrilldownColumns();
    }
    
    // Check if we have either datastore or table to fetch columns
    if ((item.datastore !== undefined && item.datastore !== '' && item.datastore !== null) || 
        (item.table !== undefined && item.table !== '' && item.table !== null)) {
      const datastore = item.datastore;
      const table = item.table;
      
      // Fetch tables if datastore is available
      if (datastore) {
        this.getTables(datastore);
      }
      
      // Fetch columns if table is available
      if (table) {
        this.getColumns(datastore, table);
      }
      
      console.log(item.yAxis);
      // Set selectedyAxis regardless of whether it's an array or string
      if (item.yAxis !== undefined && item.yAxis !== '' && item.yAxis !== null) {
        if (isArray(item.yAxis)) {
          this.selectedyAxis = item.yAxis;
        } else {
          // For single yAxis values, convert to array
          this.selectedyAxis = [item.yAxis];
        }
        console.log(this.selectedyAxis);
      } else {
        this.selectedyAxis = [];
      }
    } else {
      this.selectedyAxis = [];
    }
    console.log(item);
  }

  dashbord1_Line = {
    //model:JSON.stringify(this.da),
    model: ''
  }


  UpdateLine() {
    console.log('Add button clicked.......');
    console.log(this.dashboardArray);
    console.log(this.dashboardCollection);
    console.log(typeof this.dashboardCollection);
    console.log(this.id);
    //this.dashbord1_Line.model = JSON.stringify(this.dashboardCollection);

    //https://www.w3schools.com/js/tryit.asp?filename=tryjson_stringify_function_tostring

    // First serialize the dashboard collection to ensure component names are properly set
    this.serialize(this.dashboardCollection.dashboard);

    let cmp = this.dashboardCollection.dashboard.forEach(dashboard => {
      this.componentCollection.forEach(component => {
        if (dashboard.name === component.name) {
          dashboard.component = component.name;
        }
      })
    })
    console.log(cmp);

    let tmp = JSON.stringify(this.dashboardCollection);
    //   var merged = this.dashboardArray.reduce((current, value, index) => {
    //     if(index > 0)
    //         current += ',';

    //     return current + value.component;
    // }, '');

    //console.log(merged);
    console.log("temp data", typeof tmp);
    console.log(tmp);
    this.dashbord1_Line.model = tmp;

    // let obj = this.dashboardCollection;
    // obj[1].component = obj[1].component.toString();
    // let myJSON = JSON.stringify(obj);
    // this.dashbord1_Line.model = myJSON;

    console.log("line data in addgadget ", this.dashbord1_Line);
    console.log("line data in addgadget type ", typeof this.dashbord1_Line);
    console.log("line model data ", this.dashbord1_Line.model);
    console.log("line model data type", typeof this.dashbord1_Line.model);
    this.dashboardService.UpdateLineData(this.id, this.dashbord1_Line).subscribe(
      (data: any) => {
        console.log('Updation Successful...');
        this.ngOnInit();
        console.log(data);
        this.router.navigate(["../../all"], { relativeTo: this.route })
      }
    );
    // if (data) {
    //   this.toastr.success('Updated successfully');
    //       }
  }

  // Update the onSubmit method to properly save filter data
  onSubmit(id) {
    console.log(id);
    
    // Check if ID is valid, including handling NaN
    if (id === null || id === undefined || isNaN(id)) {
      console.warn('Chart ID is null, undefined, or NaN, using modelid instead:', this.modelid);
      id = this.modelid;
    }
    
    // Ensure we have a valid numeric ID
    const numId = typeof id === 'number' ? id : parseInt(id, 10);
    if (isNaN(numId)) {
      console.error('Unable to determine valid chart ID, aborting onSubmit');
      return;
    }
    
    // Handle both array and string yAxis values
    if (this.selectedyAxis !== undefined && this.selectedyAxis !== null && 
        ((Array.isArray(this.selectedyAxis) && this.selectedyAxis.length > 0) || 
         (typeof this.selectedyAxis === 'string' && this.selectedyAxis !== ''))) {
      console.log("get y-axis", this.selectedyAxis);
      this.entryForm.patchValue({ yAxis: this.selectedyAxis });
    }
    let formdata = this.entryForm.value;
    let num = numId;
    console.log(this.entryForm.value);
    this.dashboardCollection.dashboard = this.dashboardCollection.dashboard.map(item => {
      if (item.chartid == num) {
        // Preserve the component reference
        const componentRef = item.component;
        
        //item["product_id"] = "thisistest";
        const xyz = { ...item, ...formdata }
        
        // Restore the component reference
        xyz.component = componentRef;
        
        // Explicitly ensure drilldown properties are preserved
        xyz.drilldownEnabled = this.gadgetsEditdata.drilldownEnabled;
        xyz.drilldownApiUrl = this.gadgetsEditdata.drilldownApiUrl;
        xyz.drilldownXAxis = this.gadgetsEditdata.drilldownXAxis;
        xyz.drilldownYAxis = this.gadgetsEditdata.drilldownYAxis;
        xyz.drilldownParameter = this.gadgetsEditdata.drilldownParameter;
        xyz.baseFilters = this.gadgetsEditdata.baseFilters; // Add base filters
        xyz.drilldownFilters = this.gadgetsEditdata.drilldownFilters; // Add drilldown filters
        xyz.drilldownLayers = this.gadgetsEditdata.drilldownLayers;
        xyz.commonFilterEnabled = this.gadgetsEditdata.commonFilterEnabled; // Add common filter property
        
        // For compact filter, preserve filter configuration properties
        if (item.name === 'Compact Filter') {
          xyz.filterKey = this.gadgetsEditdata.filterKey || '';
          xyz.filterType = this.gadgetsEditdata.filterType || 'text';
          xyz.filterLabel = this.gadgetsEditdata.filterLabel || '';
          // Convert filterOptionsString to array
          if (this.gadgetsEditdata.fieldName === 'Compact Filter') {
            xyz.filterOptions = this.filterOptionsString.split(',').map(opt => opt.trim()).filter(opt => opt);
          } else {
            xyz.filterOptions = this.gadgetsEditdata.filterOptions || [];
          }
          xyz.table = this.gadgetsEditdata.table || '';
          xyz.connection = this.gadgetsEditdata.connection || undefined;
        }
        
        // For unified chart, preserve chart configuration properties
        if (item.name === 'Unified Chart') {
          xyz.chartType = this.gadgetsEditdata.chartType || 'bar';
        }
        
        console.log(xyz);
        return xyz;
      }
      return item
    });
    console.log('dashboard collection ', this.dashboardCollection.dashboard);
    
    // Force gridster to refresh by triggering change detection
    if (this.options && this.options.api) {
      this.options.api.optionsChanged();
    }
    
    // Trigger change detection manually
    // This is a workaround to ensure the gridster re-renders the components
    setTimeout(() => {
      // Force a refresh by temporarily setting dashboardArray to empty and then back
      const tempArray = [...this.dashboardArray];
      this.dashboardArray = [];
      setTimeout(() => {
        this.dashboardArray = tempArray;
      }, 0);
    }, 0);
    
    this.modeledit = false;

    // this.entryForm.reset();

  }

  /**
   * Extract only the relevant chart configuration properties to pass to chart components
   * This prevents errors when trying to set properties that don't exist on the components
   */
  getChartInputs(item: any): any {
    // For CompactFilterComponent, pass only filter configuration properties
    if (item.name === 'Compact Filter') {
      const filterInputs = {
        filterKey: item['filterKey'] || '',
        filterType: item['filterType'] || 'text',
        filterLabel: item['filterLabel'] || '',
        filterOptions: item['filterOptions'] || [],
        apiUrl: item['table'] || '', // Use table as API URL
        connectionId: item['connection'] ? parseInt(item['connection'], 10) : undefined
      };
      
      // Preserve configuration in the item itself
      item['filterKey'] = filterInputs['filterKey'];
      item['filterType'] = filterInputs['filterType'];
      item['filterLabel'] = filterInputs['filterLabel'];
      item['filterOptions'] = filterInputs['filterOptions'];
      item['table'] = filterInputs['apiUrl'];
      item['connection'] = item['connection'];
      
      // Remove undefined properties to avoid passing unnecessary data
      Object.keys(filterInputs).forEach(key => {
        if (filterInputs[key] === undefined) {
          delete filterInputs[key];
        }
      });
      
      return filterInputs;
    }
    
    // For CommonFilterComponent, pass only filter-related properties
    if (item.component && item.component.name === 'CommonFilterComponent') {
      const commonFilterInputs = {
        baseFilters: item['baseFilters'] || [],
        drilldownFilters: item['drilldownFilters'] || [],
        drilldownLayers: item['drilldownLayers'] || [],
        fieldName: item['name'] || '',
        connection: item['connection'] || undefined
      };
      
      // Remove undefined properties to avoid passing unnecessary data
      Object.keys(commonFilterInputs).forEach(key => {
        if (commonFilterInputs[key] === undefined) {
          delete commonFilterInputs[key];
        }
      });
      
      return commonFilterInputs;
    }
    
    // For UnifiedChartComponent, pass chart properties with chartType
    // Check if the component is UnifiedChartComponent dynamically
    if (item.component === UnifiedChartComponent || 
        (item.component && item.component.name === 'UnifiedChartComponent') ||
        item.name === 'Unified Chart') {
      const unifiedChartInputs = {
        chartType: item.chartType || 'bar',
        xAxis: item.xAxis,
        yAxis: item.yAxis,
        table: item.table,
        datastore: item.datastore,
        charttitle: item.charttitle,
        chartlegend: item.chartlegend,
        showlabel: item.showlabel,
        chartcolor: item.chartcolor,
        slices: item.slices,
        donut: item.donut,
        charturl: item.charturl,
        chartparameter: item.chartparameter,
        datasource: item.datasource,
        fieldName: item.name, // Using item.name as fieldName
        connection: item['connection'], // Add connection field using bracket notation
        // Base drilldown configuration properties
        drilldownEnabled: item['drilldownEnabled'],
        drilldownApiUrl: item['drilldownApiUrl'],
        // Removed drilldownParameterKey since we're using URL templates
        drilldownXAxis: item['drilldownXAxis'],
        drilldownYAxis: item['drilldownYAxis'],
        drilldownParameter: item['drilldownParameter'], // Add drilldown parameter
        baseFilters: item['baseFilters'] || [], // Add base filters
        drilldownFilters: item['drilldownFilters'] || [], // Add drilldown filters
        // Multi-layer drilldown configurations
        drilldownLayers: item['drilldownLayers'] || []
      };
      
      // Remove undefined properties to avoid passing unnecessary data
      Object.keys(unifiedChartInputs).forEach(key => {
        if (unifiedChartInputs[key] === undefined) {
          delete unifiedChartInputs[key];
        }
      });
      
      return unifiedChartInputs;
    }
    
    // For GridViewComponent, pass chart properties with drilldown support
    if (item.component && item.component.name === 'GridViewComponent') {
      const gridInputs = {
        xAxis: item.xAxis,
        yAxis: item.yAxis,
        table: item.table,
        datastore: item.datastore,
        charttitle: item.charttitle,
        chartlegend: item.chartlegend,
        showlabel: item.showlabel,
        chartcolor: item.chartcolor,
        slices: item.slices,
        donut: item.donut,
        charturl: item.charturl,
        chartparameter: item.chartparameter,
        datasource: item.datasource,
        fieldName: item.name, // Using item.name as fieldName
        connection: item['connection'], // Add connection field using bracket notation
        // Base drilldown configuration properties
        drilldownEnabled: item['drilldownEnabled'],
        drilldownApiUrl: item['drilldownApiUrl'],
        // Removed drilldownParameterKey since we're using URL templates
        drilldownXAxis: item['drilldownXAxis'],
        drilldownYAxis: item['drilldownYAxis'],
        drilldownParameter: item['drilldownParameter'], // Add drilldown parameter
        baseFilters: item['baseFilters'] || [], // Add base filters
        drilldownFilters: item['drilldownFilters'] || [], // Add drilldown filters
        // Multi-layer drilldown configurations
        drilldownLayers: item['drilldownLayers'] || []
      };
      
      // Remove undefined properties to avoid passing unnecessary data
      Object.keys(gridInputs).forEach(key => {
        if (gridInputs[key] === undefined) {
          delete gridInputs[key];
        }
      });
      
      return gridInputs;
    }
    
    // For all other chart components, pass chart-specific properties
    const chartInputs = {
      xAxis: item.xAxis,
      yAxis: item.yAxis,
      table: item.table,
      datastore: item.datastore,
      charttitle: item.charttitle,
      chartlegend: item.chartlegend,
      showlabel: item.showlabel,
      chartcolor: item.chartcolor,
      slices: item.slices,
      donut: item.donut,
      charturl: item.charturl,
      chartparameter: item.chartparameter,
      datasource: item.datasource,
      fieldName: item.name, // Using item.name as fieldName
      connection: item['connection'], // Add connection field using bracket notation
      // Base drilldown configuration properties
      drilldownEnabled: item['drilldownEnabled'],
      drilldownApiUrl: item['drilldownApiUrl'],
      // Removed drilldownParameterKey since we're using URL templates
      drilldownXAxis: item['drilldownXAxis'],
      drilldownYAxis: item['drilldownYAxis'],
      drilldownParameter: item['drilldownParameter'], // Add drilldown parameter
      baseFilters: item['baseFilters'] || [], // Add base filters with type information
      drilldownFilters: item['drilldownFilters'] || [], // Add drilldown filters with type information
      // Multi-layer drilldown configurations
      drilldownLayers: item['drilldownLayers'] || []
    };
    
    // Remove undefined properties to avoid passing unnecessary data
    Object.keys(chartInputs).forEach(key => {
      if (chartInputs[key] === undefined) {
        delete chartInputs[key];
      }
    });
    
    return chartInputs;
  }

  // Update the applyChanges method to properly save filter data
  applyChanges(id) {
    console.log('Apply changes for chart ID:', id);
    
    // Check if ID is valid, including handling NaN
    if (id === null || id === undefined || isNaN(id)) {
      console.warn('Chart ID is null, undefined, or NaN, using modelid instead:', this.modelid);
      id = this.modelid;
    }
    
    // Ensure we have a valid numeric ID
    const numId = typeof id === 'number' ? id : parseInt(id, 10);
    if (isNaN(numId)) {
      console.error('Unable to determine valid chart ID, aborting applyChanges');
      return;
    }
    
    // Update the form with selected Y-axis values
    // Handle both array and string yAxis values
    if (this.selectedyAxis !== undefined && this.selectedyAxis !== null && 
        ((Array.isArray(this.selectedyAxis) && this.selectedyAxis.length > 0) || 
         (typeof this.selectedyAxis === 'string' && this.selectedyAxis !== ''))) {
      console.log("get y-axis", this.selectedyAxis);
      this.entryForm.patchValue({ yAxis: this.selectedyAxis });
    }
    
    // Get form data
    let formdata = this.entryForm.value;
    let num = id;
    console.log('Form data:', this.entryForm.value);
    
    // Update the dashboard collection with the new configuration
    this.dashboardCollection.dashboard = this.dashboardCollection.dashboard.map(item => {
      if (item.chartid == num) {
        // Preserve the component reference
        const componentRef = item.component;
        
        // Merge the existing item with the new form data
        const updatedItem = { ...item, ...formdata }
        
        // Restore the component reference
        updatedItem.component = componentRef;
        
        // Explicitly ensure drilldown properties are preserved
        updatedItem.drilldownEnabled = this.gadgetsEditdata.drilldownEnabled;
        updatedItem.drilldownApiUrl = this.gadgetsEditdata.drilldownApiUrl;
        updatedItem.drilldownXAxis = this.gadgetsEditdata.drilldownXAxis;
        updatedItem.drilldownYAxis = this.gadgetsEditdata.drilldownYAxis;
        updatedItem.drilldownParameter = this.gadgetsEditdata.drilldownParameter;
        updatedItem.baseFilters = this.gadgetsEditdata.baseFilters; // Add base filters
        updatedItem.drilldownFilters = this.gadgetsEditdata.drilldownFilters; // Add drilldown filters
        updatedItem.drilldownLayers = this.gadgetsEditdata.drilldownLayers;
        updatedItem.commonFilterEnabled = this.gadgetsEditdata.commonFilterEnabled; // Add common filter property
        updatedItem.commonFilterEnabledDrilldown = this.gadgetsEditdata.commonFilterEnabledDrilldown; // Add drilldown common filter property
        
        // For compact filter, preserve filter configuration properties
        if (item.name === 'Compact Filter') {
          updatedItem.filterKey = this.gadgetsEditdata.filterKey || '';
          updatedItem.filterType = this.gadgetsEditdata.filterType || 'text';
          updatedItem.filterLabel = this.gadgetsEditdata.filterLabel || '';
          // Convert filterOptionsString to array
          if (this.gadgetsEditdata.fieldName === 'Compact Filter') {
            updatedItem.filterOptions = this.filterOptionsString.split(',').map(opt => opt.trim()).filter(opt => opt);
          } else {
            updatedItem.filterOptions = this.gadgetsEditdata.filterOptions || [];
          }
          updatedItem.table = this.gadgetsEditdata.table || ''; // API URL
          updatedItem.connection = this.gadgetsEditdata.connection || undefined; // Connection ID
          
          // Also preserve these properties in gadgetsEditdata for consistency
          this.gadgetsEditdata.filterKey = updatedItem.filterKey;
          this.gadgetsEditdata.filterType = updatedItem.filterType;
          this.gadgetsEditdata.filterLabel = updatedItem.filterLabel;
          this.gadgetsEditdata.filterOptions = updatedItem.filterOptions;
        }
        
        console.log('Updated item:', updatedItem);
        return updatedItem;
      }
      return item
    });
    
    console.log('Updated dashboard collection:', this.dashboardCollection.dashboard);
    
    // Update the dashboardArray to reflect changes immediately
    // Create a new array with new object references to ensure change detection
    this.dashboardArray = this.dashboardCollection.dashboard.map(item => {
      // Preserve the component reference
      const componentRef = item.component;
      const newItem = { ...item };
      // Restore the component reference
      newItem.component = componentRef;
      // ye must print hona chahiye
      console.log('New dashboard item for rendering:', newItem);
      return newItem;
    });
    
    // Force gridster to refresh by triggering change detection
    if (this.options && this.options.api) {
      this.options.api.optionsChanged();
    }
    
    // Trigger change detection manually
    // This is a workaround to ensure the gridster re-renders the components
    setTimeout(() => {
      // Force a refresh by temporarily setting dashboardArray to empty and then back
      const tempArray = [...this.dashboardArray];
      this.dashboardArray = [];
      setTimeout(() => {
        this.dashboardArray = tempArray;
      }, 0);
    }, 0);
    
    // Note: We don't close the modal here, allowing the user to make additional changes
    // The user can click "Save" when they're done with all changes
    
    // Reset the filter service to ensure clean state
    this.filterService.resetFilters();
  }

  goBack() {
    this.router.navigate(["../../all"], { relativeTo: this.route })
  }

  onSchedule() {
    this.router.navigate(['../../schedule/' + this.editId], { relativeTo: this.route });
  }


  ///////
  storedata;
  getStores() {
    this.datastoreService.getAll().subscribe((data) => {
      console.log(data);
      this.storedata = data;
    }, (error) => {
      console.log(error);
    });
  }

  selectedStoreId;
  storename(val) {
    console.log(val);
    this.selectedStoreId = val;
    this.getTables(this.selectedStoreId);
  }

  TableData;
  getTables(id) {
    this.alertService.getTablefromstore(id).subscribe(gateway => {
      console.log(gateway);
      this.TableData = gateway;
    }, (error) => {
      console.log(error);
    });
  }

  callApi(val) {
    console.log(' api value ', val);
    this.getColumns(this.selectedStoreId, val);
  }
  selectedyAxis;
  columnData;

  getColumns(id, table) {
    const connectionId = this.gadgetsEditdata.connection ? parseInt(this.gadgetsEditdata.connection, 10) : undefined;
    this.alertService.getColumnfromurl(table, connectionId).subscribe(data => {
      console.log(' api data ', data);
      this.columnData = data;
    }, (error) => {
      console.log(error);
    });
  }

  // Add method to refresh drilldown columns
  refreshDrilldownColumns() {
    if (this.gadgetsEditdata.drilldownApiUrl) {
      const connectionId = this.gadgetsEditdata.connection ? parseInt(this.gadgetsEditdata.connection, 10) : undefined;
      this.alertService.getColumnfromurl(this.gadgetsEditdata.drilldownApiUrl, connectionId).subscribe(data => {
        console.log('Drilldown column data:', data);
        this.drilldownColumnData = data;
      }, (error) => {
        console.log('Error fetching drilldown columns:', error);
        this.drilldownColumnData = [];
      });
    }
  }

  // Add method to reset drilldown configuration
  resetDrilldownConfiguration() {
    this.gadgetsEditdata.drilldownApiUrl = '';
    // Removed drilldownParameterKey since we're using URL templates
    this.gadgetsEditdata.drilldownXAxis = '';
    this.gadgetsEditdata.drilldownYAxis = '';
    this.gadgetsEditdata.drilldownParameter = ''; // Reset drilldown parameter
    // Reset drilldown layers but preserve the array structure
    this.gadgetsEditdata.drilldownLayers = this.gadgetsEditdata.drilldownLayers.map(layer => ({
      ...layer,
      enabled: false,
      apiUrl: '',
      xAxis: '',
      yAxis: '',
      parameter: '' // Reset parameter property
    }));
    this.drilldownColumnData = [];
  }
  
  // Add method to add a new drilldown layer
  addDrilldownLayer() {
    const newLayer = {
      enabled: false,
      apiUrl: '',
      // Removed parameterKey since we're using URL templates
      xAxis: '',
      yAxis: '',
      parameter: '' // Add parameter property
    };
    this.gadgetsEditdata.drilldownLayers.push(newLayer);
  }
  
  // Add method to remove a drilldown layer
  removeDrilldownLayer(index: number) {
    this.gadgetsEditdata.drilldownLayers.splice(index, 1);
  }
  
  // Add method to refresh drilldown columns for a specific layer
  refreshDrilldownLayerColumns(layerIndex: number) {
    const layer = this.gadgetsEditdata.drilldownLayers[layerIndex];
    if (layer && layer.apiUrl) {
      const connectionId = this.gadgetsEditdata.connection ? parseInt(this.gadgetsEditdata.connection, 10) : undefined;
      this.alertService.getColumnfromurl(layer.apiUrl, connectionId).subscribe(data => {
        console.log(`Drilldown layer ${layerIndex} column data:`, data);
        // Store layer column data in a separate property
        if (!this.layerColumnData) {
          this.layerColumnData = {};
        }
        this.layerColumnData[layerIndex] = data;
      }, (error) => {
        console.log(`Error fetching drilldown layer ${layerIndex} columns:`, error);
        if (!this.layerColumnData) {
          this.layerColumnData = {};
        }
        this.layerColumnData[layerIndex] = [];
      });
    }
  }
  
  // Add method to refresh base drilldown columns
  refreshBaseDrilldownColumns() {
    if (this.gadgetsEditdata.drilldownApiUrl) {
      const connectionId = this.gadgetsEditdata.connection ? parseInt(this.gadgetsEditdata.connection, 10) : undefined;
      this.alertService.getColumnfromurl(this.gadgetsEditdata.drilldownApiUrl, connectionId).subscribe(data => {
        console.log('Base drilldown column data:', data);
        this.drilldownColumnData = data;
      }, (error) => {
        console.log('Error fetching base drilldown columns:', error);
        this.drilldownColumnData = [];
      });
    }
  }
  
  // Add method to build drilldown URL with template parameters using angle brackets
  buildDrilldownUrl(baseUrl: string, parameterValue: string): string {
    // If no base URL, return empty string
    if (!baseUrl) {
      return '';
    }
    
    // If no parameter value, return the base URL as-is
    if (!parameterValue) {
      return baseUrl;
    }
    
    // Check if the URL contains angle brackets for parameter replacement
    const hasAngleBrackets = /<[^>]+>/.test(baseUrl);
    
    if (hasAngleBrackets) {
      // Replace angle brackets placeholder with actual value
      // Example: http://localhost:9292/State_ListFilter1/State_ListFilter11/<country>
      // becomes: http://localhost:9292/State_ListFilter1/State_ListFilter11/india
      const encodedValue = encodeURIComponent(parameterValue);
      const urlWithReplacedParam = baseUrl.replace(/<[^>]+>/g, encodedValue);
      return urlWithReplacedParam;
    } else {
      // No angle brackets, return the base URL as-is
      // This handles normal API endpoints without parameter replacement
      return baseUrl;
    }
  }
  
  // Add method to get the parameter key from URL template using angle brackets
  getParameterKeyFromUrl(baseUrl: string): string {
    if (!baseUrl) {
      return '';
    }
    
    // Extract parameter key from angle brackets
    // Example: http://localhost:9292/State_ListFilter1/State_ListFilter11/<country>
    // returns: country
    const match = baseUrl.match(/<([^>]+)>/);
    return match ? match[1] : '';
  }
  
  // Add method to add a new filter field
  addFilterField() {
    // This method is no longer needed with the simplified approach
    // We're now using addBaseFilter and addLayerFilter methods instead
  }
  
  // Add method to remove a filter field
  removeFilterField(index: number) {
    // This method is no longer needed with the simplified approach
    // We're now using removeBaseFilter and removeLayerFilter methods instead
  }
  
  // Add method to handle base filter field change
  onBaseFilterFieldChange(index: number, field: string) {
    const filter = this.gadgetsEditdata.baseFilters[index];
    if (filter) {
      filter.field = field;
      // If field changes, reset value and options
      filter.value = '';
      filter.options = '';
      filter.availableValues = '';
      
      // If we have a field and table URL, load available values
      if (field && this.gadgetsEditdata.table) {
        this.loadFilterValuesForField(
          this.gadgetsEditdata.table, 
          this.gadgetsEditdata.connection, 
          field, 
          index, 
          'base'
        );
      }
    }
  }

  // Add method to handle base filter type change
  onBaseFilterTypeChange(index: number, type: string) {
    const filter = this.gadgetsEditdata.baseFilters[index];
    if (filter) {
      filter.type = type;
      // If type changes to dropdown/multiselect and we have a field, load available values
      if ((type === 'dropdown' || type === 'multiselect') && filter.field && this.gadgetsEditdata.table) {
        this.loadFilterValuesForField(
          this.gadgetsEditdata.table, 
          this.gadgetsEditdata.connection, 
          filter.field, 
          index, 
          'base'
        );
      }
    }
  }

  // Add method to handle drilldown filter field change
  onDrilldownFilterFieldChange(index: number, field: string) {
    const filter = this.gadgetsEditdata.drilldownFilters[index];
    if (filter) {
      filter.field = field;
      // If field changes, reset value and options
      filter.value = '';
      filter.options = '';
      filter.availableValues = '';
      
      // If we have a field and drilldown API URL, load available values
      if (field && this.gadgetsEditdata.drilldownApiUrl) {
        this.loadFilterValuesForField(
          this.gadgetsEditdata.drilldownApiUrl, 
          this.gadgetsEditdata.connection, 
          field, 
          index, 
          'drilldown'
        );
      }
    }
  }

  // Add method to handle drilldown filter type change
  onDrilldownFilterTypeChange(index: number, type: string) {
    const filter = this.gadgetsEditdata.drilldownFilters[index];
    if (filter) {
      filter.type = type;
      // If type changes to dropdown/multiselect and we have a field, load available values
      if ((type === 'dropdown' || type === 'multiselect') && filter.field && this.gadgetsEditdata.drilldownApiUrl) {
        this.loadFilterValuesForField(
          this.gadgetsEditdata.drilldownApiUrl, 
          this.gadgetsEditdata.connection, 
          filter.field, 
          index, 
          'drilldown'
        );
      }
    }
  }

  // Add method to handle layer filter field change
  onLayerFilterFieldChange(layerIndex: number, filterIndex: number, field: string) {
    const layer = this.gadgetsEditdata.drilldownLayers[layerIndex];
    if (layer && layer.filters) {
      const filter = layer.filters[filterIndex];
      if (filter) {
        filter.field = field;
        // If field changes, reset value and options
        filter.value = '';
        filter.options = '';
        filter.availableValues = '';
        
        // If we have a field and layer API URL, load available values
        if (field && layer.apiUrl) {
          this.loadFilterValuesForField(
            layer.apiUrl, 
            this.gadgetsEditdata.connection, 
            field, 
            filterIndex, 
            'layer',
            layerIndex
          );
        }
      }
    }
  }

  // Add method to handle layer filter type change
  onLayerFilterTypeChange(layerIndex: number, filterIndex: number, type: string) {
    const layer = this.gadgetsEditdata.drilldownLayers[layerIndex];
    if (layer && layer.filters) {
      const filter = layer.filters[filterIndex];
      if (filter) {
        filter.type = type;
        // If type changes to dropdown/multiselect and we have a field, load available values
        if ((type === 'dropdown' || type === 'multiselect') && filter.field && layer.apiUrl) {
          this.loadFilterValuesForField(
            layer.apiUrl, 
            this.gadgetsEditdata.connection, 
            filter.field, 
            filterIndex, 
            'layer',
            layerIndex
          );
        }
      }
    }
  }

  // Add method to load filter values for a specific field
  loadFilterValuesForField(
    apiUrl: string, 
    connectionId: string | undefined, 
    field: string, 
    filterIndex: number, 
    filterType: 'base' | 'drilldown' | 'layer',
    layerIndex?: number
  ) {
    if (apiUrl && field) {
      const connectionIdNum = connectionId ? parseInt(connectionId, 10) : undefined;
      this.alertService.getValuesFromUrl(apiUrl, connectionIdNum, field).subscribe(
        (values: string[]) => {
          // Update the filter with available values
          if (filterType === 'base') {
            const filter = this.gadgetsEditdata.baseFilters[filterIndex];
            if (filter) {
              filter.availableValues = values.join(', ');
              // For dropdown/multiselect types, also update the options
              if (filter.type === 'dropdown' || filter.type === 'multiselect') {
                filter.options = filter.availableValues;
              }
            }
          } else if (filterType === 'drilldown') {
            const filter = this.gadgetsEditdata.drilldownFilters[filterIndex];
            if (filter) {
              filter.availableValues = values.join(', ');
              // For dropdown/multiselect types, also update the options
              if (filter.type === 'dropdown' || filter.type === 'multiselect') {
                filter.options = filter.availableValues;
              }
            }
          } else if (filterType === 'layer' && layerIndex !== undefined) {
            const layer = this.gadgetsEditdata.drilldownLayers[layerIndex];
            if (layer && layer.filters) {
              const filter = layer.filters[filterIndex];
              if (filter) {
                filter.availableValues = values.join(', ');
                // For dropdown/multiselect types, also update the options
                if (filter.type === 'dropdown' || filter.type === 'multiselect') {
                  filter.options = filter.availableValues;
                }
              }
            }
          }
        },
        (error) => {
          console.error('Error loading available values for field:', field, error);
        }
      );
    }
  }

  // Add method to add a base filter with default properties
  addBaseFilter() {
    const newFilter = {
      field: '',
      value: '',
      type: 'text',
      options: '',
      availableValues: ''
    };
    this.gadgetsEditdata.baseFilters.push(newFilter);
  }

  // Add method to add a drilldown filter with default properties
  addDrilldownFilter() {
    const newFilter = {
      field: '',
      value: '',
      type: 'text',
      options: '',
      availableValues: ''
    };
    this.gadgetsEditdata.drilldownFilters.push(newFilter);
  }

  // Add method to add a layer filter with default properties
  addLayerFilter(layerIndex: number) {
    const newFilter = {
      field: '',
      value: '',
      type: 'text',
      options: '',
      availableValues: ''
    };
    if (!this.gadgetsEditdata.drilldownLayers[layerIndex].filters) {
      this.gadgetsEditdata.drilldownLayers[layerIndex].filters = [];
    }
    this.gadgetsEditdata.drilldownLayers[layerIndex].filters.push(newFilter);
  }
  
  // Add method to remove a base filter
  removeBaseFilter(index: number) {
    this.gadgetsEditdata.baseFilters.splice(index, 1);
  }
  
  // Add method to remove a drilldown filter
  removeDrilldownFilter(index: number) {
    this.gadgetsEditdata.drilldownFilters.splice(index, 1);
  }
  
  // Add method to remove a layer filter
  removeLayerFilter(layerIndex: number, filterIndex: number) {
    this.gadgetsEditdata.drilldownLayers[layerIndex].filters.splice(filterIndex, 1);
  }
  
  // Add method to open common filter modal
  openCommonFilterModal() {
    this.commonFilterModalOpen = true;
  }
  
  // Add method to add a common filter
  addCommonFilter() {
    const newFilter = {
      field: '',
      value: ''
    };
    this.commonFilterData.filters.push(newFilter);
  }
  
  // Add method to remove a common filter
  removeCommonFilter(index: number) {
    this.commonFilterData.filters.splice(index, 1);
  }
  
  // Add method to refresh common filter columns
  refreshCommonFilterColumns() {
    if (this.commonFilterData.apiUrl) {
      const connectionId = this.commonFilterData.connection ? parseInt(this.commonFilterData.connection, 10) : undefined;
      this.alertService.getColumnfromurl(this.commonFilterData.apiUrl, connectionId).subscribe(data => {
        console.log('Common filter column data:', data);
        this.commonFilterColumnData = data;
      }, (error) => {
        console.log('Error fetching common filter columns:', error);
        this.commonFilterColumnData = [];
      });
    }
  }
  
  // Add method to save common filter
  saveCommonFilter() {
    // Here we would typically make an API call to save the common filter
    // For now, we'll just close the modal
    console.log('Saving common filter:', this.commonFilterData);
    
    // Update all charts that have common filter enabled
    this.updateChartsWithCommonFilter();
    
    this.commonFilterModalOpen = false;
  }
  
  // Add method to update charts with common filter data
  updateChartsWithCommonFilter() {
    // This method will be called when common filter is saved
    // It will update all charts that have common filter enabled
    console.log('Updating charts with common filter data');
    
    // Update the dashboardArray to reflect changes
    this.dashboardArray = this.dashboardArray.map(item => {
      if (item.commonFilterEnabled) {
        // Preserve the component reference
        const componentRef = item.component;
        
        // Update the chart with common filter data
        const updatedItem = {
          ...item,
          table: this.commonFilterData.apiUrl,
          connection: this.commonFilterData.connection,
          baseFilters: [...this.commonFilterData.filters]
        };
        
        // Restore the component reference
        updatedItem.component = componentRef;
        
        return updatedItem;
      }
      return item;
    });
    
    // Also update the dashboardCollection to persist changes
    this.dashboardCollection.dashboard = this.dashboardCollection.dashboard.map(item => {
      if (item.commonFilterEnabled) {
        // Preserve the component reference
        const componentRef = item.component;
        
        // Update the chart with common filter data
        const updatedItem = {
          ...item,
          table: this.commonFilterData.apiUrl,
          connection: this.commonFilterData.connection,
          baseFilters: [...this.commonFilterData.filters]
        } as DashboardContentModel;
        
        // Restore the component reference
        updatedItem.component = componentRef;
        
        return updatedItem;
      }
      return item;
    });
  }
  
  // Add method to handle common filter toggle
  onCommonFilterToggle() {
    console.log('Common filter toggled:', this.gadgetsEditdata.commonFilterEnabled);
    
    if (this.gadgetsEditdata.commonFilterEnabled) {
      // When enabling common filter, save current values and apply common filter data
      this.gadgetsEditdata.table = this.commonFilterData.apiUrl;
      this.gadgetsEditdata.connection = this.commonFilterData.connection;
      this.gadgetsEditdata.baseFilters = [...this.commonFilterData.filters];
    }
    // When disabling, the user can edit the filters normally
  }
  
  // Add method to handle common filter toggle for base drilldown
  onCommonFilterToggleDrilldown() {
    console.log('Common filter drilldown toggled:', this.gadgetsEditdata.commonFilterEnabledDrilldown);
    
    if (this.gadgetsEditdata.commonFilterEnabledDrilldown) {
      // When enabling common filter, save current values and apply common filter data
      this.gadgetsEditdata.drilldownFilters = [...this.commonFilterData.filters];
    }
    // When disabling, the user can edit the filters normally
  }
  
  // Add method to handle common filter toggle for drilldown layers
  onCommonFilterToggleLayer(layerIndex: number) {
    const layer = this.gadgetsEditdata.drilldownLayers[layerIndex];
    if (layer) {
      console.log(`Common filter layer ${layerIndex} toggled:`, layer.commonFilterEnabled);
      
      if (layer.commonFilterEnabled) {
        // When enabling common filter, save current values and apply common filter data
        layer.filters = [...this.commonFilterData.filters];
      }
      // When disabling, the user can edit the filters normally
    }
  }
  
  // Add method to handle item resize events
  itemResize(item: any, itemComponent: any) {
    // console.log('Item resized:', item);
    // Trigger a window resize event to notify charts to resize
    window.dispatchEvent(new Event('resize'));
    
    // Also try to directly notify the chart component if possible
    if (itemComponent && itemComponent.item && itemComponent.item.component) {
      // If the resized item contains a chart, we could try to call its resize method directly
      // This would require the chart component to have a public resize method
    }
  }
  
  // Add method to load available keys for compact filter
  loadAvailableKeys(apiUrl: string, connectionId: string | undefined) {
    if (apiUrl) {
      const connectionIdNum = connectionId ? parseInt(connectionId, 10) : undefined;
      this.alertService.getColumnfromurl(apiUrl, connectionIdNum).subscribe(
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

  // Add method to load available values for a specific key
  loadAvailableValues(key: string) {
    if (key && this.gadgetsEditdata['table']) {
      const connectionIdNum = this.gadgetsEditdata['connection'] ? 
        parseInt(this.gadgetsEditdata['connection'], 10) : undefined;
      this.alertService.getValuesFromUrl(this.gadgetsEditdata['table'], connectionIdNum, key).subscribe(
        (values: string[]) => {
          // Update filter options string for dropdown/multiselect
          if (this.gadgetsEditdata['filterType'] === 'dropdown' || 
              this.gadgetsEditdata['filterType'] === 'multiselect') {
            this.filterOptionsString = values.join(', ');
            // Also update the gadgetsEditdata filterOptions array
            this.gadgetsEditdata['filterOptions'] = values;
          }
        },
        (error) => {
          console.error('Error loading available values:', error);
        }
      );
    }
  }

  // Add method to handle filter key change
  onFilterKeyChange(key: string) {
    this.gadgetsEditdata['filterKey'] = key;
    // Load available values when filter key changes
    if (key && (this.gadgetsEditdata['filterType'] === 'dropdown' || 
                this.gadgetsEditdata['filterType'] === 'multiselect')) {
      this.loadAvailableValues(key);
    }
  }

  // Add method to handle filter type change
  onFilterTypeChange(type: string) {
    this.gadgetsEditdata['filterType'] = type;
    // Load available values when filter type changes to dropdown or multiselect
    if ((type === 'dropdown' || type === 'multiselect') && this.gadgetsEditdata['filterKey']) {
      this.loadAvailableValues(this.gadgetsEditdata['filterKey']);
    }
  }

  // Add method to handle API URL change for compact filter
  onCompactFilterApiUrlChange(url: string) {
    this.gadgetsEditdata['table'] = url;
    // Load available keys when API URL changes
    if (url) {
      this.loadAvailableKeys(url, this.gadgetsEditdata['connection']);
    }
  }

  // Add method to handle connection change for compact filter
  onCompactFilterConnectionChange(connectionId: string) {
    this.gadgetsEditdata['connection'] = connectionId;
    // Reload available keys when connection changes
    if (this.gadgetsEditdata['table']) {
      this.loadAvailableKeys(this.gadgetsEditdata['table'], connectionId);
    }
  }

  // Add method to apply dynamic template to a chart
  applyDynamicTemplate(chartItem: any, template: any) {
    console.log('Applying dynamic template to chart:', chartItem, template);
    
    // Apply HTML template
    if (template.templateHtml) {
      // In a real implementation, you would dynamically render the HTML template
      // For now, we'll just log it
      console.log('HTML Template:', template.templateHtml);
    }
    
    // Apply CSS styles
    if (template.templateCss) {
      // In a real implementation, you would dynamically apply the CSS styles
      // For now, we'll just log it
      console.log('CSS Template:', template.templateCss);
    }
    
    // Return the chart item with template applied
    return {
      ...chartItem,
      template: template
    };
  }
  
  // Add method to test dynamic chart creation
  testDynamicChartCreation() {
    console.log('Testing dynamic chart creation');
    
    // Show a success message to the user
    alert('Dynamic chart test started. Check the browser console for detailed output.');
    
    // Load all chart types
    this.dynamicChartLoader.loadAllChartConfigurations().subscribe({
      next: (chartTypes) => {
        console.log('Loaded chart types:', chartTypes);
        
        // Find bar chart type
        const barChartType = chartTypes.find((ct: any) => ct.name === 'bar');
        if (barChartType) {
          console.log('Found bar chart type:', barChartType);
          
          // Load configuration for bar chart
          this.dynamicChartLoader.loadChartConfiguration(barChartType.id).subscribe({
            next: (config) => {
              console.log('Loaded bar chart configuration:', config);
              
              // Create a test chart item
              const chartItem = {
                cols: 5,
                rows: 6,
                x: 0,
                y: 0,
                chartid: 100,
                component: UnifiedChartComponent,
                name: 'Test Dynamic Bar Chart',
                chartType: 'bar',
                xAxis: '',
                yAxis: '',
                table: '',
                connection: undefined,
                // Add dynamic fields from configuration
                dynamicFields: config.dynamicFields || []
              };
              
              console.log('Created test chart item:', chartItem);
              
              // If we have templates, apply the default one
              if (config.templates && config.templates.length > 0) {
                const defaultTemplate = config.templates.find((t: any) => t.isDefault) || config.templates[0];
                if (defaultTemplate) {
                  console.log('Applying default template:', defaultTemplate);
                  const chartWithTemplate = this.applyDynamicTemplate(chartItem, defaultTemplate);
                  console.log('Chart with template:', chartWithTemplate);
                  
                  // Show success message
                  alert('Dynamic chart test completed successfully! Check console for details.');
                }
              } else {
                // Show success message even without templates
                alert('Dynamic chart test completed successfully! No templates found. Check console for details.');
              }
            },
            error: (error) => {
              console.error('Error loading bar chart configuration:', error);
              alert('Error loading bar chart configuration. Check console for details.');
            }
          });
        } else {
          console.warn('Bar chart type not found');
          alert('Bar chart type not found in the database.');
        }
      },
      error: (error) => {
        console.error('Error loading chart types:', error);
        alert('Error loading chart types. Check console for details.');
      }
    });
  }

  // Add method to load dynamic chart configuration
  loadDynamicChartConfiguration(chartTypeId: number) {
    console.log(`Loading dynamic chart configuration for chart type ${chartTypeId}`);
    this.dynamicChartLoader.loadChartConfiguration(chartTypeId).subscribe({
      next: (config) => {
        console.log('Loaded dynamic chart configuration:', config);
        // Here you would apply the configuration to the UI
        // For example, populate form fields, set up templates, etc.
      },
      error: (error) => {
        console.error('Error loading dynamic chart configuration:', error);
      }
    });
  }

  

  // Add method to create a dynamic chart with configuration from database
  createDynamicChart = (chartTypeName: string, maxChartId: number) => {
    console.log(`Creating dynamic chart of type: ${chartTypeName}`);
    
    // First, get the chart type by name
    this.dynamicChartLoader.getChartTypeByName(chartTypeName).subscribe({
      next: (chartType) => {
        if (chartType) {
          console.log(`Found chart type:`, chartType);
          
          // Load the complete configuration for this chart type
          this.dynamicChartLoader.loadChartConfiguration(chartType.id).subscribe({
            next: (config) => {
              console.log(`Loaded configuration for ${chartTypeName}:`, config);
              
              // Create the chart item with dynamic configuration
              const chartItem = {
                cols: 5,
                rows: 6,
                x: 0,
                y: 0,
                chartid: maxChartId + 1,
                component: UnifiedChartComponent,
                name: chartType.displayName || chartTypeName,
                chartType: chartType.name,
                xAxis: '',
                yAxis: '',
                table: '',
                connection: undefined,
                // Add any dynamic fields from the configuration
                dynamicFields: config.dynamicFields || []
              };
              
              // Add UI components as configuration properties
              if (config.uiComponents && config.uiComponents.length > 0) {
                config.uiComponents.forEach(component => {
                  chartItem[component.componentName] = '';
                });
              }
              
              this.dashboardArray.push(chartItem);
              console.log(`Created dynamic chart:`, chartItem);
              
              // Update the dashboard collection and trigger refresh
              this.itemChange();
            },
            error: (error) => {
              console.error(`Error loading configuration for ${chartTypeName}:`, error);
              // Fallback to default configuration
              this.createDefaultChart(chartTypeName, this.getChartDisplayName(chartTypeName));
            }
          });
        } else {
          console.warn(`Chart type ${chartTypeName} not found, using default configuration`);
          this.createDefaultChart(chartTypeName, this.getChartDisplayName(chartTypeName));
        }
      },
      error: (error) => {
        console.error('Error loading configuration for chart type:', error);
        // Fallback to default configuration
        this.createDefaultChart(chartTypeName, this.getChartDisplayName(chartTypeName));
      }
    });
  }
  
  // Fallback method to create default chart configuration
  createDefaultChart = (chartTypeName: string, chartDisplayName: string) => {
    console.log(`Creating default chart for ${chartTypeName}`);
    
    // Map chart type names to chart types - making it fully dynamic
    const chartTypeMap = {
      'bar': 'bar',
      'line': 'line',
      'pie': 'pie',
      'doughnut': 'doughnut',
      'radar': 'radar',
      'polar': 'polar',
      'bubble': 'bubble',
      'scatter': 'scatter'
      // Removed hardcoded heatmap entry to make it fully dynamic
    };
    
    // Get the chart type from the name - default to bubble for unknown chart types
    const chartType = chartTypeMap[chartTypeName.toLowerCase()] || 'bubble';
    
    // Safely calculate maxChartId, handling cases where chartid might be NaN or missing
    let maxChartId = 0;
    if (this.dashboardArray && this.dashboardArray.length > 0) {
      const validChartIds = this.dashboardArray
        .map(item => item.chartid)
        .filter(chartid => typeof chartid === 'number' && !isNaN(chartid));
      
      if (validChartIds.length > 0) {
        maxChartId = Math.max(...validChartIds);
      }
    }
    
    const chartItem = {
      cols: 5,
      rows: 6,
      x: 0,
      y: 0,
      chartid: maxChartId + 1,
      component: UnifiedChartComponent,
      name: chartDisplayName,
      chartType: chartType,
      xAxis: '',
      yAxis: '',
      table: '',
      connection: undefined
    };
    
    this.dashboardArray.push(chartItem);
    console.log('Created default chart:', chartItem);
    
    // Update the dashboard collection and trigger refresh
    this.itemChange();
  }

  // Helper method to get display name for chart type - making it fully dynamic
  getChartDisplayName = (chartTypeName: string): string => {
    const displayNameMap = {
      'bar': 'Bar Chart',
      'line': 'Line Chart',
      'pie': 'Pie Chart',
      'doughnut': 'Doughnut Chart',
      'radar': 'Radar Chart',
      'polar': 'Polar Area Chart',
      'bubble': 'Bubble Chart',
      'scatter': 'Scatter Chart'
      // Removed hardcoded heatmap entry to make it fully dynamic
    };
    
    // For unknown chart types, create a display name by capitalizing the first letter and adding ' Chart'
    const displayName = displayNameMap[chartTypeName.toLowerCase()];
    if (displayName) {
      return displayName;
    } else {
      // Capitalize first letter and add ' Chart'
      return chartTypeName.charAt(0).toUpperCase() + chartTypeName.slice(1) + ' Chart';
    }
  }

}
