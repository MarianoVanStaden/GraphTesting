const apiUrlScript1 = 'https://apidemo.geoeducacion.com.ar/api/testing/estudiantes/1';
var chart1 = echarts.init(document.getElementById('chart1'));

fetch(apiUrlScript1)
    .then(response => response.json())
    .then(responseData => {
        const estudiantes = responseData.data;

        if (!Array.isArray(estudiantes)) {
            throw new Error('El resultado de la API no contiene un array válido de estudiantes');
        }

        // Contar las ocurrencias de cada nivel
        const nivelesContados = estudiantes.reduce((acc, item) => {
            acc[item.nivel] = (acc[item.nivel] || 0) + 1;
            return acc;
        }, {});

        // Convertir a formato adecuado para ECharts
        const chartData = Object.entries(nivelesContados).map(([name, value]) => ({
            name, value
        }));

        var option1 = {
            tooltip: {
                trigger: 'item'
            },
            legend: {
                top: '5%',
                left: 'center'
            },
            series: [
                {
                    name: 'Niveles',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: false,
                        position: 'center'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 40,
                            fontWeight: 'bold'
                        }
                    },
                    labelLine: {
                        show: false
                    },
                    data: chartData
                }
            ]
        };

        chart1.setOption(option1);

        window.addEventListener('resize', chart1.resize);
    })
    .catch(error => console.log(error));
