// src/components/SymptomDiary.jsx
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

const SymptomDiary = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Realtime-подписка на изменения в Firestore
    const q = query(collection(db, 'symptomLogs'), orderBy('date', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const logs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEntries(logs);
      setLoading(false);
    }, (error) => {
      console.error('Ошибка realtime-подписки:', error);
      setLoading(false);
    });

    // Отписка при размонтировании
    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Удалить запись? Это действие нельзя отменить.')) {
      try {
        await deleteDoc(doc(db, 'symptomLogs', id));
        // Нет необходимости обновлять состояние — Firestore сам пришлёт обновление
      } catch (err) {
        console.error('Ошибка удаления:', err);
        alert('Не удалось удалить запись.');
      }
    }
  };

  return (
    <div className="diary-section">
      <h3>Мой дневник симптомов</h3>
      {loading ? (
        <p className="diary-info">Загрузка записей...</p>
      ) : entries.length === 0 ? (
        <p className="diary-info">Ещё нет записей. Добавьте первую!</p>
      ) : (
        <div className="diary-entries">
          {entries.map(entry => (
            <div key={entry.id} className="diary-entry">
              <div className="entry-date">{entry.date}</div>
              <div className="entry-symptoms">
                {entry.symptoms.join(', ')}
              </div>
              <div className="entry-meta">
                <span className="allergen-tag">{entry.allergen}</span>
                <span className="wellbeing-badge">Самочувствие: {entry.wellbeing}/10</span>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="delete-btn"
                  title="Удалить запись"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SymptomDiary;