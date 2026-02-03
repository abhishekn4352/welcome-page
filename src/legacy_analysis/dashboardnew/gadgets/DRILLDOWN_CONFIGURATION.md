# Drilldown Configuration Implementation

## Overview
This document describes the drilldown configuration implementation applied to all chart components in the dashboard system. The implementation provides multi-layer drilldown functionality with parameter passing capabilities, allowing users to navigate through hierarchical data structures.

## Components with Drilldown Support

The following chart components have drilldown functionality implemented:

1. Bar Chart (`bar-chart`)
2. Line Chart (`line-chart`)
3. Pie Chart (`pie-chart`)
4. Bubble Chart (`bubble-chart`)
5. Doughnut Chart (`doughnut-chart`)
6. Polar Chart (`polar-chart`)
7. Radar Chart (`radar-chart`)
8. Scatter Chart (`scatter-chart`)
9. Financial Chart (`financial-chart`)
10. Dynamic Chart (`dynamic-chart`)

## Drilldown Configuration Properties

Each chart component includes the following drilldown configuration inputs:

```typescript
// Drilldown configuration inputs
@Input() drilldownEnabled: boolean = false;
@Input() drilldownApiUrl: string;
@Input() drilldownXAxis: string;
@Input() drilldownYAxis: string;
@Input() drilldownParameter: string;

// Multi-layer drilldown configuration inputs
@Input() drilldownLayers: any[] = [];
```

## Implementation Details

### 1. State Management

Each component maintains drilldown state through the following properties:

```typescript
// Multi-layer drilldown state tracking
drilldownStack: any[] = []; // Stack to track drilldown navigation history
currentDrilldownLevel: number = 0; // Current drilldown level (0 = base level)

// Original data storage for navigation
originalChartLabels: string[] = []; // Stores original labels
originalChartData: any[] = []; // Stores original data
```

### 2. Core Methods

#### fetchDrilldownData()
Fetches data for the current drilldown level based on configuration:

```typescript
fetchDrilldownData(): void {
  // Determine drilldown configuration based on current level
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
    const layerIndex = this.currentDrilldownLevel - 2;
    if (layerIndex >= 0 && layerIndex < this.drilldownLayers.length) {
      drilldownConfig = this.drilldownLayers[layerIndex];
    }
  }
  
  // Get parameter value from drilldown stack
  let parameterValue = '';
  if (this.drilldownStack.length > 0) {
    const lastEntry = this.drilldownStack[this.drilldownStack.length - 1];
    parameterValue = lastEntry.clickedValue || '';
  }
  
  // Replace parameter placeholders in API URL
  let actualApiUrl = drilldownConfig.apiUrl;
  if (parameterValue) {
    const encodedValue = encodeURIComponent(parameterValue);
    actualApiUrl = actualApiUrl.replace(/<[^>]+>/g, encodedValue);
  }
  
  // Fetch data from service
  this.dashboardService.getChartData(
    actualApiUrl, 
    chartType, 
    drilldownConfig.xAxis, 
    drilldownConfig.yAxis, 
    this.connection, 
    drilldownConfig.parameter, 
    parameterValue
  ).subscribe(...);
}
```

#### chartClicked()
Handles chart click events to initiate drilldown navigation:

