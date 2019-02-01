import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { PerformanceService } from '../../performance.service';
import { NGXLogger } from 'ngx-logger';
import { PerformanceChartsOption } from '../../performance-charts-option';
import * as echarts from 'echarts';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-memory-chart',
  templateUrl: './memory-chart.component.html',
  styleUrls: ['./memory-chart.component.scss']
})
export class MemoryChartComponent implements OnInit, OnDestroy, AfterViewInit {

  private chart: echarts.ECharts = null;
  private seriesData = [];
  private subscription: Subscription = null;

  constructor(private readonly performanceService: PerformanceService, private readonly logger: NGXLogger) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.chart = echarts.init(<HTMLDivElement>(document.getElementById('memContent')));
      this.chart.setOption(PerformanceChartsOption.getOption());
    }, 0);
  }

  ngOnInit() {
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
    });
  }

  ngOnDestroy(): void {
    // 取消订阅数据
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.setOption({
        series: [{
          data: this.seriesData
        }]
      });
    }
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
