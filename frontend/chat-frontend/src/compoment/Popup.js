import React from 'react';

function Popup({ onSave, onClose }) {
    return (
        <div className="popup">
            <div className="popup-content">
                <button onClick={onSave}>Enregistrer</button>
            </div>
        </div>
    );
}

export default Popup;
