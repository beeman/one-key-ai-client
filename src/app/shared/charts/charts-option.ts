export class ChartsOption {
    public static getOption(init: {
        yAxis: { name: string, axisLabel?: any, [type: string]: any },
        series: {
            name: string, data?: [],
        }[],
        tooltip?: { formatter?: any }
    }): echarts.EChartOption {
        const option = {
            tooltip: Object.assign({
                trigger: 'axis',
                // formatter: (params: any[]) => {
                //     let text = '';
                //     params.forEach(param => {
                //         const time = param.value[0];
                //         if (text) {
                //             text += '\n';
                //         }
                //         text += [time.getHours(), time.getMinutes(), time.getSeconds()].join(':') + ' : ' + param.value[1].toFixed(1);
                //     });
                //     return text;
                // },
                // axisPointer: {
                //     animation: true
                // }
            }, init.tooltip),
            xAxis: {
                type: 'time',
                name: '时间',
                nameLocation: 'end',
                splitLine: {
                    show: false
                }
            },
            yAxis: Object.assign({
                type: 'value',
                min: 0,
                nameLocation: 'end',
                splitLine: {
                    show: false
                },
            }, init.yAxis),
            series: []
        };

        init.series.forEach(value => {
            option.series.push({
                name: value.name,
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                smooth: false,
                data: value.data ? value.data : []
            });
        });

        return <echarts.EChartOption>(option);
    }

}