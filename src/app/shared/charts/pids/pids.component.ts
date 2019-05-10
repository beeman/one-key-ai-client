import { Component, OnInit } from '@angular/core';
import { ChartsOption } from '../charts-option';
import { ChartComponent } from '../chart.component';
import { ContainerStats } from '../container-stats';

@Component({
  selector: 'app-pids',
  templateUrl: './pids.component.html',
  styleUrls: ['./pids.component.scss']
})
export class PidsComponent extends ChartComponent {

  protected getOption(): echarts.EChartOption {
    return ChartsOption.getOption({ yAxis: { name: '个数', minInterval: 1 }, series: [{ name: '进程' }] });
  }

  protected parseData(data: ContainerStats): any[] {
    const value = data.pidsStats.current;
    return [{ value: [data.time, value] }];
  }

}
