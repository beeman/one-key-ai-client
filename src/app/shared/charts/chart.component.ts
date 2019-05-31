import { Input, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as echarts from 'echarts';

export abstract class ChartComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input()
    data$: Observable<any>;

    @ViewChild('element')
    elementRef: ElementRef;

    protected chart: echarts.ECharts = null;
    protected series = null;
    private dataSubscription: Subscription = null;

    constructor() {
    }

    ngOnInit() {
        this.dataSubscription = this.data$.subscribe(value => {
            this.udpateSeriesData(value);
            this.updateChart();
        });
    }

    ngOnDestroy(): void {
        if (this.dataSubscription) {
            this.dataSubscription.unsubscribe();
        }
    }

    ngAfterViewInit(): void {
        // 初始化图表
        setTimeout(() => {
            this.chart = echarts.init(<HTMLDivElement>(this.elementRef.nativeElement));
            const option = this.getOption();
            this.series = option.series;
            this.chart.setOption(option);
        }, 0);
    }

    protected abstract getOption(): echarts.EChartOption;

    protected abstract parseData(data: any): { value: any[] }[];

    private updateChart(): void {
        if (this.chart) {
            this.chart.setOption({
                series: this.series
            });
        }
    }

    private udpateSeriesData(data: any): void {
        const newSeriesData = this.parseData(data);
        newSeriesData.forEach((value, index) => {
            if (this.series) {
                const seriesData = this.series[index].data;
                seriesData.push(value);
                if (seriesData.length > 60) {
                    seriesData.shift();
                }
            }
        });
    }
}