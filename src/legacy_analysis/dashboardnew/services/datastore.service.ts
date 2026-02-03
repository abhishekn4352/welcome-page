import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import baseUrl from 'src/app/services/api/helper';
import { ApiRequestService } from '../api/api-request.service';
@Injectable({
  providedIn: 'root'
})
export class DatastoreService {
  private addDataURl = 'api/suredata';
  private addDataURl1='api/suredatasource';
  constructor(private _http: HttpClient,private apiRequest: ApiRequestService) { }
  public getAll() {
    return this._http.get(`${baseUrl}/api/suredata`);
  }
  public create(data: any){
    return this._http.post(`${baseUrl}/api/suredata`, data);
  }
  create1(data:any,files:any): Observable<any> {
    const s = JSON.stringify(data);
    const formData:FormData = new FormData();
    formData.append("data",s);
    formData.append("ssh_file_key",files);
    // for(let i=0;i<files.length;i++){
    //   console.log("here");
    //   formData.append(files[i].name,files[i]);
    // }
    //console.log(formData.get("attachmentFile0"))
    return this.apiRequest.postFormData(this.addDataURl,formData);

   // return this.apiRequest.post(this.addDataURl, data);
    }
  public getById(id: any){
    return this._http.get(`${baseUrl}/api/suredata/${id}`);
  }
  public delete(id:any){
    return this._http.delete(`${baseUrl}/api/suredata/${id}`);
  }

  public update(id:any,data:any){
    return this._http.put(`${baseUrl}/api/suredata/${id}`, data);
  }
  update1(id: number, data:any,files:any): Observable<any> {
    const s =JSON.stringify(data);
    const formData:FormData=new FormData();
    formData.append("data",s);
    formData.append("ssh_file_key",files);

    return this.apiRequest.postFormData(`${this.addDataURl}/${id}`,formData);


  }
  public getAll2() {
    return this._http.get(`${baseUrl}/api/suredatasource`);
  }

  create2(data:any,files:any): Observable<any> {
    const s = JSON.stringify(data);
    const formData:FormData = new FormData();
    formData.append("data",s);
    formData.append("ssh_file_key",files);
    // for(let i=0;i<files.length;i++){
    //   console.log("here");
    //   formData.append(files[i].name,files[i]);
    // }
    //console.log(formData.get("attachmentFile0"))
    return this.apiRequest.postFormData(this.addDataURl1,formData);

   // return this.apiRequest.post(this.addDataURl, data);
    }
  public getById2(id: any){
    return this._http.get(`${baseUrl}/api/suredatasource/${id}`);
  }
  public delete2(id:any){
    return this._http.delete(`${baseUrl}/api/suredatasource/${id}`);
  }


  update2(id: number, data:any,files:any): Observable<any> {
    const s =JSON.stringify(data);
    const formData:FormData=new FormData();
    formData.append("data",s);
    formData.append("ssh_file_key",files);

    return this.apiRequest.postFormData(`${this.addDataURl1}/${id}`,formData);
  }

  testConnection(databaseType: string, storeUsername: string, storePassword: string, portNumber: string, dbHostname: string, databasename): Observable<any>{
    const url = 'suredata/test/testconnection';
    let params: HttpParams = new HttpParams();
      params =params.append("database_type",databaseType);
      params =params.append("store_username",storeUsername);
      params =params.append("store_password",storePassword);
      params =params.append("portnumber",portNumber);
      params =params.append("dbhostname",dbHostname);
      params =params.append("database_name",databasename)
      return this.apiRequest.get(url, params);
  }

  testsshConnection(sshHost: string, sshUsername: string, sshPassword: string, sshKeyFile: any): Observable<any>{
    const url = 'suredata/test/checksshconnection';
    let params: HttpParams = new HttpParams();
      params =params.append("sshHost",sshHost);
      params =params.append("sshUsername",sshUsername);
      params =params.append("sshPassword",sshPassword);
      params =params.append("sshKeyFile",sshKeyFile);
      return this.apiRequest.post(url, params);
  }
}
