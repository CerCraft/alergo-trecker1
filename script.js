document.addEventListener('DOMContentLoaded', function() {
    // Данные по аллергенам
    const allergensData = {
        birch: {   // берёза
            dates: ["2023-05-01", "2023-05-02", "2023-05-03"],
            levels: ["low", "medium", "high"]
        },
        alder: {   // ольха
            dates: ["2023-05-01", "2023-05-02", "2023-05-03"],
            levels: ["low", "high", "low"]
        }
        // Другие аллергены тут
    };

    let currentAllergen = null; // Текущий выбранный аллерген

    // Функция рисования графика на основании выбранных данных
    function drawGraph(data) {
        Highcharts.chart("danger-level-graph", {
            chart: {
                type: "line",
                zoomType: "xy"
            },
            title: {
                text: `${data.name || ""}` + " Уровень аллергена"
            },
            xAxis: {
                categories: data.dates,
                labels: {
                    rotation: -45,
                    style: {
                        fontSize: "13px",
                        fontFamily: "Verdana, sans-serif"
                    }
                }
            },
            yAxis: {
                title: {
                    text: "Уровень аллергена"
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: "#808080"
                }]
            },
            series: [
                {
                    name: "Уровень аллергена",
                    data: data.levels.map(level => ({
                        y: level === "low" ? 1 : level === "medium" ? 2 : 3
                    }))
                }
            ]
        });
    }

    // Открытие и закрытие выпадающего списка
    document.querySelector(".dropbtn").addEventListener("click", function(event) {
        event.preventDefault();
        this.nextElementSibling.classList.toggle("show");
    });

    // Выбор аллергена
    document.querySelectorAll("#select-allergens .dropdown-content a").forEach((item) => {
        item.addEventListener("click", function(e) {
            e.preventDefault(); // Отменяем стандартное поведение ссылок
            
            // Получение нового текущего аллергена
            const selectedValue = this.dataset.value;
            if (!selectedValue) return;

            // Закрываем выпадающий список
            document.querySelector(".dropdown-content").classList.remove("show");

            // Обновляем заголовок кнопки с названием аллергена
            document.querySelector(".dropbtn").innerText = this.textContent.trim();

            // Если новый аллерген отличается от предыдущего — обновляем график
            if (currentAllergen !== selectedValue) {
                currentAllergen = selectedValue;
                drawGraph(allergensData[currentAllergen]);
            }
        });
    });

    // Изначально показываем график березы
    drawGraph(allergensData["birch"]);
});
document.addEventListener('DOMContentLoaded', function() {
    // Уже существующий код ...

    // Новые переменные для хранения блоков опроса и результата
    const form = document.getElementById('allergy-form');
    const recommendationsOutput = document.getElementById('recommendations-output');

    // Карта рекомендаций в зависимости от ответов
    const recommendationMap = {
        насморк: 'Регулярное промывание носа солевым раствором.',
        заложенность_носа: 'Принимайте антигистаминные средства согласно инструкции.',
        слезоточивость: 'Используйте увлажняющие капли для глаз.',
        до_18: 'Родителям рекомендуется консультация педиатра.',
        18_45: '', // пустая строка, поскольку для средней возрастной группы особых рекомендаций нет
        старше_45: 'Рекомендуется обратиться к специалисту для профилактики осложнений.',
        астма: 'Необходимо избегать контакта с аллергенами и держать под рукой ингалятор.',
        нет: ''
    };

    // Обработка отправки формы
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // предотвращаем перезагрузку страницы

        // Читаем введённые данные
        const symptoms = Array.from(document.querySelectorAll('[name="symptoms[]"]')).filter(el => el.checked).map(el => el.value);
        const ageGroup = document.querySelector('input[name="age_group"]:checked').value;
        const healthStatus = document.querySelector('input[name="health_status"]:checked').value;

        // Формируем список рекомендаций
        const recommendations = [];

        // Проходим по симптомам и формируем рекомендации
        symptoms.forEach(symptom => {
            recommendations.push(recommendationMap[symptom]);
        });

        // Добавляем рекомендации по возрасту и состоянию здоровья
        recommendations.push(recommendationMap[ageGroup]);
        recommendations.push(recommendationMap[healthStatus]);

        // Чистим область вывода старых рекомендаций
        recommendationsOutput.innerHTML = '';

        // Выводим итоговые рекомендации
        if (recommendations.length > 0) {
            recommendationsOutput.innerHTML = '<strong>Ваш персональный план действий:</strong>';
            recommendations.forEach(r => {
                recommendationsOutput.innerHTML += `<p>- ${r}</p>`;
            });
        } else {
            recommendationsOutput.innerHTML = '<p>По вашим данным пока нет рекомендаций.</p>';
        }
    });
});