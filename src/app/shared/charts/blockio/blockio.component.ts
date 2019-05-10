import { Component, OnInit } from '@angular/core';
import { ChartComponent } from '../chart.component';
import { ChartsOption } from '../charts-option';
import { ContainerStats } from '../container-stats';

@Component({
  selector: 'app-blockio',
  templateUrl: './blockio.component.html',
  styleUrls: ['./blockio.component.scss']
})
export class BlockioComponent extends ChartComponent {
  constructor() {
    super();
  }

  protected getOption(): echarts.EChartOption {
    return ChartsOption.getOption({
      yAxis: {
        name: '读写速度',
        axisLabel: {
          formatter: this.calculateBytes
        }
      },
      series: [{ name: '读' }, { name: '写' }]
    });
  }

  protected parseData(data: ContainerStats): any[] {
    const rb = data.io.blockReadBytes;
    const wb = data.io.blockWriteBytes;
    return [{ value: [data.time, rb] }, { value: [data.time, wb] }];
  }

  private calculateBytes(value: number): string {
    if (value >> 20 > 1) {
      return (value / 1024 / 1024).toFixed(2) + 'MB';
    } else if (value >> 10 > 1) {
      return (value / 1024).toFixed(2) + 'KB';
    } else {
      return value + 'B';
    }
  }

}
