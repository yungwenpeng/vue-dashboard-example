export const chartType = 'LineChart';

export const chartOptions = {
    //title: 'Telemetry',
    //curveType: 'function',
    backgroundColor: 'transparent',
    legend: { position: "in", textStyle: { fontSize: 14, bold: true }, alignment: 'end' },
    hAxis: {
        title: "Timestamp", titleTextStyle: { bold: true, fontSize: 16 }, textPosition: 'out',
        slantedText: true, slantedTextAngle: 40,
    },
    vAxis: { title: "°C / %", titleTextStyle: { bold: true, fontSize: 16 }, },
    chartArea: { left: 100, top: 30, 'width': '80%', 'height': '70%' },
    series: {
        0: { curveType: "function", color: 'rgb(51, 104, 255)' },
        1: { curveType: "function", color: 'rgb(212, 147, 8)' },
    },
};