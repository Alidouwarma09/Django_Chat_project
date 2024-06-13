import React from 'react';
import './css/Popup.css'
function Popup({ onSave, onClose }) {
    return (
            <div className="popup-content">
                <div className="popup-buttons">
                    <button className="popup-button save" onClick={onSave}>Enregistrer</button>
                </div>
            </div>
    );
}

export default Popup;
