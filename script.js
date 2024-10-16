document.addEventListener('DOMContentLoaded', () => {
    const apiUrlBase = 'https://apidemo.geoeducacion.com.ar/api/testing/control/';
    const caseSelector = document.getElementById('case-selector');
    const chart = echarts.init(document.getElementById('chart-container'));

    // Función para inicializar el gráfico
    function initChart(data) {
        const values = data.valores.map(item => item.y);
        const xAxisData = data.valores.map(item => item.x);

        const option = {
            title: {
                text: 'Gráfico de Control'
            },
            tooltip: {
                trigger: 'axis'
            },
            grid: {
                left: '10%', // Aumenta el margen izquierdo si es necesario
                right: '15%', // Aumenta el margen derecho para que "Muestreo" no se corte
                bottom: '10%',
                containLabel: true // Asegura que las etiquetas no se corten
            },
            xAxis: {
                type: 'category',
                data: xAxisData, // Muestras en el eje X
                name: 'Muestreo', // Ajusta aquí si es necesario
                nameLocation: 'middle', // Coloca el nombre en el medio
                nameGap: 25 // Espacio entre el nombre y el eje
            },
            yAxis: {
                type: 'value',
                min: data.lic - 9,
                max: data.lsc + 9,
                name: 'Valor de la variable'
            },
            series: [
                {
                    name: 'Valores',
                    type: 'line',
                    data: values,
                    markLine: {
                        data: [
                            { yAxis: data.media, name: 'Media' },
                            {
                                yAxis: data.lsc,
                                name: 'LSC (Límite Superior)',
                                lineStyle: {
                                    color: '#ff4d4d', // Rojo para LSC
                                    type: 'dashed'
                                }
                            },
                            {
                                yAxis: data.lic,
                                name: 'LIC (Límite Inferior)',
                                lineStyle: {
                                    color: '#ff4d4d', // Rojo para LIC
                                    type: 'dashed'
                                }
                            }
                        ],
                        lineStyle: {
                            type: 'dashed'
                        }
                    }
                }
            ]
        };
        
        

        chart.setOption(option);
        checkForAnomalies(values, data);
    }

    // Función para verificar situaciones fuera de control
    function checkForAnomalies(values, data) {
        const anomalies = [];

        values.forEach((value, index) => {
            if (value > data.lsc || value < data.lic) {
                anomalies.push(`Punto ${index + 1} está fuera de control.`);
            }
        });

        if (anomalies.length > 0) {
            Swal.fire({
                title: '¡Alerta!',
                text: `Alerta: ${anomalies.join('\n')}`,
                icon: 'warning',
                confirmButtonText: 'Aceptar'
            });
        } else {
            console.log('No hay anomalías detectadas.');
        }
    }

    // Función para obtener los datos de la API y actualizar el gráfico
    function fetchAndRenderData(caseId) {
        fetch(`${apiUrlBase}${caseId}`)
            .then(response => response.json())
            .then(json => {
                if (json.success) {
                    initChart(json.data[0]);
                } else {
                    console.error('Error al obtener los datos:', json.messages);
                }
            })
            .catch(error => console.error('Error al cargar los datos:', error));
    }

    // Escuchar cambios en el selector y actualizar el gráfico
    caseSelector.addEventListener('change', (event) => {
        const selectedCase = event.target.value;
        fetchAndRenderData(selectedCase);
    });

    // Cargar el gráfico con el caso inicial (1)
    fetchAndRenderData(1);
});
