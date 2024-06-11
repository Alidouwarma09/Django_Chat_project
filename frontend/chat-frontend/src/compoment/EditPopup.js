import React, { useState } from 'react';
import './css/EditPopup.css';

const EditPopup = ({ label, value, onSave, onClose }) => {
    const [inputValue, setInputValue] = useState(value);

    const handleSave = () => {
        onSave(inputValue);
        onClose();
    };

    return (
        <div className="edit-popup-overlay">
            <div className="edit-popup">
                <h2>Modifier {label}</h2>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
                <button onClick={handleSave}>OK</button>
                <button onClick={onClose}>Annuler</button>
            </div>
        </div>
    );
};

export default EditPopup;
