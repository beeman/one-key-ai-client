import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { EnvironmentService } from 'src/app/core/environment.service';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private lastDriverDevices = [[]];
  private lastDriverList = [];

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {
  }

  /**
   * 获取已安装驱动列表
   *
   * @returns {Observable<any>}
   * @memberof DriverService
   */
  public getDriverList(): Observable<any> {
    return this.http.post(this.environmentService.serverUrl() + '/info/driver-list', null).pipe(
      map((value: any) => {
        if (value.data) {
          this.lastDriverList = value.data;
        }
        return value;
      })
    );
  }

  /**
   * 获取可安装驱动列表
   *
   * @returns {Observable<any>}
   * @memberof DriverService
   */
  public getDriverDevices(): Observable<any> {
    return this.http.post(this.environmentService.serverUrl() + '/info/driver-devices', null).pipe(
      map((value: any) => {
        this.lastDriverDevices = value.data;
        return value;
      })
    );
  }

  public getLastDriverList(): any {
    return this.lastDriverList;
  }

  public getLastDriverDevices(): any {
    return this.lastDriverDevices;
  }
}
