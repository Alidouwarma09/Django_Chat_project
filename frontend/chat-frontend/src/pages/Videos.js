import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './css/videos.css'
import likeSon from './son/likesSon.mp3'
import ReactPlayer from "react-player";
import { IoIosPlayCircle } from "react-icons/io";
import { GoArrowLeft } from "react-icons/go";
import { IoSendOutline } from "react-icons/io5";
import { RiShareForwardFill } from "react-icons/ri";
import moment from "moment/moment";
import Skeleton from "react-loading-skeleton";
import { VideoContext } from '../compoment/VideoContext';

function Videos(id) {
    const { videos, loading, setVideos } = useContext(VideoContext); // Utiliser le contexte
    const [comments, setComments] = useState({});
    const [isCommentFormOpenList, setIsCommentFormOpenList] = useState([]);
    const [commentTexts, setCommentTexts] = useState({});
    const [activeVideo, setActiveVideo] = useState(null);
    const [playing, setPlaying] = useState(false);

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
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/Utilisateur/api/post_comment/${VideoId}`,
                JSON.stringify({ texte }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${token}`
                    }
                }
            );
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

    const handleGoBack = () => {
        window.history.back();
    };

    return (
        <div>
            <div>
                <nav className="navbar" style={{ backgroundColor: "black", zIndex: 100 }}>
                    <GoArrowLeft onClick={handleGoBack} style={{ width: 34, height: 34, color: "white" }} />
                </nav>
            </div>
            <div className="conversation active">
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
                                    <ReactPlayer
                                        key={video.id}
                                        url={`${process.env.REACT_APP_CLOUDINARY_URL}${video.videos_file}.mp4`}
                                        id={video.id}
                                        width="100%"
                                        height="100%"
                                        autoPlay={true}
                                        playing={activeVideo === video.id}
                                        controls
                                    />
                                    <div className="play-pause-icon" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '3em', color: '#fff', zIndex: 1 }}>
                                        {!playing ? <IoIosPlayCircle style={{ fontSize: 65 }} /> : ''}
                                    </div>
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
                                    <RiShareForwardFill style={{ fontSize: 25 }} />
                                    <span className="comment-count">15,42k</span>
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
        </div>
    );
}

export default Videos;
