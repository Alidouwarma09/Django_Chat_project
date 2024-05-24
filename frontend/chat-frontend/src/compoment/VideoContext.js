import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/get_publications_video/`);
                setVideos(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erreur lors du chargement des vidéos:', error);
            }
        };

        if (videos.length === 0) {
            fetchVideos();
        } else {
            setLoading(false);
        }
    }, [videos]);

    return (
        <VideoContext.Provider value={{ videos, loading, setVideos }}>
            {children}
        </VideoContext.Provider>
    );
};
