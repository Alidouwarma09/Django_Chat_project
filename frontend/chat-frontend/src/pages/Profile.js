import React, { useEffect, useState } from 'react';
import './css/Profile.css';
import { IoChevronBackSharp } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import {CiEdit, CiUser} from "react-icons/ci";
import EditPopup from '../compoment/EditPopup';

const Profile = () => {
    const [userInfo, setUserInfo] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [currentField, setCurrentField] = useState({});

    useEffect(() => {
        const loadUserInfo = async () => {
            const storedUserInfo = localStorage.getItem('userInfo');
            if (storedUserInfo) {
                setUserInfo(JSON.parse(storedUserInfo));
            }
        };
        loadUserInfo();
    }, []);
    const handleGoBack = () => {
        window.history.back();
    };
    const handleEdit = (field, label) => {
        setCurrentField({ field, label, value: userInfo[field] });
        setIsEditing(true);
    };

    const handleSave = async (newValue) => {
        const updatedUserInfo = { ...userInfo, [currentField.field]: newValue };
        setUserInfo(updatedUserInfo);
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/Utilisateur/api/update_user/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userInfo.id,
                    field: currentField.field,
                    new_value: newValue,
                }),
            });

            const result = await response.json();
            if (!result.success) {
                console.error('Erreur lors de la mise à jour:', result.error);
            }
        } catch (error) {
            console.error('Erreur de connexion à l\'API:', error);

        }
    };

    return (
        <div className="profile-container">
            <header className="header2">
                <div className="header-content">
                    <IoChevronBackSharp onClick={handleGoBack} style={{ fontSize: 25 }} />
                    <h1>Profil utilisateur</h1>
                </div>
            </header>
            <div className="profile-info">
                <img
                    src={userInfo.image_utilisateu || 'default_image_path.jpg'}
                    alt="Profile"
                    className="profile-pic"
                />
                <div className="profile-details">
                    <div className="profile-item">
                        <CiUser />
                            <span className="label">Nom</span>
                        <span className="value">{userInfo.nom_utilisateur || 'Nom non défini'}</span>
                        <div className="note-container">
                            <p className="note">Ce n’est pas votre nom d’utilisateur. Ce nom sera visible par vos contacts chater.</p>
                            <CiEdit className="edit-icon"  onClick={() => handleEdit('nom_utilisateur', 'Nom')}/>
                        </div>
                    </div>
                    <div className="profile-item">
                        <CiUser />
                        <span className="label">Prénom</span>
                        <span className="value">{userInfo.prenom_utilisateur || 'Nom non défini'}</span>
                        <div className="note-container">
                            <p className="note">Ce n’est pas votre nom d’utilisateur. Ce nom sera visible par vos contacts chater.</p>
                            <CiEdit className="edit-icon" onClick={() => handleEdit('prenom_utilisateur', 'Prénom')} />
                        </div>
                    </div>
                    <div className="profile-item">
                        <FaPhone />
                        <span className="label">Téléphone</span>
                        <span className="value">+225 {userInfo.numero_utilisateur}</span>
                        <div className="note-container">
                            <p className="note">Ce est pas votre nom d’utilisateur.</p>
                            <CiEdit className="edit-icon" onClick={() => handleEdit('numero_utilisateur', 'Téléphone')} />
                        </div>
                    </div>
                    <div className="profile-item">
                        <span className="label">Infos</span>
                        <span className="value">En ligne le 07/03/2023</span>
                    </div>
                </div>
            </div>
            {isEditing &&
                <EditPopup
                    label={currentField.label}
                    value={currentField.value}
                    onSave={handleSave}
                    onClose={() => setIsEditing(false)}
                />
            }
        </div>
    );
}

export default Profile;