```typescript
public chartClicked(e: any): void {
  // Check if drilldown is enabled and we have a valid click event
  if (this.drilldownEnabled && e.active && e.active.length > 0) {
    // Get clicked element details
    const clickedIndex = e.active[0].index;
    const clickedLabel = this.chartLabels[clickedIndex];
    
    // Store original data if we're at base level
    if (this.currentDrilldownLevel === 0) {
      this.originalChartLabels = [...this.chartLabels];
      this.originalChartData = [...this.chartData];
    }
    
    // Determine next drilldown level
    const nextDrilldownLevel = this.currentDrilldownLevel + 1;
    
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
      const layerIndex = nextDrilldownLevel - 2;
      if (layerIndex < this.drilldownLayers.length) {
        drilldownConfig = this.drilldownLayers[layerIndex];
        hasDrilldownConfig = drilldownConfig.enabled &&
                            !!drilldownConfig.apiUrl && 
                            !!drilldownConfig.xAxis && 
                            !!drilldownConfig.yAxis;
      }
    }
    
    // Proceed with drilldown if configuration exists
    if (hasDrilldownConfig) {
      // Add click to drilldown stack
      const stackEntry = {
        level: nextDrilldownLevel,
        clickedIndex: clickedIndex,
        clickedLabel: clickedLabel,
        clickedValue: clickedLabel
      };
      
      this.drilldownStack.push(stackEntry);
      this.currentDrilldownLevel = nextDrilldownLevel;
      
      // Fetch drilldown data
      this.fetchDrilldownData();
    }
  }
}
```

#### navigateBack()
Navigates back to the previous drilldown level:

```typescript
navigateBack(): void {
  if (this.drilldownStack.length > 0) {
    // Remove last entry from stack
    this.drilldownStack.pop();
    this.currentDrilldownLevel = this.drilldownStack.length;
    
    if (this.drilldownStack.length > 0) {
      // Fetch data for previous level
      this.fetchDrilldownData();
    } else {
      // Back to base level
      this.resetToOriginalData();
    }
  } else {
    // Already at base level
    this.resetToOriginalData();
  }
}
```

#### resetToOriginalData()
Resets the chart to its original data:

```typescript
resetToOriginalData(): void {
  this.currentDrilldownLevel = 0;
  this.drilldownStack = [];
  
  if (this.originalChartLabels.length > 0) {
    this.chartLabels = [...this.originalChartLabels];
  }
  if (this.originalChartData.length > 0) {
    this.chartData = [...this.originalChartData];
  }
  
  // Re-fetch original data
  this.fetchChartData();
}
```

## Multi-Layer Drilldown Support

The implementation supports multiple drilldown layers through the `drilldownLayers` array. Each layer can have its own configuration:

```typescript
drilldownLayers: [
  {
    enabled: true,
    apiUrl: "second-level-endpoint/<parameter>",
    xAxis: "column1",
    yAxis: "column2",
    parameter: "selectedColumn"
  },
  {
    enabled: true,
    apiUrl: "third-level-endpoint/<parameter>",
    xAxis: "column3",
    yAxis: "column4",
    parameter: "selectedColumn"
  }
]
```

## Parameter Passing

The drilldown implementation supports parameter passing by replacing placeholders in the API URL:

1. URL templates use angle brackets for parameter placeholders: `endpoint/<parameter>`
2. When navigating, the clicked value replaces the placeholder
3. Parameters are properly encoded using `encodeURIComponent`

## Data Flow

1. **Initial Load**: Chart loads with base data using `fetchChartData()`
2. **Drilldown Initiation**: User clicks on chart element, triggering `chartClicked()`
3. **Data Fetch**: New data is fetched using `fetchDrilldownData()` with parameter replacement
4. **Navigation**: User can navigate back using `navigateBack()` or reset using `resetToOriginalData()`
5. **State Management**: All navigation is tracked in `drilldownStack` with level management

## Error Handling

The implementation includes error handling for:

1. Missing drilldown configuration
2. API call failures
3. Invalid data structures
4. Null responses from backend

In case of errors, the chart maintains its current data and displays appropriate warnings in the console.

## UI Integration

Components with drilldown support should include UI elements for:

1. **Back Button**: To navigate to previous drilldown level
2. **Reset Button**: To return to original data
3. **Navigation Indicators**: To show current drilldown level

Example HTML structure:

```html
<div *ngIf="drilldownEnabled && currentDrilldownLevel > 0" class="drilldown-controls">
  <button (click)="navigateBack()" class="btn btn-secondary">
    ← Back to Level {{ currentDrilldownLevel - 1 }}
  </button>
  <button (click)="resetToOriginalData()" class="btn btn-outline">
    ↺ Reset to Original
  </button>
</div>
```