const apiUrlScript4 = 'https://apidemo.geoeducacion.com.ar/api/testing/historial_asistencia/1';

// Inicializar el gráfico una vez que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
var chart4 = echarts.init(document.getElementById('chart4'));

    // Función para inicializar el gráfico
    function initChart(data) {
        const option4 = {
            title: {
                text: 'Evolución Anual de Asistencia'
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
        chart4.setOption(option4);
    }

    // Obtener los datos de la API y renderizar el gráfico
    fetch(apiUrlScript4)
        .then(response => response.json())
        .then(json => {
            if (json.success) {
                initChart(json.data);
            } else {
                console.error('Error al obtener los datos:', json.messages);
            }
        })
        .catch(error => console.error('Error al cargar los datos:', error));

    // Ajustar el tamaño del gráfico al redimensionar la ventana
    window.addEventListener('resize', () => chart4.resize());
});
