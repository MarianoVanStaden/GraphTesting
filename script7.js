const apiUrlScript7 = 'https://apidemo.geoeducacion.com.ar/api/testing/comunicados/1';

fetch(apiUrlScript7)
    .then(response => response.json())
    .then(responseData => {
        const datos = responseData.data[0];

        if (!datos) {
            throw new Error('No se encontraron datos válidos en la respuesta de la API');
        }

        // Preparar los datos para el gráfico
        const total = datos.total;
        const entregados = datos.entregados;
        const pendientes = datos.pendientes;
        const error = datos.error;

        const categorias = ['Entregados', 'Pendientes', 'Errores'];
        const valores = [entregados, pendientes, error];

        // Inicializar el gráfico
        const dom = document.getElementById('chart7');
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
                formatter: '{b}: {c}'
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: categorias,
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: 'Estado de Entrega',
                    type: 'bar',
                    barWidth: '60%',
                    data: valores,
                    itemStyle: {
                        color: '#2196F3'
                    }
                }
            ]
        };

        myChart.setOption(option);

        // Ajustar el tamaño del gráfico al redimensionar la ventana
        window.addEventListener('resize', () => myChart.resize());
    })
    .catch(error => console.error('Error al cargar los datos:', error));
