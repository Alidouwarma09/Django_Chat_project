import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdLibraryAdd } from 'react-icons/md';
import './css/stories.css';

function Stories({ onStorySelect }) {
    const [stories, setStories] = useState([]);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedStory, setSelectedStory] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [displayDuration, setDisplayDuration] = useState(null);
    const [progress, setProgress] = useState(0);

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
            await axios.post(`${process.env.REACT_APP_API_URL}/Utilisateur/api/stories/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Token ${token}`
                }
            });
            setFile(null);
            setPreviewUrl(null);
            fetchStories();
        } catch (error) {
            console.error('Erreur lors de l\'upload de la story :', error);
        }
    };

    const handleStoryClick = (index) => {
        setSelectedStory(stories[index]);
        setSelectedIndex(index);
        onStorySelect(true);
    };

    const handlePreviousStory = () => {
        const newIndex = selectedIndex - 1;
        if (newIndex >= 0) {
            setSelectedStory(stories[newIndex]);
            setSelectedIndex(newIndex);
            setDisplayDuration(0)
        }
    };

    const handleNextStory = () => {
        const newIndex = selectedIndex + 1;
        if (newIndex < stories.length) {
            setSelectedStory(stories[newIndex]);
            setSelectedIndex(newIndex);
        }
    };

    const handleCloseStory = () => {
        setSelectedStory(null);
        onStorySelect(false);
    };

    useEffect(() => {
        if (selectedStory && selectedStory.media) {
            const duration = selectedStory.media.endsWith('.mp4') ? getVideoDuration(selectedStory.media) : 5000;
            setDisplayDuration(duration);
            setProgress(0);
        }
    }, [selectedStory]);

    useEffect(() => {
        let timer;
        if (selectedStory && displayDuration) {
            timer = setTimeout(() => {
                handleNextStory();
            }, displayDuration);

            if (!selectedStory.media.endsWith('.mp4')) {
                const interval = setInterval(() => {
                    setProgress((prev) => prev + 100 / (displayDuration / 100));
                }, 100);
                return () => clearInterval(interval);
            }
        }

        return () => clearTimeout(timer);
    }, [selectedStory, displayDuration]);

    const getVideoDuration = (videoUrl) => {
        // Implémentez la logique pour obtenir la durée de la vidéo
        // Pour cet exemple, supposons que la durée de la vidéo soit de 10 secondes
        return 10000; // Durée en millisecondes
    };

    return (
        <div style={{ zIndex: 9000 }}>
            <div className="stories-container">
                <div className="story" style={{ backgroundColor: "gray", height: 150 }}>
                    <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="upload-story" />
                    <label htmlFor="upload-story">
                        <MdLibraryAdd style={{ width: "60%", height: "100%" }} />
                        <div className="author" style={{ fontSize: 10 }}>Ajouter une story</div>
                    </label>
                </div>
                {stories.map((story, index) => (
                    <div key={story.id} className="story" onClick={() => handleStoryClick(index)}>
                        {story.media && story.media.endsWith && story.media.endsWith('.mp4') ? (
                            <video src={story.media} style={{ width: '100%', height: '100%', borderRadius: '10px' }} />
                        ) : (
                            <img src={`${story.media}`} alt="Story"
                                 style={{ width: '100%', height: '100%', borderRadius: '10px' }} />
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
                <div className="stories-full-view">
                    <div className="close-btn" onClick={handleCloseStory}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <div className="content">
                        <div className="story">
                            {selectedStory.media && selectedStory.media.endsWith('.mp4') ? (
                                <video src={selectedStory.media}
                                       style={{ width: '100%', height: '100%', borderRadius: '16px' }} />
                            ) : (
                                <img src={selectedStory.media} alt="Story"
                                     style={{ width: '100%', height: '100%', borderRadius: '16px' }} />
                            )}
                            <div className="author">{selectedStory.nom_utilisateur}</div>
                            <div className="progress-bar">
                                <div className="progress" style={{ width: `${progress}%` }}></div>
                            </div>
                        </div>
                        <div className="previous-btn" onClick={handlePreviousStory}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </div>
                        <div className="next-btn" onClick={handleNextStory}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Stories;
