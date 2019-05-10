import { Component } from '@angular/core';
import { ChartsOption } from '../charts-option';
import * as echarts from 'echarts';
import { ChartComponent } from '../chart.component';
import { ContainerStats } from 'src/app/shared/charts/container-stats';


@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.scss']
})
export class MemoryComponent extends ChartComponent {
  constructor() {
    super();
  }

  protected getOption(): echarts.EChartOption {
    return ChartsOption.getOption({ yAxis: { name: '% 使用率' }, series: [{ name: 'Memory' }] });
  }

  protected parseData(data: ContainerStats): any[] {
    const value = Number.parseFloat((data.mem.memUsage / data.mem.limit * 100.0).toFixed(2));
    return [{ value: [data.time, value] }];
  }
}
