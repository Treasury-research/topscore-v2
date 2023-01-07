import { useEffect } from 'react';
import * as echarts from 'echarts';
const radorImg = '/static/img/radar.png'

const dataBJ = [
    [98, 80, 99, 70, 79, 80],
];

const ChartLine = (props: any) => {
    const { optionsData = null, id = 'default-id', width = '100%', height = '100%' } = props;
    useEffect(() => {
        const option = {
            tooltip: {
                trigger: 'axis',
                show: false
            },
            legend: {
                data: ['Influence', 'Campaign', 'Creation', 'Curation', 'Collection', 'Engagement'],
                textStyle: {
                    color: '#FEFFFE',
                    fontSize: 20
                }
            },
            radar: {
                axisName: {
                    color: 'rgba(255,255,255,.5)',
                    fontSize: 14,
                    fontFamily: "Jura",
                    backgroundColor: '#232429',
                    padding: [10, 10, 8, 10],
                    clickable: true,
                },
                indicator: [
                    { name: 'Influence', max: 100, color: "rgba(255,255,255,.6)" },
                    { name: 'Campaign', max: 100, color: "rgba(255,255,255,.6)" },
                    { name: 'Creation', max: 100, color: "rgba(255,255,255,.6)" },
                    { name: 'Curation', max: 100, color: "rgba(255,255,255,.6)" },
                    { name: 'Collection', max: 100, color: "rgba(255,255,255,.6)" },
                    { name: 'Engagement', max: 100, color: "rgba(255,255,255,.6)" },

                ],
                shape: 'circle',
                splitNumber: 4,
                name: {
                    textStyle: {
                        color: '#ffffff',
                        fontSize: 16
                    }
                },
                splitLine: {
                    show: false,
                    lineStyle: {
                        color: [
                            'rgba(238,238,238, 0.3)', 'rgba(238,238,238, 0.2)',
                            'rgba(238,238,238, 0.2)', 'rgba(238,238,238, 0.2)',
                            'rgba(238,238,238, 0.2)', 'rgba(238,238,238, 0.2)'
                        ].reverse(),
                        width: 1
                    }
                },
                splitArea: {
                    show: false
                },
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: 'rgba(238,238,238, 0.2)'
                    }
                },
                itemStyle: {
                    show: false,
                    normal: {
                        color: '#B5EA22',
                    }
                },
                triggerEvent: true
            },
            series: [{
                type: 'radar',
                tooltip: {
                    trigger: 'item'
                },
                data: dataBJ,
                symbol: 'circle',
                symbolSize: 0,
                // itemStyle: {
                //     normal: {
                //         color: '#B5EA22',
                //         borderColor: 'rgba(181, 234, 34,0.2)',
                //         borderWidth: 10,
                //     }
                // },
                lineStyle: {
                    show: false,
                    color: '#B5EA22',
                    width: 0
                },
                itemStyle: {
                    show: false,
                    normal: {
                        color: 'red'
                    }
                },
                areaStyle: {
                    show: false,
                    normal: {
                        opacity: 0
                    }
                }
            }],


        };
        const HTMLElement = document.getElementById(id) as HTMLElement;
        const chart = echarts.init(HTMLElement);
        chart.on('click', function (param) {
            if (param.targetType == "axisName") {
                const filteredName = param.name.replace(/\s/g, '');
                props.showList(filteredName)
            }
        })
        chart.setOption(option);
        window.addEventListener("resize", () => {
            if (chart) {
                chart.resize()
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [optionsData]);
    return (
        <div style={{ width: width, height: height, position: "relative" }}>
            <div id={id} style={{ width: width, height: height, zIndex: '99' }}>

            </div>
            <img src={radorImg} alt="" style={{ position: "absolute", zIndex: '9', height: "80%", left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>

    );
};

export default ChartLine;
