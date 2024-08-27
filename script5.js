const apiUrl = 'https://apidemo.geoeducacion.com.ar/api/testing/calificaciones/1';

function initChart(data) {
    const chartDom = document.getElementById('chart-container');
    const myChart = echarts.init(chartDom);
    let aprobados= 0;
    let desaprobados=0;
    data.forEach(curso=> {
        aprobados+=curso.aprobados;
        desaprobados+=curso.desaprobados;
    });

    // Configuración del gráfico
    const option = {
        title: {
            text: 'Nivel general de calificaciones',
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
              data:[{value: aprobados, name: "Aprobados"},
              {value: desaprobados, name: "Desaprobados"}],
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
