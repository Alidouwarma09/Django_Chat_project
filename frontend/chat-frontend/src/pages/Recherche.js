import React, { useState } from 'react';
import './css/SearchInterface.css';
import { IoIosArrowBack } from "react-icons/io";

const SearchInterface = () => {
    const [searchTerm, setSearchTerm] = useState("");

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };
    const handleGoBack = () => {
        window.history.back();
    };
    return (
        <div className="search-container">
            <div className="search-header">
                <IoIosArrowBack onClick={handleGoBack} className="back-icon" />
                <h1>Rechercher</h1>
            </div>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Que cherchez-vous ?"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="search-tabs">
                <button className="tab active">Utilisateur</button>
                <button className="tab">Publication</button>
                <button className="tab">Videos</button>
                <button className="tab">Services</button>
                <button className="tab">Posts</button>
            </div>
            <div className="search-content">
                <p>⏰ Les plus recherché</p>
                <h2>Recherché par catégorie</h2>
                <ul className="category-list">
                    <li>Informations du 20 nov</li>
                    <li>La video publier par x</li>
                    <li>publication</li>
                </ul>
            </div>
        </div>
    );
};

export default SearchInterface;
