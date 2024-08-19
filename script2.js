// script2.js

const apiUrlScript2 = 'https://apidemo.geoeducacion.com.ar/api/testing/asistencia/1';

    var chart2 = echarts.init(document.getElementById('chart2'));

fetch(apiUrlScript2)
    .then(response => response.json())
    .then(responseData => {
        console.log(responseData);
        const estudiantes = responseData.data;

        // Verificar que el resultado sea un array válido de estudiantes
        if (!Array.isArray(estudiantes)) {
            throw new Error('El resultado de la API no contiene un array válido de estudiantes');
        }

        // Preparar los datos para el gráfico de barras
        const nivelesContados = estudiantes.reduce((acc, item) => {
            if (!acc[item.nivel]) {
                acc[item.nivel] = { presentes: 0, ausentes: 0 };
            }
            acc[item.nivel].presentes += item.presentes;
            acc[item.nivel].ausentes += item.ausentes;
            return acc;
        }, {});

        // Convertir a formato adecuado para el gráfico de barras
        const niveles = Object.keys(nivelesContados);
        const porcentajeAsistencia = niveles.map(nivel => {
            const { presentes, ausentes } = nivelesContados[nivel];
            return (presentes / (presentes + ausentes)) * 100;
        });

        // Configuración del gráfico 2
        var option2 = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: '{b}: {c}%' // Mostrar porcentaje en el tooltip
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
                    data: niveles, // Utiliza los niveles
                    axisTick: {
                        alignWithLabel: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}%' // Mostrar como porcentaje
                    }
                }
            ],
            series: [
                {
                    name: 'Asistencia',
                    type: 'bar',
                    barWidth: '60%',
                    data: porcentajeAsistencia // Porcentaje de asistencia
                }
            ]
        };

        // Establecer las opciones del gráfico 2
        if (option2 && typeof option2 === 'object') {
            chart2.setOption(option2);
        }

        // Ajustar el tamaño del gráfico al redimensionar la ventana
        window.addEventListener('resize', chart2.resize);
    })
    .catch(error => console.error('Error al cargar los datos:', error));
