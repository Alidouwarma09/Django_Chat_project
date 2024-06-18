import React from 'react';
import './css/Popup.css'
import {MdSaveAlt} from "react-icons/md";
function Popup({ onSave }) {
    return (
        <div className="popup-container">
            <div className="popup-content" onClick={onSave}>
                <div className="popup-items"  >
                    <span style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}><MdSaveAlt  /></span>
                    <button className="popup-button save">Enregistrer</button>
                </div>
            </div>
        </div>

    );
}

export default Popup;
