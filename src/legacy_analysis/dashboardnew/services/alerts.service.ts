import { Injectable } from '@angular/core';
import { ApiRequestService } from '../api/api-request.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  constructor(private http: HttpClient,private apiRequest: ApiRequestService) {}

  public saveData(data: any): Observable<any> {
    return this.apiRequest.post(`Alerts/Alerts`, data);
  }

  public getDetails(): Observable<any> {
    return this.apiRequest.get(`Alerts/Alerts`);
  }

  public getDetailsById(id: number): Observable<any> {
    return this.apiRequest.get(`Alerts/Alerts/${id}`);
  }

  public deleteById(id: number): Observable<any> {
    return this.apiRequest.delete(`Alerts/Alerts/${id}`);
  }

  public updateData(data: any, id: number): Observable<any> {
    return this.apiRequest.put(`Alerts/Alerts/${id}`, data);
  }


  ////////// ALert Rules
  public saveRuleData(data: any): Observable<any> {
    return this.apiRequest.post(`AlertRules/AlertRules`, data);
  }

  public getRuleDetails(): Observable<any> {
    return this.apiRequest.get(`AlertRules/AlertRules`);
  }

  public getRuleDetailsById(id: number): Observable<any> {
    return this.apiRequest.get(`AlertRules/AlertRules/${id}`);
  }

  public deleteRuleById(id: number): Observable<any> {
    return this.apiRequest.delete(`AlertRules/AlertRules/${id}`);
  }

  public updateRuleData(data: any, id: number): Observable<any> {
    return this.apiRequest.put(`AlertRules/AlertRules/${id}`, data);
  }

  ///get table form store
    public getTablefromstore(id: number): Observable<any> {
    return this.apiRequest.get(`AlertRules/tablelist/${id}`);
  }

    ///get column form store
    public getColumnfromstore(id: number, tableName:string): Observable<any> {
      return this.apiRequest.get(`AlertRules/columnlist/${id}/${tableName}`);
    }

    public getColumnfromurl(url: any, sureId?: number): Observable<any> {
      let apiUrl = `chart/getAllKeys?apiUrl=${url}`;
      if (sureId) {
        apiUrl += `&sureId=${sureId}`;
      }
      return this.apiRequest.get(apiUrl);
    }
    
    // Get values for a specific key from API
    public getValuesFromUrl(url: string, sureId: number | undefined, key: string): Observable<any> {
      let apiUrl = `chart/getValue?apiUrl=${url}&key=${key}`;
      if (sureId) {
        apiUrl += `&sureId=${sureId}`;
      }
      return this.apiRequest.get(apiUrl);
    }
}