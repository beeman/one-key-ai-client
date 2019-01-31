import { Component, OnInit, OnDestroy } from '@angular/core';
import { PerformanceService } from '../performance.service';
import { NGXLogger } from 'ngx-logger';
import { PerformanceChartsOption } from '../performance-charts-option';
import * as echarts from 'echarts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-memory',
  templateUrl: './memory.component.html',
  styleUrls: ['./memory.component.scss']
})
export class MemoryComponent implements OnInit, OnDestroy {

  private chart: echarts.ECharts = null;
  private seriesData = [];
  private info = [];
  private subscription: Subscription = null;

  constructor(private readonly performanceService: PerformanceService, private readonly logger: NGXLogger) { }

  ngOnInit() {
    this.chart = echarts.init(<HTMLDivElement>(document.getElementById('memContent')));
    this.chart.setOption(PerformanceChartsOption.getOption('内存 使用率'));

    // 显示保存的数据
    const messages = this.performanceService.getMessages();
    messages.forEach((value) => {
      this.updateSeriesData(value);
    });
    this.updateChart();

    // 更新数据
    this.subscription = this.performanceService.getMessage().subscribe((data) => {
      this.updateSeriesData(data);
      this.updateChart();

      this.parseInfo(data.mem);
    });
  }

  ngOnDestroy(): void {
    // 取消订阅数据
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private parseInfo(data: any): void {
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

  private updateChart(): void {
    this.chart.setOption({
      series: [{
        data: this.seriesData
      }]
    });
  }

  private updateSeriesData(data: any): void {
    const mem = data.mem;
    const now = data.top.time;

    this.seriesData.push({ value: [now, mem.used / mem.total * 100] });
    if (this.seriesData.length > 60) {
      this.seriesData.shift();
    }
  }
}
