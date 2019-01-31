import { Component, OnInit, OnDestroy } from '@angular/core';
import * as echarts from 'echarts';
import { PerformanceService } from '../performance.service';
import { NGXLogger } from 'ngx-logger';
import { PerformanceChartsOption } from '../performance-charts-option';
import { Subscription } from 'rxjs';

@Component({
  selector: 'performance-cpu',
  templateUrl: './cpu.component.html',
  styleUrls: ['./cpu.component.scss']
})
export class CpuComponent implements OnInit, OnDestroy {
  public info = []; // CPU信息，html目标引用

  private chart: echarts.ECharts = null;
  private seriesData = [];
  private subscription: Subscription = null;

  constructor(private readonly performanceService: PerformanceService, private readonly logger: NGXLogger) { }

  ngOnInit() {
    // 初始化图表
    this.chart = echarts.init(<HTMLDivElement>(document.getElementById('cpuContent')));
    this.chart.setOption(PerformanceChartsOption.getOption('CPU 使用率'));

    // 显示保存的数据
    const messages = this.performanceService.getMessages();
    messages.forEach((value) => {
      this.udpateSeriesData(value);
    });
    this.updateChart();

    // 更新数据
    this.subscription = this.performanceService.getMessage().subscribe((data) => {
      this.udpateSeriesData(data);
      this.updateChart();
      this.info = this.parseInfo(data.cpu);
    });
  }

  ngOnDestroy(): void {
    // 取消订阅数据
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
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

  private updateChart(): void {
    this.chart.setOption({
      series: [{
        data: this.seriesData
      }]
    });
  }

  private udpateSeriesData(data: any): void {
    const value = data.cpu.id;
    const now = data.top.time;

    this.seriesData.push({ value: [now, 100 - value] });
    if (this.seriesData.length > 60) {
      this.seriesData.shift();
    }
  }
}
