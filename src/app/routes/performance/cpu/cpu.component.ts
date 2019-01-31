import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { PerformanceService } from '../performance.service';
import { NGXLogger } from 'ngx-logger';
import { PerformanceChartsOption } from '../performance-charts-option';

@Component({
  selector: 'performance-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.scss']
})
export class CpuComponent implements OnInit {
  public info = []; // CPU信息，html目标引用

  private chart: echarts.ECharts = null;
  private seriesData = [];

  constructor(private readonly performanceService: PerformanceService, private readonly logger: NGXLogger) { }

  ngOnInit() {
    this.chart = echarts.init(<HTMLDivElement>(document.getElementById('cpuContent')));
    this.chart.setOption(PerformanceChartsOption.getOption('CPU 使用率'));

    this.performanceService.message().subscribe((data) => {
      const value = data.cpu.id;
      const now = data.top.time;
  
      this.seriesData.push({ value: [now, 100 - value] });
      if (this.seriesData.length > 60) {
        this.seriesData.shift();
      }
  
      this.chart.setOption({
        series: [{
          data: this.seriesData
        }]
      });

      this.info = this.parseInfo(data.cpu);
    });
  }

  private parseInfo(data: any): any[] {
    const info = [];

    for (const key in data) {
      info.push({ 'name': this.parseCpuName(key), 'value': data[key] });
    }

    return info;
  }

  private parseCpuName(name: string): string {
    switch (name) {
      case 'us': return '用户空间占用CPU的百分比';
      case 'sy': return '内核空间占用CPU的百分比';
      case 'ni': return '改变过优先级的进程占用CPU的百分比';
      case 'id': return '空闲CPU百分比';
      case 'wa': return 'IO等待占用CPU的百分比';
      case 'hi': return '硬中断占用CPU的百分比';
      case 'si': return '软中断占用CPU的百分比';
      case 'st': return '虚拟机被hypervisor偷去的CPU时间';
      default: return name;
    }
  }

}
