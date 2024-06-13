import React from 'react';
import './css/Popup.css'
import {MdSaveAlt} from "react-icons/md";
import {IoMdClose} from "react-icons/io";
function Popup({ onSave, onClose }) {
    return (
        <div className="popup-container">
            <div className="popup-content">
                <div className="popup-items"  onClick={onSave}>
                    <span style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}><MdSaveAlt  /></span>
                    <button className="popup-button save">Enregistrer</button>
                </div>
                <div onClick={onClose} style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}><IoMdClose /></div>
            </div>
        </div>

    );
}

export default Popup;
