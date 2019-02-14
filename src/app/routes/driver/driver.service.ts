import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { InfoSocketService } from 'src/app/core/info-socket.service';
import { NGXLogger } from 'ngx-logger';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private lastDriverDevices = [[]];
  private lastDriverList = [];

  constructor(private socketService: InfoSocketService, private logger: NGXLogger) {
  }

  /**
   * 自动安装驱动
   *
   * @memberof DriverService
   */
  public autoinstall(): Observable<any> {
    return this.socketService.getObservable('autoinstall');
  }


  /**
   * 获取已安装驱动列表
   *
   * @returns {Observable<any>}
   * @memberof DriverService
   */
  public getDriverList(): Observable<any> {
    return this.socketService.getObservable('driverList').pipe(
      map(value => {
        this.lastDriverList = value;
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
    return this.socketService.getObservable('driverDevices').pipe(
      map(value => {
        this.lastDriverDevices = value;
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
