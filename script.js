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
                left: '10%',
                right: '15%',
                bottom: '10%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: xAxisData,
                name: 'Muestreo',
                nameLocation: 'middle',
                nameGap: 25
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
                                name: 'Límite Superior (LSC)',
                                lineStyle: {
                                    color: '#ff4d4d',
                                    type: 'dashed'
                                }
                            },
                            {
                                yAxis: data.lic,
                                name: 'Límite Inferior (LIC)',
                                lineStyle: {
                                    color: '#ff4d4d',
                                    type: 'dashed'
                                }
                            },
                            {
                                yAxis: data.media + 6,
                                name: 'Límite Superior 2-sigma',
                                lineStyle: {
                                    color: '#ffcc00',
                                    type: 'dashed'
                                }
                            },
                            {
                                yAxis: data.media - 6,
                                name: 'Límite Inferior 2-sigma',
                                lineStyle: {
                                    color: '#ffcc00',
                                    type: 'dashed'
                                }
                            },
                            {
                                yAxis: data.media + 3,
                                name: 'Límite Superior 1-sigma',
                                lineStyle: {
                                    color: '#66cc66',
                                    type: 'dashed'
                                }
                            },
                            {
                                yAxis: data.media - 3,
                                name: 'Límite Inferior 1-sigma',
                                lineStyle: {
                                    color: '#66cc66',
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
        let pointsAboveLSC = 0;
        let pointsBelowLIC = 0;
        let consecutiveAbove = 0;
        let consecutiveBelow = 0;

        // Verificación de condiciones
        values.forEach(value => {
            if (value > data.lsc) {
                pointsAboveLSC++;
            } else if (value < data.lic) {
                pointsBelowLIC++;
            }

            // Verificar 8 puntos en el mismo lado respecto a la media
            if (value > data.media) {
                consecutiveAbove++;
                consecutiveBelow = 0; // Reiniciar contador de puntos por debajo
                if (consecutiveAbove >= 8) {
                    anomalies.push('8 puntos consecutivos por encima de la media (normal).');
                }
            } else if (value < data.media) {
                consecutiveBelow++;
                consecutiveAbove = 0; // Reiniciar contador de puntos por encima
                if (consecutiveBelow >= 8) {
                    anomalies.push('8 puntos consecutivos por debajo de la media (normal).');
                }
            } else {
                consecutiveAbove = 0; // Reiniciar contador si está dentro
                consecutiveBelow = 0; // Reiniciar contador si está dentro
            }
        });

        // Verificar condiciones de alerta
        if (pointsAboveLSC > 0) {
            anomalies.push('Valores fuera del Límite Superior (LSC).');
        }
        if (pointsBelowLIC > 0) {
            anomalies.push('Valores fuera del Límite Inferior (LIC).');
        }

        // Verificar 2 de 3 puntos fuera de 2-sigma
        const pointsOutside2Sigma = values.filter(value => value > data.media + 6 || value < data.media - 6);
        if (pointsOutside2Sigma.length >= 2) {
            anomalies.push('Tendencia fuera de control: 2 de 3 puntos fuera de 2-sigma.');
        }

        // Verificar 4 de 5 puntos fuera de sigma
        const pointsOutsideSigma = values.filter(value => value > data.media + 3 || value < data.media - 3);
        if (pointsOutsideSigma.length >= 4) {
            anomalies.push('Tendencia fuera de control: 4 de 5 puntos fuera de sigma.');
        }

        // Mostrar alertas si hay anomalías
        if (anomalies.length > 0) {
            Swal.fire({
                title: '¡Alerta!',
                text: `Condiciones fuera de control detectadas:\n${anomalies.join('\n')}`,
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
