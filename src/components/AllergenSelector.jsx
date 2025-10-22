// src/components/AllergenSelector.jsx
import React, { useState, useRef, useEffect } from 'react';
import './AllergenSelector.css';

const AllergenSelector = ({ allergensData, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedAllergen = allergensData.find(a => a.key === selected);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (key) => {
    onChange(key);
    setIsOpen(false);
  };

  // Закрытие при клике вне
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select" ref={dropdownRef}>
      <div className="select-header" onClick={toggleDropdown}>
        {selectedAllergen && (
          <>
            <span>{selectedAllergen.name}</span>
            <img src={selectedAllergen.image} alt={selectedAllergen.name} className="allergen-img" />
          </>
        )}
        <span className="arrow">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <ul className="select-options">
          {allergensData.map((allergen) => (
            <li
              key={allergen.key}
              className="select-option"
              onClick={() => handleSelect(allergen.key)}
            >
              <span>{allergen.name}</span>
              <img src={allergen.image} alt={allergen.name} className="allergen-img" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AllergenSelector;