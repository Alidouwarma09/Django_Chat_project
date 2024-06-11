import React, { useState } from 'react';
import './css/EditPopup.css';

const EditPopup = ({ label, value, onSave, onClose }) => {
    const [inputValue, setInputValue] = useState(value);

    const handleSave = () => {
        onSave(inputValue);
        onClose();
    };

    const handleInputChange = (e) => {
        let newValue = e.target.value;
        if (label === 'Téléphone') {
            // Supprimer tous les caractères non numériques
            newValue = newValue.replace(/\D/g, '');
        }
        setInputValue(newValue);
    };

    return (
        <div className="edit-popup-overlay">
            <div className="edit-popup">
                <h2>Changer le {label}</h2>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                />
                <div style={{display: "flex"}}>
                    <button className="bouton-enregistre" onClick={handleSave}>Enregistrer</button>
                    <button className="bouton-Annuler" onClick={onClose}>Annuler</button>
                </div>
            </div>
        </div>
    );
};

export default EditPopup;
