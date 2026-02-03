import { Component, Input, OnInit, OnDestroy, ComponentRef, ViewChild, ViewContainerRef, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
import { FilterService } from './filter.service';

@Component({
  selector: 'app-chart-wrapper',
  template: `
    <div class="chart-wrapper">
      <div class="chart-header" *ngIf="chartTitle">
        <h5>{{ chartTitle }}</h5>
      </div>
      <div class="chart-container">
        <ng-container #chartContainer></ng-container>
      </div>
    </div>
  `,
  styleUrls: ['./chart-wrapper.component.scss']
})
export class ChartWrapperComponent implements OnInit, OnDestroy {
  @Input() chartComponent: any;
  @Input() chartInputs: any = {};
  @Input() chartTitle: string = '';

  @ViewChild('chartContainer', { read: ViewContainerRef }) chartContainer!: ViewContainerRef;

  private componentRef: ComponentRef<any> | null = null;
  private filterSubscription: Subscription | null = null;

  constructor(private filterService: FilterService) { }

  ngOnInit(): void {
    this.loadChartComponent();
    this.subscribeToFilters();
  }

  ngOnDestroy(): void {
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }
  
  // Handle window resize events
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    // Notify the chart component to resize if it has a resize method
    if (this.componentRef && this.componentRef.instance) {
      const chartInstance = this.componentRef.instance;
      
      // If it's a chart component with an onResize method, call it
      if (chartInstance.onResize && typeof chartInstance.onResize === 'function') {
        chartInstance.onResize();
      }
      
      // If it's a chart component with a chart property (from BaseChartDirective), resize it
      if (chartInstance.chart && typeof chartInstance.chart.resize === 'function') {
        setTimeout(() => {
          chartInstance.chart.resize();
        }, 100);
      }
    }
  }

  private loadChartComponent(): void {
    if (this.chartContainer && this.chartComponent) {
      this.chartContainer.clear();
      const factory = this.chartContainer.createComponent(this.chartComponent);
      this.componentRef = factory;
      
      // Set initial inputs
      Object.keys(this.chartInputs).forEach(key => {
        factory.instance[key] = this.chartInputs[key];
      });
    }
  }

  private subscribeToFilters(): void {
    this.filterSubscription = this.filterService.filterState$.subscribe(filterValues => {
      this.updateChartWithFilters(filterValues);
    });
  }

  private updateChartWithFilters(filterValues: any): void {
    if (this.componentRef) {
      // Add filter values to chart inputs
      const updatedInputs = {
        ...this.chartInputs,
        filterValues: filterValues,
        // Pass the query params string for easy API integration
        filterQueryParams: this.filterService.buildQueryParams()
      };

      // Update chart component inputs
      Object.keys(updatedInputs).forEach(key => {
        this.componentRef!.instance[key] = updatedInputs[key];
      });

      // Trigger change detection if the component has a method for it
      if (this.componentRef!.instance.ngOnChanges) {
        // We can't easily trigger ngOnChanges manually, but the input update should trigger it
      }
      
      // If the chart component has a method to refresh data, call it
      if (this.componentRef!.instance.refreshData) {
        this.componentRef!.instance.refreshData();
      }
    }
  }
}