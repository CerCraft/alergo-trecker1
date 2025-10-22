// src/App.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import SurveyForm from './components/SurveyForm';
import SymptomDiary from './components/SymptomDiary';
import './App.css';

// === 30 АЛЛЕРГЕНОВ ===
const ALLERGENS = [
  { key: 'birch', name: 'Берёза', icon: '🌳' },
  { key: 'alder', name: 'Ольха', icon: '🌲' },
  { key: 'hazel', name: 'Лещина', icon: '🌿' },
  { key: 'oak', name: 'Дуб', icon: '🌳' },
  { key: 'pine', name: 'Сосна', icon: '🌲' },
  { key: 'grass', name: 'Злаки', icon: '🌾' },
  { key: 'timothy', name: 'Пырей', icon: '🌾' },
  { key: 'ryegrass', name: 'Райграс', icon: '🌾' },
  { key: 'fescue', name: 'Овсяница', icon: '🌾' },
  { key: 'wheat', name: 'Пшеница', icon: '🌾' },

  { key: 'ragweed', name: 'Амброзия', icon: '🌼' },
  { key: 'mugwort', name: 'Полынь', icon: '🌿' },
  { key: 'nettle', name: 'Крапива', icon: '🌿' },
  { key: 'plantain', name: 'Подорожник', icon: '🌿' },






 
  
];

// === 40 ГОРОДОВ РОССИИ ===
const CITIES = [
  { key: 'moscow', name: 'Москва' },
  { key: 'saint_petersburg', name: 'Санкт-Петербург' },
  { key: 'ekaterinburg', name: 'Екатеринбург' },
  { key: 'novosibirsk', name: 'Новосибирск' },
  { key: 'kazan', name: 'Казань' },
  { key: 'rostov_on_don', name: 'Ростов-на-Дону' },
  { key: 'sochi', name: 'Сочи' },
  { key: 'vladivostok', name: 'Владивосток' },
  { key: 'kaliningrad', name: 'Калининград' },
  { key: 'nizhny_novgorod', name: 'Нижний Новгород' },
  { key: 'chelyabinsk', name: 'Челябинск' },
  { key: 'samara', name: 'Самара' },
  { key: 'omsk', name: 'Омск' },
  { key: 'perm', name: 'Пермь' },
  { key: 'ufa', name: 'Уфа' },
  { key: 'krasnoyarsk', name: 'Красноярск' },
  { key: 'voronezh', name: 'Воронеж' },
  { key: 'volgograd', name: 'Волгоград' },
  { key: 'krasnodar', name: 'Краснодар' },
  { key: 'saratov', name: 'Саратов' },
  { key: 'tyumen', name: 'Тюмень' },
  { key: 'toliatti', name: 'Тольятти' },
  { key: 'izhevsk', name: 'Ижевск' },
  { key: 'barnaul', name: 'Барнаул' },
  { key: 'ulan_ude', name: 'Улан-Удэ' },
  { key: 'irkutsk', name: 'Иркутск' },
  { key: 'khabarovsk', name: 'Хабаровск' },
  { key: 'yaroslavl', name: 'Ярославль' },
  { key: 'vladimir', name: 'Владимир' },
  { key: 'mahachkala', name: 'Махачкала' },
  { key: 'tomsk', name: 'Томск' },
  { key: 'orenburg', name: 'Оренбург' },
  { key: 'kemerovo', name: 'Кемерово' },
  { key: 'novokuznetsk', name: 'Новокузнецк' },
  { key: 'ryazan', name: 'Рязань' },
  { key: 'astrakhan', name: 'Астрахань' },
  { key: 'penza', name: 'Пенза' },
  { key: 'lipetsk', name: 'Липецк' },
  { key: 'tula', name: 'Тула' },
  { key: 'cheboksary', name: 'Чебоксары' },
];

function getPollenLevel(seasonStart, seasonEnd, peakDate, targetDate) {
  const now = new Date(targetDate).getTime();
  const start = new Date(seasonStart).getTime();
  const end = new Date(seasonEnd).getTime();
  const peak = new Date(peakDate).getTime();
  if (now < start || now > end) return 0;
  if (now <= peak) {
    const progress = (now - start) / (peak - start);
    return Math.min(100, Math.round(20 + progress * 80));
  } else {
    const progress = (now - peak) / (end - peak);
    return Math.max(0, Math.round(100 - progress * 80));
  }
}

export default function App() {
  const [selectedPlant, setSelectedPlant] = useState('birch');
  const [selectedCity, setSelectedCity] = useState('moscow');
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState('');

  const currentAllergen = ALLERGENS.find(a => a.key === selectedPlant) || ALLERGENS[0];

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'allergens'),
          where('city', '==', selectedCity),
          where('plant', '==', selectedPlant)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setForecast([]);
          setLoading(false);
          return;
        }

        const doc = snapshot.docs[0].data();
        const today = new Date();
        let year = today.getFullYear();
        if (today > new Date(`${year}-${doc.seasonEnd}`)) year++;

        const start = `${year}-${doc.seasonStart}`;
        const end = `${year}-${doc.seasonEnd}`;
        const peak = `${year}-${doc.peakDate}`;

        const data = [];
        for (let i = 0; i < 14; i++) {
          const date = new Date(today);
          date.setDate(today.getDate() + i);
          const dateStr = date.toISOString().split('T')[0];
          const level = getPollenLevel(start, end, peak, dateStr);
          data.push({ date: dateStr, level });
        }
        setForecast(data);
      } catch (err) {
        console.error('Ошибка загрузки:', err);
        setForecast([]);
      }
      setLoading(false);
    };

    load();
  }, [selectedPlant, selectedCity]);

  return (
    <div className="app">
      <header className="header">
        <h1>Аллерго-Трекер</h1>
        
      </header>

      <div className="select-container">
        <div className="select-group">
          <label className="select-label">Аллерген</label>
          <select
            value={selectedPlant}
            onChange={(e) => setSelectedPlant(e.target.value)}
            className="custom-select"
          >
            {ALLERGENS.map(a => (
              <option key={a.key} value={a.key}>
                {a.icon} {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="select-group">
          <label className="select-label">Город</label>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="custom-select"
          >
            {CITIES.map(c => (
              <option key={c.key} value={c.key}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="graph-section">
        <h2>Прогноз на 14 дней: {currentAllergen.name}</h2>
        {loading ? (
          <p className="loading-text">Загрузка данных...</p>
        ) : (
          <div className="graph">
            <div className="bars">
              {forecast.map((day, i) => (
                <div key={i} className="bar-container">
                  <div className="bar"></div>
                  <div className="date">{day.date.slice(5)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ДНЕВНИК СИМПТОМОВ */}
      <SymptomDiary />

      {/* ОПРОС С СОХРАНЕНИЕМ */}
      <SurveyForm
        onRecommend={setRecommendation}
        selectedPlant={selectedPlant}
        selectedCity={selectedCity}
      />

      {/* РЕКОМЕНДАЦИИ */}
      {recommendation && (
        <div className="recommendation-box">
          <h3>Персонализированная рекомендация</h3>
          <p>{recommendation}</p>
        </div>
      )}
    </div>
  );
}