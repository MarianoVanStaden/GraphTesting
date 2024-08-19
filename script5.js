const apiUrlScript5 = 'https://apidemo.geoeducacion.com.ar/api/testing/calificaciones/1';
var chart5 = echarts.init(document.getElementById('chart5'));

function initChart(data) {
    // Inicializar las variables
    let totalAprobados = 0;
    let totalDesaprobados = 0;

    // Calcular la suma total de aprobados y desaprobados
    data.forEach(curso => {
        totalAprobados += curso.aprobados;
        totalDesaprobados += curso.desaprobados;
    });

    // Calcular el total combinado para obtener porcentajes
    const total = totalAprobados + totalDesaprobados;

    // Si el total es 0, evitar división por cero
    const percentageAprobados = total > 0 ? (totalAprobados / total) * 100 : 0;
    const percentageDesaprobados = total > 0 ? (totalDesaprobados / total) * 100 : 0;

    // Configuración del gráfico
    const option = {
        title: {
            text: 'Porcentaje %',
            subtext: '',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [
            {
                name: 'Alumnos',
                type: 'pie',
                radius: '50%',
                data: [
                    { value: percentageAprobados, name: 'Aprobados' },
                    { value: percentageDesaprobados, name: 'Desaprobados' }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    // Renderizar el gráfico
    chart5.setOption(option);
}

// Obtener los datos de la API y renderizar el gráfico
fetch(apiUrlScript5)
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

// Ajustar el tamaño del gráfico al redimensionar la ventana
window.addEventListener('resize', () => {
    chart5.resize();
});
