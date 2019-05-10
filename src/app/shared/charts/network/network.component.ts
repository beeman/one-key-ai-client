import { Component } from '@angular/core';
import { ChartsOption } from '../charts-option';
import * as echarts from 'echarts';
import { ChartComponent } from '../chart.component';
import { ContainerStats } from 'src/app/shared/charts/container-stats';

@Component({
    selector: 'app-network',
    templateUrl: './network.component.html',
    styleUrls: ['./network.component.scss']
})
export class NetworkComponent extends ChartComponent {
    constructor() {
        super();
    }

    protected getOption(): echarts.EChartOption {
        return ChartsOption.getOption({
            yAxis: {
                name: '传输速度',
                axisLabel: {
                    formatter: this.calculateBytes
                }
            },
            series: [{ name: '接收' }, { name: '发送' }]
        });
    }

    protected parseData(data: ContainerStats): any[] {
        const rx = data.network.receiveBytes;
        const tx = data.network.transportBytes;
        return [{ value: [data.time, rx] }, { value: [data.time, tx] }];
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
