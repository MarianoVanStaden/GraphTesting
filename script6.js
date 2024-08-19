const apiUrlScript6 = 'https://apidemo.geoeducacion.com.ar/api/testing/calificaciones/1';

fetch(apiUrlScript6)
    .then(response => response.json())
    .then(responseData => {
        const cursos = responseData.data;

        if (!Array.isArray(cursos)) {
            throw new Error('El resultado de la API no contiene un array válido de cursos');
        }

        // Extraer nombres de cursos y los valores de aprobados y desaprobados
        const nombresCursos = cursos.map(item => item.curso);
        const aprobados = cursos.map(item => item.aprobados * 100);
        const desaprobados = cursos.map(item => item.desaprobados * 100);

        // Inicializar el gráfico
        const dom = document.getElementById('chart6');
        if (!dom) {
            throw new Error('El contenedor del gráfico no se encuentra en el DOM');
        }

        const myChart = echarts.init(dom);

        const option = {
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
                data: ['Aprobados', 'Desaprobados'],
                top: '5%',
                left: 'center'
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: nombresCursos
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    formatter: '{value} %'
                }
            },
            series: [
                {
                    name: 'Aprobados',
                    data: aprobados,
                    type: 'line',
                    areaStyle: {},
                    color: '#4CAF50'
                },
                {
                    name: 'Desaprobados',
                    data: desaprobados,
                    type: 'line',
                    areaStyle: {},
                    color: '#F44336'
                }
            ],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            legend: {
                top: '5%',
                left: 'center'
            }
        };

        myChart.setOption(option);

        // Ajustar el tamaño del gráfico al redimensionar la ventana
        window.addEventListener('resize', () => myChart.resize());
    })
    .catch(error => console.error('Error al cargar los datos:', error));
