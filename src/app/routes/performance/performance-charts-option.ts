export class PerformanceChartsOption {
    public static getOption(title: string): echarts.EChartOption {
        const option = {
            title: {
                text: title
            },
            tooltip: {
                trigger: 'axis',
                formatter: (params) => {
                    params = params[0];
                    const time = params.value[0];
                    return [time.getHours(), time.getMinutes(), time.getSeconds()].join(':') + ' : ' + params.value[1].toFixed(1);
                },
                axisPointer: {
                    animation: false
                }
            },
            xAxis: {
                type: 'time',
                name: '时间',
                nameLocation: 'end',
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                name: '% 使用率',
                max: 100,
                min: 0,
                nameLocation: 'end',
                splitLine: {
                    show: false
                }
            },
            series: [{
                name: '数据',
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data: []
            }]
        };

        return <echarts.EChartOption>(option);
    }

}