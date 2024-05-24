import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {MdLibraryAdd, MdPlayCircle} from 'react-icons/md';
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
        const modifiedData = response.data.map(story => {
            if (!story.media.includes("storyImage")) {
                // Si le nom du fichier ne contient pas "storyImage", retirer l'extension .url
                return {
                    ...story,
                    media: story.media
                };
            } else {
                return story;
            }
        });
        setStories(modifiedData);
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
            await fetchStories();
        } catch (error) {
            console.error('Erreur lors de l\'upload de la story :', error);
        }
    };

    const handleStoryClick = (index) => {
        setSelectedStory(stories[index]);
        setSelectedIndex(index);
        setProgress(0); // Réinitialiser la progression
        onStorySelect(true);
    };

    const handlePreviousStory = () => {
        const newIndex = selectedIndex - 1;
        if (newIndex >= 0) {
            setSelectedStory(stories[newIndex]);
            setSelectedIndex(newIndex);
            setDisplayDuration(null); // Réinitialiser la durée d'affichage
            setProgress(0); // Réinitialiser la progression
        }
    };

    const handleNextStory = () => {
        const newIndex = selectedIndex + 1;
        if (newIndex < stories.length) {
            setSelectedStory(stories[newIndex]);
            setSelectedIndex(newIndex);
            setDisplayDuration(null); // Réinitialiser la durée d'affichage
            setProgress(0); // Réinitialiser la progression
        }
    };

    const handleCloseStory = () => {
        setSelectedStory(null);
        onStorySelect(false);
    };

    useEffect(() => {
        let timer;
        let interval;
        if (selectedStory && selectedStory.media) {
            const duration = selectedStory.media.endsWith('.mp4') ? getVideoDuration(selectedStory.media) : 5000;
            setDisplayDuration(duration);
            setProgress(0);

            if (selectedStory.media.endsWith('.mp4')) {
                timer = setTimeout(() => {
                    handleNextStory();
                }, duration);
            } else {
                interval = setInterval(() => {
                    setProgress((prev) => {
                        if (prev >= 100) {
                            clearInterval(interval);
                            handleNextStory();
                            return 0;
                        }
                        return prev + 100 / (duration / 100);
                    });
                }, 100);
            }
        }

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [selectedStory, displayDuration]);

    const getVideoDuration = (videoUrl) => {
        // Implémentez la logique pour obtenir la durée de la vidéo
        // Pour cet exemple, supposons que la durée de la vidéo soit de 10 secondes
        return 10000; // Durée en millisecondes
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
                {stories.map((story, index) => (
                    <div key={story.id} className="story" onClick={() => handleStoryClick(index)}>
                        {story.media && story.media.includes('storyImage') ? (
                                <img src={`${story.media}`} alt="Story"
                                     style={{width: '100%', height: '100%', borderRadius: '10px'}}/>

                        ) : (
                            <div style={{position: 'relative', width: '100%', height: '100%', borderRadius: '10px'}}>
                                <MdPlayCircle style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 1,
                                    fontSize: 40,
                                    color: "white"
                                }}/>
                                <video src={`${process.env.REACT_APP_CLOUDINARY_URL}${story.media}.mp4`}
                                       style={{width: '100%', height: '100%', borderRadius: '10px', zIndex: 0}}/>
                            </div>
                        )}

                        <div className="author">{story.nom_utilisateur}</div>
                    </div>
                ))}
            </div>
            {previewUrl && (
                <div className="preview-container">
                    <div className="preview-media">
                        {file.type.startsWith('video/') ? (
                            <video src={previewUrl} controls style={{
                                width: '200px',
                                height: '200px',
                                borderRadius: '10px',
                                marginBottom: '10px'
                            }}/>
                        ) : (
                            <img src={previewUrl} alt="Preview"
                                 style={{width: '200px', height: '200px', borderRadius: '10px', marginBottom: '10px'}}/>
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
                            {selectedStory.media && selectedStory.media.includes('storyImage') ? (
                                <img src={`${selectedStory.media}`} alt="Story"
                                     style={{
                                         width: '100%',
                                         height: '100%', borderRadius: '16px'
                                     }}/>
                            ) : (
                                <video src={`${process.env.REACT_APP_CLOUDINARY_URL}${selectedStory.media}.mp4`} autoPlay
                                       style={{width: '100%', height: '100%', borderRadius: '16px'}}/>

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
