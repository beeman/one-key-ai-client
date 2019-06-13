import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DriverService } from '../driver.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-gpu',
  templateUrl: './gpu.component.html',
  styleUrls: ['./gpu.component.scss']
})
export class GpuComponent implements OnInit, OnDestroy {
  private readonly tag = GpuComponent.name;

  public isModalVisible = false;

  public driverList: string[] = [];
  public driverDevices = [[]];

  constructor(
    private driverService: DriverService,
    private messageService: NzMessageService
  ) { }

  ngOnInit() {
    this.driverList = this.driverService.getLastDriverList();
    this.driverDevices = this.driverService.getLastDriverDevices();

    this.getDriverList();
    this.getDriverDevices();
  }

  ngOnDestroy() {
  }

  public getDriverList(): void {
    this.driverService.getDriverList().subscribe((data) => {
      if (data.msg === 'ok') {
        this.driverList = data.data;
        this.driverList.sort((a, b) => {
          if (a > b) {
            return -1;
          } else if (a < b) {
            return 1;
          } else {
            return 0;
          }
        });
      } else {
        this.messageService.info(data.msg);
      }

    });
  }

  public getDriverDevices(): void {
    const sub = this.driverService.getDriverDevices().subscribe((data) => {
      if (data.msg === 'ok') {
        this.driverDevices = data.data;
      } else {
        this.messageService.info(data.msg);
      }
    });
    // this.subscriptions.push(sub);
  }
}
