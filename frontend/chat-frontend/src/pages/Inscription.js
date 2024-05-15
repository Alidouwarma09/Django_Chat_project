import React, { useState, useRef } from 'react';
import axios from 'axios';
import './css/insciption.css'
import Chater_logo from "./icons/chater_logo.png";
import {Link} from "react-router-dom";
import { TbCameraPlus } from "react-icons/tb";

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
            const response = await axios.post(`${process.env.REACT_APP_API_URL}Utilisateur/api/inscription/`, formData);
            if (response.data.success) {
                alert('Inscription réussie');
            }
        } catch (error) {
            alert('Une erreur est survenue lors de l\'inscription.');
        }
    };

const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            setImage(e.target.files[0]);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };
    return (
        <div className="contenu_inscription">
                <div className="login-card-container">
                    <div className="login-card">
                        <div className="login-card-logo">
                            <img src={Chater_logo} alt="chater_logo" style={{width: '50px'}}/>
                        </div>
                        <div className="login-card-header">
                            <h1>Inscription</h1>
                        </div>
                        <form onSubmit={handleSubmit} className="login-card-form" encType="multipart/form-data">
                            <div className="form-item image-upload-container">
                                {imagePreview &&
                                    <img src={imagePreview} alt="Prévisualisation" className="image-preview"/>}
                                <TbCameraPlus className="upload-icon" onClick={triggerFileInput} />
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                            </div>
                            <div className="form-item">
                                <span className="form-item-icon material-symbols-rounded">person</span>
                                <input type="text" placeholder="Nom" required value={nom}
                                       onChange={(e) => setNom(e.target.value)}/>
                            </div>
                            <div className="form-item">
                                <span className="form-item-icon material-symbols-rounded">person</span>
                                <input type="text" placeholder="Prénom" required value={prenom}
                                       onChange={(e) => setPrenom(e.target.value)}/>
                            </div>
                            <div className="form-item">
                                <span className="form-item-icon material-symbols-rounded">phone</span>
                                <input type="number" placeholder="Téléphone" required value={telephone}
                                       onChange={(e) => setTelephone(e.target.value)}/>
                            </div>
                            <div className="form-item">
                                <span className="form-item-icon material-symbols-rounded">lock</span>
                                <input type="password" placeholder="Mot de passe" required value={password}
                                       onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                            <div className="form-item">
                                <span className="form-item-icon material-symbols-rounded">lock</span>
                                <input type="password" placeholder="Confirmé" required value={confirmPassword}
                                       onChange={(e) => setConfirmPassword(e.target.value)}/>
                            </div>
                            <button className="inscription-button" type="submit">S'inscrire</button>
                        </form>
                        <div className="login-card-footer">
                            Je n'ai pas de compte <Link to="/connexion">S'inscrire ?</Link>
                        </div>
                    </div>
                </div>
        </div>

    );
};

export default Inscription;
