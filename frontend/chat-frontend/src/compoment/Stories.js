import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdLibraryAdd } from 'react-icons/md';
import './css/stories.css';

function Stories() {
    const [stories, setStories] = useState([]);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/stories/`);
            setStories(response.data);
        } catch (error) {
            console.error('Erreur lors du chargement des stories:', error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
            console.log('File selected:', selectedFile);
            console.log('Preview URL:', objectUrl);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/Utilisateur/api/stories/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${token}`
                }
            });
            setStories([response.data, ...stories]);
            setFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la story:', error);
        }
    };

    return (
        <div>
            <div className="stories-container">
                <div className="story" style={{ backgroundColor: "gray", height: 150 }}>
                    <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="upload-story" />
                    <label htmlFor="upload-story">
                        <MdLibraryAdd style={{ width: "60%", height: "100%" }} />
                        <div className="author" style={{ fontSize: 10 }}>Ajouter une story</div>
                    </label>
                </div>
                {stories.map(story => (
                    <div key={story.id} className="story">
                        {story.media.endsWith('.mp4') ? (
                            <video src={story.media} controls />
                        ) : (
                            <img src={story.media} alt="Story" />
                        )}
                        <div className="author">{story.user}</div>
                    </div>
                ))}
            </div>
            {previewUrl && (
                <div className="preview-container">
                    <div className="preview-media">
                        {file.type.startsWith('video/') ? (
                            <video src={previewUrl} controls />
                        ) : (
                            <img src={previewUrl} alt="Preview" />
                        )}
                        <button className="storie-submit-button" onClick={handleUpload}>Soumettre</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Stories;
