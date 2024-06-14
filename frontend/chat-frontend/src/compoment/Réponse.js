// Réponse.jsx
import React, { useState, useEffect, useRef } from 'react'; // Importez useRef depuis React

function Reponse({ onSubmit, onClose }) {
    const [texte, setTexte] = useState('');
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(texte);
        setTexte('');
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="reponse-commentaire-section-footer" ref={ref}>
            <input
                onClick={(e) => e.stopPropagation()}
                name="texte"
                type="text"
                className="comment-input"
                placeholder="Ajouter une réponse..."
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
            />
            <button className="submit-button" type="submit">Envoyer</button>
        </form>
    );
}

export default Reponse;
