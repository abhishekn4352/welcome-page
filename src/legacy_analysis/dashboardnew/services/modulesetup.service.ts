import { Injectable } from '@angular/core';
import { ModuleSetup } from "../../models/builder/Module_Setup";
import { Observable } from "rxjs";
import { ApiRequestService } from "../api/api-request.service";
import { HttpParams } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class ModulesetupService {
  private baseURL = "api/module-setup";
  private copyModuleURL = 'api/module-copy';
  private allrepourl ='api/getAllMyRepos';
  constructor( private apiRequest: ApiRequestService) { }
  getAll(page?: number, size?: number): Observable<any> { // not in use
    //Create Request URL params
    let params: HttpParams = new HttpParams();
    params = params.append("page", typeof page === "number" ? page.toString() : "0");
    params = params.append("size", typeof size === "number" ? size.toString() : "1000");
    //const _http = this.baseURL + '/all';
    return this.apiRequest.get(this.baseURL, params);
  }

  getProjectModules(projectId:number, page?: number, size?: number): Observable<any> {
    //Create Request URL params
    let params: HttpParams = new HttpParams();
    params = params.append("projectId", projectId.toString());
    params = params.append("page", typeof page === "number" ? page.toString() : "0");
    params = params.append("size", typeof size === "number" ? size.toString() : "1000");
    //const _http = this.baseURL + '/all';
    return this.apiRequest.get(this.baseURL, params);
  }

  getById(id: number): Observable<any> {
    const _http = this.baseURL + "/" + id;
    return this.apiRequest.get(_http);
  }

  getByAccountId(): Observable<ModuleSetup[]> {
    const _http = this.baseURL + "/user-menu";
    return this.apiRequest.get(_http);
  }

  create(moduleSetup: ModuleSetup): Observable<any> {
    let params: HttpParams = new HttpParams();
   // params = params.append("p_id", projectId.toString());
    return this.apiRequest.post(this.baseURL, moduleSetup);
  }

  update(id: number, moduleSetup: ModuleSetup): Observable<any> {
    const _http = this.baseURL + "/" + id;
    return this.apiRequest.put(_http, moduleSetup);
  }
  delete(id: number): Observable<any> {
    const _http = this.baseURL + "/" + id;
    return this.apiRequest.delete(_http);
  }

  copy(moduleCopyForm: Object) :Observable<any> {
    return this.apiRequest.post(this.copyModuleURL, moduleCopyForm);
  }

  getByallrepouserId(id: number): Observable<ModuleSetup> {
    const _http = this.allrepourl + "/" + id;
    return this.apiRequest.get(_http);
  }



  /////backend Configuration

  saveData(data: any): Observable<any> {
    return this.apiRequest.post(`BackendConfig/BackendConfig`, data);
  }

  getDetails(): Observable<any> {
    return this.apiRequest.get(`BackendConfig/BackendConfig`);
  }

  getDetailsById(id: number): Observable<any> {
    return this.apiRequest.get(`BackendConfig/BackendConfig/${id}`);
  }

  deleteById(id: number): Observable<any> {
    return this.apiRequest.delete(`BackendConfig/BackendConfig/${id}`);
  }

  updatebackend(data: any, id: number): Observable<any> {
    return this.apiRequest.put(`BackendConfig/BackendConfig/${id}`, data);
  }

  getAllViaModule(module_id: number): Observable<any> {
    return this.apiRequest.get(`BackendConfig/moduleid/${module_id}`);
  }

  getAllViaProject(project_id: number): Observable<any> {
    return this.apiRequest.get(`BackendConfig/by_project/${project_id}`);
  }


  /////Database Configuration

  saveDBData(data: any): Observable<any> {
    return this.apiRequest.post(`Dbconfig/Dbconfig`, data);
  }

  getDBDetails(): Observable<any> {
    return this.apiRequest.get(`Dbconfig/Dbconfig`);
  }

  getDBDetailsById(id: number): Observable<any> {
    return this.apiRequest.get(`Dbconfig/Dbconfig/${id}`);
  }

  deleteDBById(id: number): Observable<any> {
    return this.apiRequest.delete(`Dbconfig/Dbconfig/${id}`);
  }

  updateDB(data: any, id: number): Observable<any> {
    return this.apiRequest.put(`Dbconfig/Dbconfig/${id}`, data);
  }

  getDBAllViaModule(moduleid: number): Observable<any> {
    return this.apiRequest.get(`Dbconfig/bymoduleid/${moduleid}`);
  }

  getDBAllViaProject(project_id: number): Observable<any> {
    return this.apiRequest.get(`Dbconfig/by_proj_id/${project_id}`);
  }


  testConnection(databaseType: string, username: string, password: string, portnumber: string, dbhostname: string, database_name): Observable<any>{
    const url = 'suredata/test/testconnection';
    let params: HttpParams = new HttpParams();
      params =params.append("database_type",databaseType);
      params =params.append("username",username);
      params =params.append("password",password);
      params =params.append("portnumber",portnumber);
      params =params.append("dbhostname",dbhostname);
      params =params.append("database_name",database_name)
      return this.apiRequest.get(url, params);
  }


  //////get all config

  getConfigById(moduleid: number): Observable<any> {
    return this.apiRequest.get(`fnd/project/getallconfig/${moduleid}`);
  }

  //==============Module_library===============//

// copyToLibrary(id: number): Observable<any> {
//   return this.apiRequest.get(`wflibrary/copylib/copy_library/${id}`);
// }

copyFromLibrary(library_id: number, proj_id: number): Observable<any> {
  return this.apiRequest.get(`library/modulelibrary/copyfrommodulelibrarytomodule/${library_id}/${proj_id}`);
}


addToLibrary(id: number): Observable<any> {
  return this.apiRequest.get(`library/modulelibrary/copyfromrn_module/${id}`);
}

getdetails(): Observable<any> {
  return this.apiRequest.get(`Wf_library/Wf_library`);
}

getLibrarydetails(): Observable<any> {
  return this.apiRequest.get(`library/modulelibrary/getall_module_lib`);
}
}
