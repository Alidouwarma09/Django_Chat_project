// Réponse.jsx
import React, {useEffect, useState} from 'react';

function Reponse({ onSubmit }) {
    const [texte, setTexte] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(texte);
        setTexte('');
    };
    return (
        <form onSubmit={handleSubmit} className="reponse-commentaire-section-footer">
            <input
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
