import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiRequestService } from '../api/api-request.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private getAllURL = 'get_module_id';
	private addDataURl = 'Savedata';
	private deleteFieldURL = 'delete_by_header_id';
	private getbyidURL = 'get_dashboard_headerbyid';
	private editURL = 'update_Dashbord1_Line';
  private updateURL = 'update_Dashbord1_Lineby_id';
  constructor(private _http: HttpClient,
    private apiRequest: ApiRequestService,)
   { 

   }

    getAllDash(): Observable<any> {
      // create Request URL params
      return this.apiRequest.get(`get_Dashboard_header`);
      }
    
    getAllByModuleId(module_id: number,page?: number, size?: number): Observable<any> {
      // create Request URL params
      let me = this;
      let params: HttpParams = new HttpParams();
      params = params.append("page", typeof page === "number" ? page.toString() : "0");
      params = params.append("size", typeof size === "number" ? size.toString() : "1000");
      params = params.append("module_id", module_id.toString());
      // get all
      return this.apiRequest.get(this.getAllURL, params);
      }

      create(data:any): Observable<any> {
      return this.apiRequest.post(this.addDataURl, data);
      }

      deleteField(id:number){
        let _http = this.deleteFieldURL + "/" + id;
          return this.apiRequest.delete(_http);
      }

      getById(id:number)
      {
        let _http = this.getbyidURL + "/" + id;
        return this.apiRequest.get(_http);
      }

      addToDB(line:any):Observable<any>
      {
       return this.apiRequest.put(this.editURL,line);
      }
      UpdateLineData(id:number, line:any)
      {
      // line = {
      //         headers: new HttpHeaders({
      //           'Content-Type': 'application/json'
      //         })
      //     };
      let _http = this.updateURL + "/" + id;
       return this.apiRequest.put(_http,line);
      }
getcount(moduleId: number):Observable<any>{
  return this.apiRequest.get(`get_dashboard/${moduleId}`);
}

updateDash(dashboardHeader: any): Observable<any> {
  return this.apiRequest.put('update_dashboard_header', dashboardHeader);
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

private toggleSubject = new BehaviorSubject<boolean>(false);

// Observable to subscribe to toggle changes
toggle$ = this.toggleSubject.asObservable();

// Function to update the toggle value
updateToggle(value: boolean) {
  this.toggleSubject.next(value);
}

private originalData: any[] = []; // Your original data goes here
private filteredDataSubject = new BehaviorSubject<any[]>([]);
filteredData$: Observable<any[]> = this.filteredDataSubject.asObservable();



}
