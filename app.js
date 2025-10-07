// Создаем карту
var mymap = L.map('mapid').setView([55.75, 37.6], 4);

// Базовая плитка (карта)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(mymap);

// Функция для добавления зон риска
function addRiskZone(latlng, color) {
    var circle = L.circle(latlng, {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: 500000 // Радиус круга в метрах
    }).addTo(mymap);
}

// Примеры добавления зон риска
addRiskZone([55.75, 37.6], 'red'); // Москва
addRiskZone([59.93, 30.31], 'orange'); // Санкт-Петербург
addRiskZone([56.83, 60.60], 'yellow'); // Екатеринбург