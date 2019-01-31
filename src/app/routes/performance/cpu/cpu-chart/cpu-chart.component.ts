import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as echarts from 'echarts';
import { PerformanceService } from '../../performance.service';
import { NGXLogger } from 'ngx-logger';
import { PerformanceChartsOption } from '../../performance-charts-option';
import { Subscription } from 'rxjs';

@Component({
  selector: 'performance-cpu-chart',
  templateUrl: './cpu-chart.component.html',
  styleUrls: ['./cpu-chart.component.scss']
})
export class CpuChartComponent implements OnInit, OnDestroy, AfterViewInit {
  private chart: echarts.ECharts = null;
  private seriesData = [];
  private subscription: Subscription = null;

  constructor(private readonly performanceService: PerformanceService, private readonly logger: NGXLogger) { }

  ngAfterViewInit(): void {
    // 初始化图表
    this.chart = echarts.init(<HTMLDivElement>(document.getElementById('cpuContent')));
    this.chart.setOption(PerformanceChartsOption.getOption());
  }

  ngOnInit() {
  // 更新保存的数据
  const messages = this.performanceService.getMessages();
  messages.forEach((value) => {
    this.udpateSeriesData(value);
  });
  this.updateChart();

  // 更新数据
  this.subscription = this.performanceService.getMessage().subscribe((data) => {
    this.udpateSeriesData(data);
    this.updateChart();
  });
  }

  ngOnDestroy(): void {
    // 取消订阅数据
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateChart(): void {
    if(this.chart){
      this.chart.setOption({
        series: [{
          data: this.seriesData
        }]
      });
    }
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
