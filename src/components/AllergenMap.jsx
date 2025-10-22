// src/components/AllergenMap.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Упрощённые SVG-пути для регионов России (масштабированы под viewBox="0 0 1000 600")
const REGIONS_SVG = {
  moscow: "M420,180 L430,175 L440,180 L435,190 L425,190 Z",
  saintPetersburg: "M400,100 L410,95 L420,100 L415,110 L405,110 Z",
  ekaterinburg: "M520,220 L540,210 L550,225 L540,240 L520,235 Z",
  novosibirsk: "M620,240 L640,230 L650,245 L640,260 L620,255 Z",
  rostov: "M480,320 L500,310 L510,325 L500,340 L480,335 Z",
  sochi: "M500,360 L515,350 L525,360 L515,370 L500,370 Z",
  kazan: "M490,230 L510,220 L520,235 L510,250 L490,245 Z",
  vladivostok: "M800,260 L820,250 L830,265 L820,280 L800,275 Z",
  kaliningrad: "M320,180 L335,170 L345,180 L335,190 L320,190 Z",
};

const REGION_NAMES = {
  moscow: 'Москва',
  saintPetersburg: 'Санкт-Петербург',
  ekaterinburg: 'Екатеринбург',
  novosibirsk: 'Новосибирск',
  rostov: 'Ростов-на-Дону',
  sochi: 'Сочи',
  kazan: 'Казань',
  vladivostok: 'Владивосток',
  kaliningrad: 'Калининград',
};

export default function AllergenMap({ plant, selectedCity }) {
  const [regionStatus, setRegionStatus] = useState({});

  useEffect(() => {
    const checkRegions = async () => {
      const status = {};
      const today = new Date();
      const currentMonth = today.getMonth() + 1;

      for (const cityKey of Object.keys(REGION_NAMES)) {
        try {
          const q = query(
            collection(db, 'allergens'),
            where('city', '==', cityKey),
            where('plant', '==', plant)
          );
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const data = snapshot.docs[0].data();
            const startMonth = parseInt(data.seasonStart.split('-')[0]);
            const endMonth = parseInt(data.seasonEnd.split('-')[0]);
            const inSeason = currentMonth >= startMonth && currentMonth <= endMonth;
            status[cityKey] = inSeason ? 'active' : 'inactive';
          } else {
            status[cityKey] = 'no-data';
          }
        } catch (err) {
          console.error(`Ошибка для ${cityKey}:`, err);
          status[cityKey] = 'error';
        }
      }

      setRegionStatus(status);
    };

    checkRegions();
  }, [plant]);

  const getFillColor = (cityKey) => {
    if (cityKey === selectedCity) return '#FF4136'; // выбранный — красный
    switch (regionStatus[cityKey]) {
      case 'active': return '#FF851B';
      case 'inactive': return '#BDC3C7';
      default: return '#ECF0F1';
    }
  };

  return (
    <div className="map-container">
      <h3>Карта зон риска по России</h3>
      <div className="svg-wrapper">
        <svg viewBox="0 0 1000 600" xmlns="http://www.w3.org/2000/svg" className="russia-svg">
          {/* Фон карты */}
          <rect width="1000" height="600" fill="#f0f4f8" />

          {/* Регионы */}
          {Object.entries(REGIONS_SVG).map(([cityKey, path]) => (
            <g key={cityKey}>
              <path
                d={path}
                fill={getFillColor(cityKey)}
                stroke="#95a5a6"
                strokeWidth="1"
                className="region-path"
              />
              <title>{REGION_NAMES[cityKey]} — {regionStatus[cityKey] === 'active' ? 'в сезоне' : 'вне сезона'}</title>
            </g>
          ))}

          {/* Подписи */}
          {Object.entries(REGIONS_SVG).map(([cityKey, _], i) => {
            const names = Object.keys(REGIONS_SVG);
            const x = [380, 370, 530, 630, 470, 490, 500, 790, 310][i];
            const y = [160, 80, 200, 220, 300, 340, 210, 240, 160][i];
            return (
              <text
                key={cityKey}
                x={x}
                y={y}
                className="region-label"
                fill="#2c3e50"
              >
                {REGION_NAMES[cityKey]}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="map-legend">
        <div><span className="dot active"></span> В сезоне</div>
        <div><span className="dot selected"></span> Ваш город</div>
        <div><span className="dot inactive"></span> Вне сезона</div>
      </div>
    </div>
  );
}