import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './css/videos.css'
import likeSon from './son/likesSon.mp3'
import ReactPlayer from "react-player";
import { IoSendOutline } from "react-icons/io5";
import moment from "moment/moment";
import Skeleton from "react-loading-skeleton";
import { VideoContext } from '../compoment/VideoContext';
import {FaDownload} from "react-icons/fa";
import Navbar from "./NavBar";
import BottomTab from "./BottomTab";
import {useNavigate} from "react-router-dom";

function Videos(id) {
    const { videos, loading, setVideos  } = useContext(VideoContext);
    const [comments, setComments] = useState({});
    const [isCommentFormOpenList, setIsCommentFormOpenList] = useState([]);
    const [commentTexts, setCommentTexts] = useState({});
    const [activeVideo, setActiveVideo] = useState(null);
    const [playing, setPlaying] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/connexion');
        }
    }, [navigate]);
    useEffect(() => {
        const fetchCommentsForVideos = async () => {
            for (let video of videos) {
                await fetchCommentsVideo(video.id);
            }
        };

        if (videos.length > 0) {
            setIsCommentFormOpenList(new Array(videos.length).fill(false));
            fetchCommentsForVideos();
        }
    }, [videos]);

    const fetchCommentsVideo = async (VideoId) => {
        try {
            const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/get_comments/${VideoId}`);
            setComments(prevComments => ({
                ...prevComments,
                [VideoId]: response.data
            }));
        } catch (error) {
            console.error('Erreur lors de la récupération des commentaires:', error);
        }
    };

    const submitComment = async (VideoId, texte) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(
                `${process.env.REACT_APP_API_URL}/Utilisateur/api/post_comment/${VideoId}`,
                JSON.stringify({ texte }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    }
                }
            );
            // Pas besoin d'utiliser 'response' ici
            await fetchCommentsVideo(VideoId);
        } catch (error) {
            console.error('Erreur lors de l\'envoi du commentaire:', error);
        }
    };


    const getLikedVideoFromLocalStorage = () => {
        const likedPublications = localStorage.getItem('likedPublications');
        return likedPublications ? JSON.parse(likedPublications) : {};
    };

    const saveLikedPublicationsToLocalStorage = (likedPublications) => {
        localStorage.setItem('likedPublications', JSON.stringify(likedPublications));
    };

    const initialLikedPublications = getLikedVideoFromLocalStorage();

    const updateLikedPublications = (VideoId, liked) => {
        const updatedLikedPublications = { ...initialLikedPublications, [VideoId]: liked };
        saveLikedPublicationsToLocalStorage(updatedLikedPublications);
    };

    const isPublicationLiked = (VideoId) => {
        return initialLikedPublications.hasOwnProperty(VideoId) && initialLikedPublications[VideoId];
    };

    const audio = new Audio(likeSon);

    const likePublication = async (VideoId) => {
        audio.play();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/Utilisateur/api/liker_publication/`,
                JSON.stringify({ publication_id: VideoId }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    }
                }
            );
            updateLikedPublications(VideoId, response.data.liked);
            setVideos(prevPublications =>
                prevPublications.map(video =>
                    video.id === VideoId ? { ...video, count_likes: response.data.count_likes, liked: response.data.liked } : video
                )
            );
        } catch (error) {
            console.error('Erreur lors du like de la publication:', error);
        }
    };

    const handleCommentChange = (text, VideoId) => {
        setCommentTexts(prev => ({ ...prev, [VideoId]: text }));
    };

    const toggleCommentForm = (index) => {
        setIsCommentFormOpenList(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    const togglePlayPause = (id) => {
        if (activeVideo === id) {
            setActiveVideo(null);
            setPlaying(playing === true);
        } else {
            setActiveVideo(id);
            setPlaying(playing === false);
        }
    };


    const handleDownload = async (url, fileName) => {
        try {
            const response = await axios.get(url, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Erreur lors du téléchargement de la vidéo:', error);
        }
    };

    return (
        <div>
            <div>
                <Navbar/>
            </div>
            <div className="conversation active" style={{height: "100vh", overflow: "auto"}}>
                {loading ? (
                    <>
                        <Skeleton height={200} />
                        <Skeleton height={200} />
                        <Skeleton height={200} />
                    </>
                ) : (
                    videos.map((video, index) => (
                        <div key={video.id} className="publication">
                            {video.photo_file && <img src={video.photo_file} alt="Publication" />}
                            <div className="publication-header">
                                <img src={`${video.utilisateur_image}`} alt="Profil de l'utilisateur" className="user-profile" />
                                <div className="user-info">
                                    <p className="user-name">{video.utilisateur_nom} {video.utilisateur_prenom}</p>
                                    <p className="publication-time">
                                        <span style={{ fontSize: 10 }}>
                                            {moment(video.date_publication).diff(moment(), 'days') < -7
                                                ? moment(video.date_publication).format('DD/MM/YYYY')
                                                : moment(video.date_publication).fromNow(true)
                                                    .replace('minutes', 'min')
                                                    .replace('heures', 'h')}{" "}
                                            <i className="bi bi-globe-americas"></i>
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <p>{video.titre}</p>
                            <div className="publication-content" style={{ minHeight: 400, display: "flex", justifyContent: "center", alignItems: "center", color: "white" }}>
                                <div onClick={() => togglePlayPause(video.id)} style={{ minHeight: 400, display: "flex", justifyContent: "center", alignItems: "center", color: "white", cursor: 'pointer' }}>
                                    {activeVideo === video.id ? (
                                        <ReactPlayer
                                            key={video.id}
                                            url={`${process.env.REACT_APP_CLOUDINARY_URL}${video.videos_file}.mp4`}
                                            width="100%"
                                            height="100%"
                                            playing={playing}
                                            controls
                                        />
                                    ) : (
                                        <div onClick={() => togglePlayPause(video.id)} style={{ cursor: 'pointer', position: 'relative' }}>
                                            <video
                                                src={`${process.env.REACT_APP_CLOUDINARY_URL}${video.videos_file}.mp4#t=0.001`}
                                                controls={false}
                                                muted={true}
                                                loop={false}
                                                width="100%"
                                                height="100%"
                                                style={{ objectFit: 'cover' }}
                                            />
                                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '50%', padding: '10px' }}>
                                                <i className="bi bi-play-circle" style={{ fontSize: '2rem', color: 'white' }}></i>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                            <div className="row publication-actions">
                                <div className="col-4 likes-container" style={{ fontSize: 11, paddingLeft: 20 }}>
                                    <button className="action-button" id="like-button" onClick={() => likePublication(video.id)}>
                                        <i className={`bi ${isPublicationLiked(video.id) ? 'bi-heart-fill liked' : 'bi-heart'}`}></i>
                                    </button>
                                    <span className="likes-count">
                                        {video.count_likes}
                                    </span> likes
                                </div>
                                <div className="col-4 comment-count-container" style={{ fontSize: 11, paddingRight: 20 }}>
                                    <button className="action-button" id="comment-button" onClick={() => toggleCommentForm(index)}>
                                        <i className="bi bi-chat"></i>
                                    </button>
                                    <span className="comment-count" id="comment-count-photo.id"></span> 1
                                </div>
                                <div className="col-4 comment-count-container" style={{ fontSize: 10, paddingRight: 30, marginRight: 10 }}>
                                    <FaDownload onClick={() => handleDownload(`${process.env.REACT_APP_CLOUDINARY_URL}${video.videos_file}.mp4`, `${video.titre}.mp4`)} />
                                </div>
                            </div>
                            <div className="comments-section" id={`comments-section-${video.id}`} data-url="" style={{ overflowY: "auto", overflowX: "hidden", maxHeight: 300, display: isCommentFormOpenList[index] ? 'block' : 'none' }}>
                                <div className="comments-container" id={`comments-container-${video.id}`}>
                                    {comments[video.id] && comments[video.id].length > 0 ? (
                                        comments[video.id].map((comment, commentIndex) => (
                                            <div key={commentIndex} className="comment" style={{ borderBottom: "5px solid #111111" }}>
                                                <div className="comment-user-info">
                                                    {comment.utilisateur_image_com && (
                                                        <img src={comment.utilisateur_image_com} alt="Profil de l'utilisateur" className="user-profile" />
                                                    )}
                                                    <span style={{ marginLeft: 10, color: "blue" }}>Suivre</span>
                                                    <p className="comment-user">{comment.utilisateur_nom} {comment.utilisateur_prenom}</p>
                                                </div>
                                                <p className="comment-text">{comment.texte}</p>
                                                <p className="comment-time">{comment.date_comment}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>Soyez le premier à commenter.</p>
                                    )}
                                </div>
                                <form className="commentaire-form" onSubmit={(e) => {
                                    e.preventDefault();
                                    submitComment(video.id, commentTexts[video.id]);
                                }}>
                                    <input type="text" className="commentaire-input" name="texte" placeholder="Écrivez un commentaire..." value={commentTexts[video.id] || ''} onChange={(e) => handleCommentChange(e.target.value, video.id)} />
                                    <button type="submit"><IoSendOutline /></button>
                                </form>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <BottomTab />
        </div>
    );
}

export default Videos;
