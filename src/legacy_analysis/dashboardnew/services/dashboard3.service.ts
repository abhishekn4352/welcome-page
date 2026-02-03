import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ApiRequestService } from "src/app/services/api/api-request.service";
import baseUrl from '../api/helper';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class Dashboard3Service {
  getAdditionalChartData() {
    throw new Error('Method not implemented.');
  }
  private getAllURL = 'get_module_id';
  private addDataURl = 'Savedata';
  private deleteFieldURL = 'delete_by_header_id';
  private getbyidURL = 'get_dashboard_headerbyid';
  private editURL = 'update_Dashbord1_Line';
  private updateURL = 'update_Dashbord1_Lineby_id';
  constructor(private _http: HttpClient,
    private apiRequest: ApiRequestService) { }
  getAll(module_id: number, page?: number, size?: number): Observable<any> {
    // create Request URL params
    let me = this;
    let params: HttpParams = new HttpParams();
    params = params.append("page", typeof page === "number" ? page.toString() : "0");
    params = params.append("size", typeof size === "number" ? size.toString() : "1000");
    params = params.append("module_id", module_id.toString());
    // get all
    return this.apiRequest.get(this.getAllURL, params);
  }

  create(data: any): Observable<any> {
    return this.apiRequest.post(this.addDataURl, data);
  }

  deleteField(id: number) {
    let _http = this.deleteFieldURL + "/" + id;
    return this.apiRequest.delete(_http);
  }

  getById(id: number) {
    let _http = this.getbyidURL + "/" + id;
    return this.apiRequest.get(_http);
  }

  addToDB(line: any): Observable<any> {
    return this.apiRequest.put(this.editURL, line);
  }
  UpdateLineData(id: number, line: any) {
    // line = {
    //         headers: new HttpHeaders({
    //           'Content-Type': 'application/json'
    //         })
    //     };
    let _http = this.updateURL + "/" + id;
    return this.apiRequest.put(_http, line);
  }
  getcount(moduleId: number): Observable<any> {
    return this.apiRequest.get(`get_dashboard/${moduleId}`);
  }

  updateDash(dashboardHeader: any): Observable<any> {
    return this.apiRequest.put('update_dashboard_header', dashboardHeader);
  }
  /////////////////////////////////////////////////////////////////////
  resetConditions() {
    this.ids = []; // Reset the ids array to an empty array
    this.numberIds = [];
    this.passwordIds = [];
    this.textareaIds = [];
    this.dateIds = [];
    this.datetimeIds = [];
    this.emailIds = [];
    this.selectIds = [];
    this.radioIds = [];
    this.checkboxIds = [];
    this.fileuloadIds = [];
    this.urlIds = [];
    this.decimalIds = [];
    this.percentageIds = [];
    this.buttonIds = [];
  }

  //////////// Text
  ids: any[] = [];
  setCondition(condition: any) {
    this.ids.push(condition);
  }

  getConditions(): any[] {
    return this.ids;
  }


  ////////// Number
  numberIds: any[] = [];
  setnumber(id: any) {
    this.numberIds.push(id);
  }

  getnumber(): any[] {
    return this.numberIds;
  }
  ////////////// password
  passwordIds: any[] = [];
  setpassword(id: any) {
    this.passwordIds.push(id);
  }

  getpassword(): any[] {
    return this.passwordIds;
  }

  ////////////// Textarea
  textareaIds: any[] = [];
  setTextarea(id: any) {
    this.textareaIds.push(id);
  }

  getTextarea(): any[] {
    return this.textareaIds;
  }

  ////////////// Date
  dateIds: any[] = [];
  setDate(id: any) {
    this.dateIds.push(id);
  }

  getDate(): any[] {
    return this.dateIds;
  }

  ////////////// Datetime
  datetimeIds: any[] = [];
  setDatetime(id: any) {
    this.datetimeIds.push(id);
  }

  getDatetime(): any[] {
    return this.datetimeIds;
  }

  ////////////// Email
  emailIds: any[] = [];
  setEmail(id: any) {
    this.emailIds.push(id);
  }

  getEmail(): any[] {
    return this.emailIds;
  }

  ////////////// Select
  selectIds: any[] = [];
  setSelect(id: any) {
    this.selectIds.push(id);
  }

  getSelect(): any[] {
    return this.selectIds;
  }

  ////////////// Radio
  radioIds: any[] = [];
  setRadio(id: any) {
    this.radioIds.push(id);
  }

  getRadio(): any[] {
    return this.radioIds;
  }

  ////////////// Checkbox
  checkboxIds: any[] = [];
  setCheckbox(id: any) {
    this.checkboxIds.push(id);
  }

  getCheckbox(): any[] {
    return this.checkboxIds;
  }

  ////////////// fileupload
  fileuloadIds: any[] = [];
  setFileUpload(id: any) {
    this.fileuloadIds.push(id);
  }

  getFileupload(): any[] {
    return this.fileuloadIds;
  }

  ////////////// Url
  urlIds: any[] = [];
  setUrl(id: any) {
    this.urlIds.push(id);
  }

  getUrl(): any[] {
    return this.urlIds;
  }
  ////////////// Decimal
  decimalIds: any[] = [];
  setDecimal(id: any) {
    this.decimalIds.push(id);
  }

  getDecimal(): any[] {
    return this.decimalIds;
  }
  ////////////// Percentage
  percentageIds: any[] = [];
  setPercentage(id: any) {
    this.percentageIds.push(id);
  }

  getPercentage(): any[] {
    return this.percentageIds;
  }
  ////////////// Button
  buttonIds: any[] = [];
  setButton(id: any) {
    this.buttonIds.push(id);
  }

  getButton(): any[] {
    return this.buttonIds;
  }









  getAllDash(): Observable<any> {
    // create Request URL params
    return this.apiRequest.get(`get_Dashboard_header`);
  }

  getAllByModuleId(module_id: number, page?: number, size?: number): Observable<any> {
    // create Request URL params
    let me = this;
    let params: HttpParams = new HttpParams();
    params = params.append("page", typeof page === "number" ? page.toString() : "0");
    params = params.append("size", typeof size === "number" ? size.toString() : "1000");
    params = params.append("module_id", module_id.toString());
    // get all
    return this.apiRequest.get(this.getAllURL, params);
  }

  ///////schedule
  public saveData(data: any): Observable<any> {
    return this.apiRequest.post(`DashboardSchedule/DashboardSchedule`, data);
  }

  public getDetails(): Observable<any> {
    return this.apiRequest.get(`DashboardSchedule/DashboardSchedule`);
  }

  public getDetailsById(id: number): Observable<any> {
    return this.apiRequest.get(`DashboardSchedule/DashboardSchedule/${id}`);
  }

  public deleteById(id: number): Observable<any> {
    return this.apiRequest.delete(`DashboardSchedule/DashboardSchedule/${id}`);
  }

  public updateData(data: any, id: number): Observable<any> {
    return this.apiRequest.put(`DashboardSchedule/DashboardSchedule/${id}`, data);
  }

  ////////////////////////////////////////////////////////////////////////////


  public getDynamicDashDetails(): Observable<any> {
    return this.apiRequest.get(`Dashboard/Dashboard`);
  }

  public getChartData(tableName: string, jobType: string, xAxis?: any, yAxes?: any, sureId?: number, parameter?: string, parameterValue?: string, filters?: string): Observable<any> {
    let url = `${baseUrl}/chart/getdashjson/${jobType}?tableName=${tableName}&xAxis=${xAxis}&yAxes=${yAxes}`;
    if (sureId) {
      url += `&sureId=${sureId}`;
    }
    if (parameter) {
      url += `&parameter=${encodeURIComponent(parameter)}`;
    }
    if (parameterValue) {
      url += `&parameterValue=${encodeURIComponent(parameterValue)}`;
    }
    
    console.log('=== DASHBOARD SERVICE DEBUG INFO ===');
    console.log('Base URL:', url);
    console.log('Filters parameter:', filters);

    // Parse filters JSON and add as a single "filters" parameter
    if (filters) {
      try {
        const filterObj = JSON.parse(filters);
        console.log('Parsed filter object:', filterObj);
        
        // Add all filters as a single "filters" parameter with JSON object
        url += `&filters=${encodeURIComponent(JSON.stringify(filterObj))}`;
        console.log('Added filters parameter:', JSON.stringify(filterObj));
      } catch (e) {
        console.warn('Failed to parse filter parameters:', e);
      }
    }

    console.log('Final constructed URL:', url);
    console.log('=== END DASHBOARD SERVICE DEBUG ===');
    return this._http.get(url);
  }

  public getUrlChartData(tableName: string, jobType: string, xAxis: any, yAxes: any, store: any, chartUrl: any, sureId?: number): Observable<any> {
    let url = `${baseUrl}/chart/getdashjson/${jobType}?tableName=${tableName}&url=${chartUrl}&xAxis=${xAxis}&yAxes=${yAxes}&datastore_name=${store}`;
    if (sureId) {
      url += `&sureId=${sureId}`;
    }
    return this._http.get(url);
  }

  featchDynamicUrlDetails(url): Observable<any> {
    return this._http.get(`${url}`);
  }


  private filteredDataSubject = new BehaviorSubject<any[]>([]);
  filteredData$ = this.filteredDataSubject.asObservable();

  updateFilteredData(filteredData: any[]) {
    this.filteredDataSubject.next(filteredData);
  }
}
