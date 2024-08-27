const apiUrl = 'https://apidemo.geoeducacion.com.ar/api/testing/historial_asistencia/1';

// Función para inicializar el gráfico
function initChart(data) {
    const chartDom = document.getElementById('chart-container');
    const myChart = echarts.init(chartDom);

    // Configuración del gráfico
    const option = {
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
            max: 1
        },
        series: [{
            name: 'Asistencia',
            type: 'line',
            data: data.map(item => item.asistencia) // Asistencia en el eje Y
        }]
    };

    // Renderizar el gráfico
    myChart.setOption(option);
}

// Obtener los datos de la API y renderizar el gráfico
fetch(apiUrl)
    .then(response => response.json())
    .then(json => {
        if (json.success) {
            initChart(json.data);
        } else {
            console.error('Error al obtener los datos:', json.messages);
        }
    })
    .catch(error => {
        console.error('Error en la solicitud:', error);
    });
