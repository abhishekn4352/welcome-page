import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiRequestService } from 'src/app/services/api/api-request.service';
import { ChartType, UiComponent, ComponentProperty, ChartTemplate, DynamicField } from './chart-config-manager.component';

@Injectable({
  providedIn: 'root'
})
export class DynamicChartLoaderService {
  private chartTypesUrl = 'api/chart-types';
  private uiComponentsUrl = 'api/ui-components';
  private componentPropertiesUrl = 'api/component-properties';
  private chartTemplatesUrl = 'api/chart-templates';
  private dynamicFieldsUrl = 'api/dynamic-fields';

  constructor(private apiRequest: ApiRequestService) { }

  /**
   * Load all chart configurations dynamically
   * This method fetches all chart types and their associated components, templates, and fields
   */
  loadAllChartConfigurations(): Observable<any> {
    console.log('Loading all chart configurations dynamically');

    // Load all chart types first
    return this.apiRequest.get(this.chartTypesUrl).pipe(
      map(chartTypes => {
        console.log('Loaded chart types:', chartTypes);
        return chartTypes;
      })
    );
  }

  /**
   * Load complete configuration for a specific chart type
   * This includes UI components, templates, and dynamic fields
   */
  loadChartConfiguration(chartTypeId: number): Observable<{
    chartType: ChartType,
    uiComponents: UiComponent[],
    templates: ChartTemplate[],
    dynamicFields: DynamicField[]
  }> {
    console.log(`Loading complete configuration for chart type ${chartTypeId}`);

    // Load all related data in parallel
    return forkJoin({
      chartType: this.apiRequest.get(`${this.chartTypesUrl}/${chartTypeId}`),
      uiComponents: this.apiRequest.get(`${this.uiComponentsUrl}/chart-type/${chartTypeId}`),
      templates: this.apiRequest.get(`${this.chartTemplatesUrl}/chart-type/${chartTypeId}`),
      dynamicFields: this.apiRequest.get(`${this.dynamicFieldsUrl}/chart-type/${chartTypeId}`)
    }).pipe(
      map(result => {
        console.log(`Loaded complete configuration for chart type ${chartTypeId}:`, result);
        return result;
      })
    );
  }

  /**
   * Load chart template for a specific chart type
   * This is used to render the chart UI dynamically
   */
  loadChartTemplate(chartTypeId: number): Observable<ChartTemplate[]> {
    console.log(`Loading chart templates for chart type ${chartTypeId}`);
    return this.apiRequest.get(`${this.chartTemplatesUrl}/chart-type/${chartTypeId}`);
  }

  /**
   * Load UI components for a specific chart type
   * These define what configuration fields are needed for the chart
   */
  loadUiComponents(chartTypeId: number): Observable<UiComponent[]> {
    console.log(`Loading UI components for chart type ${chartTypeId}`);
    return this.apiRequest.get(`${this.uiComponentsUrl}/chart-type/${chartTypeId}`);
  }

  /**
   * Load dynamic fields for a specific chart type
   * These define additional dynamic fields that can be used in the chart
   */
  loadDynamicFields(chartTypeId: number): Observable<DynamicField[]> {
    console.log(`Loading dynamic fields for chart type ${chartTypeId}`);
    return this.apiRequest.get(`${this.dynamicFieldsUrl}/chart-type/${chartTypeId}`);
  }

  /**
   * Get chart type by name
   * This is useful for finding a chart type by its name rather than ID
   */
  // getChartTypeByName(name: string): Observable<ChartType | null> {
  //   console.log(`Finding chart type by name: ${name}`);
  //   return this.apiRequest.get(`${this.chartTypesUrl}/byname?chartName=${name}`).pipe(
  //     map((chartTypes: ChartType[]) => {
  //       console.log('Available chart types:', chartTypes);
  //       const chartType = chartTypes.find(ct => ct.name === name);
  //       console.log(`Found chart type for name ${name}:`, chartType);
  //       return chartType || null;
  //     })
  //   );
  // }

  getChartTypeByName(name: string): Observable<any> {
    console.log(`Finding chart type by name: ${name}`);
    return this.apiRequest.get(`${this.chartTypesUrl}/byname?chartName=${name}`);
  }



  /**
   * Load all active chart types
   * This is used to populate the chart selection in the dashboard editor
   */
  loadActiveChartTypes(): Observable<ChartType[]> {
    console.log('Loading active chart types');
    return this.apiRequest.get(`${this.chartTypesUrl}`).pipe(
      map((chartTypes: ChartType[]) => {
        const activeChartTypes = chartTypes.filter(ct => ct.isActive);
        console.log('Loaded active chart types:', activeChartTypes);
        return activeChartTypes;
      })
    );
  }
}