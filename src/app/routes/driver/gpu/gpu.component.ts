import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DriverService } from '../driver.service';
import { NGXLogger } from 'ngx-logger';
import { TerminalComponent } from 'src/app/shared/terminal/terminal.component';

@Component({
  selector: 'app-gpu',
  templateUrl: './gpu.component.html',
  styleUrls: ['./gpu.component.scss']
})
export class GpuComponent implements OnInit, OnDestroy {
  private readonly tag = GpuComponent.name;

  // private subscriptions: Subscription[] = [];

  public isModalVisible = false;

  public driverList: string[] = [];
  public driverDevices = [[]];

  constructor(private driverService: DriverService, private logger: NGXLogger) { }

  ngOnInit() {
    this.driverList = this.driverService.getLastDriverList();
    this.driverDevices = this.driverService.getLastDriverDevices();

    this.getDriverList();
    this.getDriverDevices();
  }

  ngOnDestroy() {
    // this.subscriptions.forEach((value) => {
    //   value.unsubscribe();
    // });
  }

  public getDriverList(): void {
    const sub = this.driverService.getDriverList().subscribe((data) => {
      this.driverList = data;
      this.driverList.sort((a, b) => {
        if (a > b) {
          return -1;
        } else if (a < b) {
          return 1;
        } else {
          return 0;
        }
      });
    });
    // this.subscriptions.push(sub);
  }

  public getDriverDevices(): void {
    const sub = this.driverService.getDriverDevices().subscribe((data) => {
      this.driverDevices = data;
    });
    // this.subscriptions.push(sub);
  }
}
