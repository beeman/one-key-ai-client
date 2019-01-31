import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { InfoSocketService } from 'src/app/core/info-socket.service';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private driverDevices$: Observable<any> = null;
  private driverList$: Observable<any> = null;

  private lastDriverDevice = [[]];
  private lastDriverList = [];

  constructor(private http: HttpClient, private socketService: InfoSocketService, private logger: NGXLogger) {
    this.driverDevices$ = this.socketService.getMessage('driverDevices').pipe(
      map((value) => {
        return value['data'];
      }),
    );
    this.driverList$ = this.socketService.getMessage('driverList').pipe(
      map((value) => {
        return value['data'];
      }),
    );

    this.getDriverDevices().subscribe((value) => {
      this.lastDriverDevice = value;
    });

    this.getDriverList().subscribe((value) => {
      this.lastDriverList = value;
    });
  }

  public autoinstall(): void {
    this.socketService.emit('autoinstall');
  }

  public getDriverList(): Observable<any> {
    // return this.http.get('http://localhost:3000/driver/list');
    return this.driverList$;
  }

  public getDriverDevices(): Observable<any> {
    // return this.http.get('http://localhost:3000/driver/devices');
    return this.driverDevices$;
  }

  public getLastDriverList(): any {
    return this.lastDriverList;
  }

  public getLastDriverDevices(): any {
    return this.lastDriverDevice;
  }

  public update(): void {
    this.updateDriverDevices();
    this.updateDriverList();
  }

  private updateDriverList(): void {
    this.socketService.emit('getDriverList');
  }

  private updateDriverDevices(): void {
    this.socketService.emit('getDriverDevices');
  }


}
