import React, { useState } from 'react';
import axios from 'axios';

const Inscription = () => {
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [telephone, setTelephone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Les mots de passe ne correspondent pas.');
            return;
        }
        const formData = new FormData();
        formData.append('nom', nom);
        formData.append('prenom', prenom);
        formData.append('username', telephone);
        formData.append('password1', password);
        formData.append('password2', confirmPassword);
        if (image) {
            formData.append('image', image);
        }
        try {
            const response = await axios.post('/api/inscription', formData);
            if (response.data.success) {
                alert('Inscription réussie');
                // Redirection ou mise à jour de l'état ici
            }
        } catch (error) {
            alert('Une erreur est survenue lors de l\'inscription.');
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            setImage(e.target.files[0]);
        }
    };

    return (
        <div className="login-card-container">
            {/* ... */}
            <form onSubmit={handleSubmit} className="login-card-form" encType="multipart/form-data">
                {/* ... */}
                <input type="text" placeholder="Nom" required value={nom} onChange={(e) => setNom(e.target.value)} />
                <input type="text" placeholder="Prénom" required value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                <input type="number" placeholder="Téléphone" required value={telephone} onChange={(e) => setTelephone(e.target.value)} />
                <input type="password" placeholder="Mot de passe" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <input type="password" placeholder="Confirmé" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {/* ... */}
                <button type="submit">S'inscrire</button>
            </form>
            {/* ... */}
        </div>
    );
};

export default Inscription;
