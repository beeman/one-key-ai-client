import { Component, OnInit } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { NGXLogger } from 'ngx-logger';
import { PerformanceChartsOption } from '../performance-charts-option';
import * as echarts from 'echarts';

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.scss']
})
export class MemoryComponent implements OnInit {

  private chart: echarts.ECharts = null;
  private seriesData = [];
  private info = [];

  constructor(private readonly performanceService: PerformanceService, private readonly logger: NGXLogger) { }

  ngOnInit() {
    this.chart = echarts.init(<HTMLDivElement>(document.getElementById('memContent')));
    this.chart.setOption(PerformanceChartsOption.getOption('内存 使用率'));

    this.performanceService.message().subscribe((data) => {
      const mem = data.mem;
      const now = data.top.time;
      this.parseData(mem);

      this.seriesData.push({ value: [now, mem.used / mem.total * 100] });
      if (this.seriesData.length > 60) {
        this.seriesData.shift();
      }
      this.chart.setOption({
        series: [{
          data: this.seriesData
        }]
      });
    });
  }

  private parseData(data: any) {
    this.info = [];

    for (const key in data) {
      this.info.push({ 'name': this.parseCpuName(key), 'value': data[key] });
    }
  }
  
  private parseCpuName(name: string): string {
    switch (name) {
      case 'total': return '物理内存';
      case 'used': return '使用内存';
      case 'free': return '空闲内存';
      case 'buffers': return '缓存内存';
      default: return name;
    }
  }
}
