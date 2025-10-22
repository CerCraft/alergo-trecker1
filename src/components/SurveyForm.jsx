// src/components/SurveyForm.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const SurveyForm = ({ onRecommend, selectedPlant, selectedCity }) => {
  const [symptoms, setSymptoms] = useState({
    sneezing: false,
    runnyNose: false,
    itchyEyes: false,
    cough: false,
    skinRash: false,
    headache: false,
    fatigue: false,
    shortnessOfBreath: false,
  });
  const [wellbeing, setWellbeing] = useState(5); // 1–10

  const toggleSymptom = (key) => {
    setSymptoms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Генерация умной рекомендации
  const generateRecommendation = () => {
    const month = new Date().getMonth() + 1;
    const selectedSymptomKeys = Object.keys(symptoms).filter(k => symptoms[k]);
    const symptomCount = selectedSymptomKeys.length;

    if (symptomCount === 0) {
      return "Вы не указали симптомы. Если чувствуете недомогание — не игнорируйте его.";
    }

    // Сезонные подсказки
    let seasonAdvice = "";
    if (['birch', 'alder', 'hazel', 'oak', 'pine'].includes(selectedPlant) && month >= 4 && month <= 6) {
      seasonAdvice = "Сейчас пик цветения деревьев. Старайтесь не проветривать квартиру утром и вечером.";
    } else if (['grass', 'timothy', 'ryegrass'].includes(selectedPlant) && month >= 5 && month <= 7) {
      seasonAdvice = "Цветут злаки. После прогулок меняйте одежду и промывайте нос.";
    } else if (['weed', 'ragweed', 'mugwort'].includes(selectedPlant) && month >= 7 && month <= 9) {
      seasonAdvice = "Активна пыльца сорняков. Используйте очки и маску на улице.";
    }

    // Симптом-ориентированные советы
    let symptomAdvice = "";
    if (symptoms.itchyEyes) {
      symptomAdvice += "Промывайте глаза прохладной водой или используйте антигистаминные капли. ";
    }
    if (symptoms.sneezing || symptoms.runnyNose) {
      symptomAdvice += "Промывание носа солевым раствором снижает симптомы на 40%. ";
    }
    if (symptoms.skinRash) {
      symptomAdvice += "Избегайте горячей воды и синтетической одежды. ";
    }
    if (wellbeing <= 3) {
      symptomAdvice += "Ваше самочувствие низкое. Рассмотрите приём антигистаминных средств. ";
    }

    return `${seasonAdvice} ${symptomAdvice}Запись добавлена в ваш дневник.`.trim();
  };

  const handleSubmit = async () => {
    const selectedSymptomNames = Object.entries(symptoms)
      .filter(([_, v]) => v)
      .map(([k, _]) => {
        const map = {
          sneezing: 'Чихание',
          runnyNose: 'Насморк',
          itchyEyes: 'Зуд в глазах',
          cough: 'Кашель',
          skinRash: 'Высыпания',
          headache: 'Головная боль',
          fatigue: 'Усталость',
          shortnessOfBreath: 'Одышка'
        };
        return map[k] || k;
      });

    if (selectedSymptomNames.length === 0) {
      alert('Выберите хотя бы один симптом');
      return;
    }

    // Сохраняем в Firestore
    try {
      const logData = {
        date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        symptoms: selectedSymptomNames,
        allergen: selectedPlant,
        city: selectedCity,
        wellbeing: wellbeing,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, 'symptomLogs'), logData);
      const rec = generateRecommendation();
      onRecommend(rec);
    } catch (err) {
      console.error('Ошибка сохранения:', err);
      alert('Не удалось сохранить запись. Проверьте подключение.');
    }
  };

  return (
    <div className="survey-form">
      <h3>Как вы себя чувствуете сегодня?</h3>

      <div className="wellbeing-slider">
        <label>Самочувствие: {wellbeing}/10</label>
        <input
          type="range"
          min="1"
          max="10"
          value={wellbeing}
          onChange={(e) => setWellbeing(Number(e.target.value))}
          className="slider"
        />
      </div>

      <div className="symptoms-column">
        {Object.entries({
          sneezing: 'Чихание',
          runnyNose: 'Насморк',
          itchyEyes: 'Зуд в глазах',
          cough: 'Кашель',
          skinRash: 'Высыпания на коже',
          headache: 'Головная боль',
          fatigue: 'Усталость',
          shortnessOfBreath: 'Одышка',
        }).map(([key, label]) => (
          <label key={key} className="symptom-item">
            <input
              type="checkbox"
              checked={symptoms[key]}
              onChange={() => toggleSymptom(key)}
            />
            <span className="checkmark"></span>
            <span className="symptom-label">{label}</span>
          </label>
        ))}
      </div>

      <button onClick={handleSubmit} className="recommend-btn">
        Сохранить и получить совет
      </button>
    </div>
  );
};

export default SurveyForm;