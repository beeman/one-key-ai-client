import { Component, OnInit, OnDestroy } from '@angular/core';
import { DriverService } from '../driver.service';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-gpu',
  templateUrl: './gpu.component.html',
  styleUrls: ['./gpu.component.scss']
})
export class GpuComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  public driverList = [];
  public driverDevices = [[]];

  constructor(private driverService: DriverService, private logger: NGXLogger) { }

  ngOnInit() {
    this.driverList = this.driverService.getLastDriverList();
    this.driverDevices = this.driverService.getLastDriverDevices();

    this.getDriverList();
    this.getDriverDevices();

    this.driverService.update();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((value) => {
      value.unsubscribe();
    });
  }

  public autoinstall() {
    this.driverService.autoinstall();
  }

  public getDriverList() {
    const sub = this.driverService.getDriverList().subscribe((data) => {
      this.driverList = data;
    });
    this.subscriptions.push(sub);
  }

  public getDriverDevices() {
    const sub = this.driverService.getDriverDevices().subscribe((data) => {
      this.driverDevices = data;
    });
    this.subscriptions.push(sub);
  }
}
