const apiUrlScript = 'https://apidemo.geoeducacion.com.ar/api/testing/control/1';

// Inicializar el gráfico una vez que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
var chart = echarts.init(document.getElementById('chart'));

    // Función para inicializar el gráfico
    function initChart(data) {
        const option = {
            title: {
                text: 'Control de mediciones'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: data.map(item => item.mes) // Meses en el eje X
            },
            yAxis: {
                type: 'value',
                min: 0,
                max: 100,
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            series: [{
                name: 'Asistencia',
                type: 'line',
                data: data.map(item => item.asistencia*100) // Asistencia en el eje Y
            }]
        };

        // Renderizar el gráfico
        chart.setOption(option);
    }

    // Obtener los datos de la API y renderizar el gráfico
    fetch(apiUrlScript)
        .then(response => response.json())
        .then(json => {
            if (json.success) {
                initChart(json.data);
            } else {
                console.error('Error al obtener los datos:', json.messages);
            }
        })
        .catch(error => console.error('Error al cargar los datos:', error));

});
