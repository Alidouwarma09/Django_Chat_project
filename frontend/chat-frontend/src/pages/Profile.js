import React from 'react';
import './css/Profile.css';

const Profile = () => {
    return (
        <div className="profile-container">
            <header className="header">
                <button className="back-button">&lt;</button>
                <h1>Profil</h1>
                <div className="header-spacer"></div>
            </header>
            <div className="profile-info">
                <img src="path_to_image.jpg" alt="Profile" className="profile-pic" />
                <div className="profile-details">
                    <div className="profile-item">
                        <span className="label">Nom</span>
                        <span className="value">@D_wally09</span>
                        <p className="note">Ce n’est pas votre nom d’utilisateur·ice ni votre code PIN. Ce nom sera visible par vos contacts WhatsApp.</p>
                    </div>
                    <div className="profile-item">
                        <span className="label">Infos</span>
                        <span className="value">En ligne le 07/03/2023</span>
                    </div>
                    <div className="profile-item">
                        <span className="label">Téléphone</span>
                        <span className="value">+225 0789817277</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
