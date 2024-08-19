// script3.js

const apiUrlScript3 = 'https://apidemo.geoeducacion.com.ar/api/testing/historial_asistencia/1';
var chart3 = echarts.init(document.getElementById('chart3')); // Asegúrate de que 'chart3' sea el ID correcto del elemento

fetch(apiUrlScript3)
    .then(response => response.json())
    .then(responseData => {
        const historial = responseData.data;

        if (!Array.isArray(historial)) {
            throw new Error('El resultado de la API no contiene un array válido de historial');
        }

        // Extraer nombres de meses y los valores de asistencia
        const nombresMeses = historial.map(item => item.mes);
        const asistencia = historial.map(item => item.asistencia * 100);

        // Configuración del gráfico
        var option3 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    let result = `${params[0].name}<br/>`;
                    params.forEach(item => {
                        result += `${item.marker} ${item.seriesName}: ${item.data}%<br/>`;
                    });
                    return result;
                }
            },
            legend: {
                data: ['Asistencia'],
                top: '5%',
                left: 'center'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} %'
                }
            },
            yAxis: {
                type: 'category',
                axisTick: {
                    show: false
                },
                data: nombresMeses
            },
            series: [
                {
                    name: 'Asistencia',
                    type: 'bar',
                    label: {
                        show: true,
                        position: 'inside'
                    },
                    emphasis: {
                        focus: 'series'
                    },
                    data: asistencia,
                    color: '#4CAF50'
                }
            ]
        };

        // Establecer las opciones del gráfico 3
        if (option3 && typeof option3 === 'object') {
            chart3.setOption(option3);
        }

        // Ajustar el tamaño del gráfico al redimensionar la ventana
        window.addEventListener('resize', () => chart3.resize());
    })
    .catch(error => console.error('Error al cargar los datos:', error));
