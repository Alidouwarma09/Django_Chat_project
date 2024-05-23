import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdLibraryAdd } from 'react-icons/md';
import './css/stories.css';

function Stories() {
    const [stories, setStories] = useState([]);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedStory, setSelectedStory] = useState(null);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/getstories/`);
            const absoluteData = response.data.map(story => ({
                ...story,
                media: `${process.env.REACT_APP_API_URL}${story.media}`
            }));
            setStories(absoluteData);
        } catch (error) {
            console.error('Erreur lors du chargement des stories :', error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            const objectUrl = URL.createObjectURL(selectedFile);
            setPreviewUrl(objectUrl);
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

    const handleStoryClick = (story) => {
        setSelectedStory(story);
    };

    const handleCloseStory = () => {
        setSelectedStory(null);
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
                    <div key={story.id} className="story"  onClick={() => handleStoryClick(story)}>
                        {story.media.endsWith('.mp4') ? (
                            <video src={story.media} style={{ width: '100%', height: '100%', borderRadius: '10px' }} />
                        ) : (
                            <img src={`${story.media}`} alt="Story" style={{ width: '100%', height: '100%', borderRadius: '10px' }} />
                        )}
                        <div className="author">{story.nom_utilisateur}</div>
                    </div>
                ))}
            </div>
            {previewUrl && (
                <div className="preview-container">
                    <div className="preview-media">
                        {file.type.startsWith('video/') ? (
                            <video src={previewUrl} controls style={{ width: '200px', height: '200px', borderRadius: '10px', marginBottom: '10px' }} />
                        ) : (
                            <img src={previewUrl} alt="Preview" style={{ width: '200px', height: '200px', borderRadius: '10px', marginBottom: '10px' }} />
                        )}
                        <button className="storie-submit-button" onClick={handleUpload}>Soumettre</button>
                    </div>
                </div>
            )}
            {selectedStory && (
                <div className="stories-container" onClick={handleCloseStory}>
                    <div className="close-btn">X</div>
                    <div className="content">
                        {selectedStory.media.endsWith('.mp4') ? (
                            <video src={selectedStory.media} controls style={{ width: '100%', height: '90vh', objectFit: 'contain', borderRadius: '16px' }} />
                        ) : (
                            <img src={selectedStory.media} alt="Story" style={{ height: '100%', aspectRatio: '10/16', objectFit: 'cover', borderRadius: '16px' }} />
                        )}
                        <div className="author">{selectedStory.nom_utilisateur}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Stories;
