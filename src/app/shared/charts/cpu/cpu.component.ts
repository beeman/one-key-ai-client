import { Component } from '@angular/core';
import * as echarts from 'echarts';
import { ChartsOption } from '../charts-option';
import { ChartComponent } from '../chart.component';
import { ContainerStats } from 'src/app/shared/charts/container-stats';


@Component({
  selector: 'app-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.scss']
})
export class CpuComponent extends ChartComponent {
  constructor() {
    super();
  }

  protected getOption(): echarts.EChartOption {
    return ChartsOption.getOption({ yAxis: { name: '% 使用率' }, series: [{ name: 'Cpu' }] });
  }

  protected parseData(data: ContainerStats): any[] {
    const value = data.cpu;
    return [{ value: [data.time, value] }];
  }
}
