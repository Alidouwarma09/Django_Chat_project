import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/videos.css'
import likeSon from './son/likesSon.mp3'
import ReactPlayer from "react-player";
import {IoIosPlayCircle} from "react-icons/io";
import {GoArrowLeft} from "react-icons/go";
import {IoSendOutline} from "react-icons/io5";
import {RiShareForwardFill} from "react-icons/ri";
import moment from "moment/moment";
function Videos(id) {
 const [videos, setVideo] = useState([]);
  const [comments, setComments] = useState({});
 const [isCommentFormOpenList, setIsCommentFormOpenList] = useState([]);
 const [commentTexts, setCommentTexts] = useState({});
const [activeVideo, setActiveVideo] = useState(null);
  const [playing, setPlaying] = useState(false);


const getVideoFromLocalStorage = () => {
  const videos = localStorage.getItem('videos');
  return videos ? JSON.parse(videos) : [];
};
const fetchNewVideo = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/get_publications_video/`);
      localStorage.setItem('videos', JSON.stringify(response.data));
      setVideo(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des nouvelles videos:', error);
    }
  };
useEffect(() => {
    fetchNewVideo();
  }, []);

useEffect(() => {
  async function fetchVideo() {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      let cachedVideo = getVideoFromLocalStorage();
      if (cachedVideo.length !== 0) {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/get_publications_video/`);
        setVideo(response.data);
        localStorage.setItem('videos', JSON.stringify(response.data));
      } else {
        setVideo(cachedVideo);
      }
      setIsCommentFormOpenList(new Array(cachedVideo.length).fill(false));
      for (let videos of cachedVideo) {
        await fetchCommentsVideo(videos.id);
      }
      await fetchNewVideo();
    } catch (error) {
      console.error('Erreur lors du chargement des videos:', error);
    }
  }

  fetchVideo();

  const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/Utilisateur/api/comment_sse/`);
  eventSource.onmessage = async (event) => {
    const data = JSON.parse(event.data);
    if (data.comments && data.comments.length > 0) {
      const VideoId = data.comments[0].publication_id;
      await fetchCommentsVideo(VideoId);
    } else {
      console.error('Aucun commentaire reçu dans les données de l\'événement');
    }
  };



  return () => {
    eventSource.close();
  };
}, []);


  async function fetchCommentsVideo(VideoId) {
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
  }

const submitComment = async (VideoId, texte) => {
    try {

const token = localStorage.getItem('token');
console.log(token)
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
        console.log(response.data.message);
        await fetchCommentsVideo(VideoId);
    } catch (error) {
        console.error('Erreur lors de l\'envoi du commentaire:', error);
    }
}

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
    console.log( liked)
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
        setVideo(prevPublications =>
            prevPublications.map(videos =>
                videos.id === VideoId ? { ...videos, count_likes: response.data.count_likes, liked: response.data.liked } : videos
            )
        );
    } catch (error) {
        console.error('Erreur lors du like de la publication:', error);
    }
};
function handleCommentChange(text, VideoId) {
  setCommentTexts(prev => ({ ...prev, [VideoId]: text }));
}
function toggleCommentForm(index) {
    setIsCommentFormOpenList(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  }
const togglePlayPause = (id) => {
    if (activeVideo === id) {
      setActiveVideo(null);
         setPlaying(playing===true);
    } else {
      setActiveVideo(id);
        setPlaying(playing===false);
    }
  };
const handleGoBack = () => {
  window.history.back();
};
  return (
    <div>
        <div>
            <nav className="navbar" style={{backgroundColor: "black", zIndex: 100}}>
                <GoArrowLeft onClick={handleGoBack} style={{width: 34, height: 34, color: "white"}} />
            </nav>
        </div>
        <div className="conversation active">
            {videos.map((videos, index) => (
                <div key={videos.id} className="publication">
                    {videos.photo_file && <img src={videos.photo_file} alt="Publication"/>}

                    <div className="publication-header">
                        <img src={`${videos.utilisateur_image}`} alt="Profil de l'utilisateur"
                             className="user-profile"/>

                        <div className="user-info">
                            <p className="user-name">{videos.utilisateur_nom} {videos.utilisateur_prenom}</p>
                            <p className="publication-time">
                               <span style={{fontSize: 10}}>
                                    {moment(videos.date_publication).diff(moment(), 'days') < -7
                                        ? moment(videos.date_publication).format('DD/MM/YYYY')
                                        : moment(videos.date_publication).fromNow(true)
                                            .replace('minutes', 'min')
                                            .replace('heures', 'h')}{" "}
                                   <i className="bi bi-globe-americas"></i>
                               </span>
                            </p>
                        </div>
                    </div>
                    <p>{videos.titre}</p>
                    <div className="publication-content" style={{
                        minHeight: 400,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                    }}>
                        <div onClick={() => togglePlayPause(videos.id)} style={{
                            minHeight: 400,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            color: "white",
                            cursor: 'pointer'
                        }}>
                            <video id="video-id-vyxetj38h9o_html5_api" data-cld-font-face="inherit"
                                   data-cld-played-event-times="[1]" className="vjs-tech" style={{fontFamily: "inherit"}}
                                   tabIndex="-1" preload="auto"
                                   poster="https://res-console.cloudinary.com/dp7nell7v/thumbnails/v1/video/upload/v1716398411/bWVkaWEvdmlkZW9zL3Rpa3Rva18xNzE2MTUyNDY0ODEzNzk0OTY0X3drbzdnYQ==/drilldown"
                                   src="https://res.cloudinary.com/dp7nell7v/video/upload/v1/media/videos/tiktok_1716152464813794964_wko7ga.mp4?_s=vp-2.0.2"></video>

                            {/*<ReactPlayer*/}
                            {/*        key={videos.id}*/}
                            {/*        url={`${videos.videos_file}`}*/}
                            {/*        id={videos.id}*/}
                            {/*        width="100%"*/}
                            {/*        height="100%"*/}
                            {/*        autoPlay={true}*/}
                            {/*        playing={activeVideo === videos.id}*/}
                            {/*    />*/}
                            <div className="play-pause-icon" style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                fontSize: '3em',
                                color: '#fff',
                                zIndex: 1
                            }}>
                                {!playing ? <IoIosPlayCircle style={{fontSize: 65}}/> : ''}
                            </div>
                        </div>
                    </div>
                    <div className="row publication-actions">
                        <div className="col-4 likes-container" style={{fontSize: 11, paddingLeft: 20}}>
                            <button className="action-button" id="like-button"
                                    onClick={() => likePublication(videos.id)}>
                                <i className={`bi ${isPublicationLiked(videos.id) ? 'bi-heart-fill liked' : 'bi-heart'}`}></i>
                            </button>
                            <span className="likes-count">
                    {videos.count_likes}
                </span> likes
                        </div>
                        <div className="col-4 comment-count-container" style={{fontSize: 11, paddinRight: 20}}>
                            <button className="action-button" id="comment-button"
                                    onClick={() => toggleCommentForm(index)}><i
                                className="bi bi-chat"></i></button>
                            <span className="comment-count" id="comment-count- photo.id"></span> 1
                        </div>
                        <div className="col-4 comment-count-container"
                             style={{fontSize: 10, paddinRight: 30, marginRight: 10}}>
                            <RiShareForwardFill style={{fontSize: 25}} />
                            <span className="comment-count">15,42k</span>
                        </div>
                    </div>
                    <div className="comments-section" id={`comments-section-${videos.id}`} data-url="" style={{
                        overflowY: "auto",
                        overflowX: "hidden",
                        maxHeight: 300,
                        display: isCommentFormOpenList[index] ? 'block' : 'none'
                    }}>
                        <div className="comments-container" id={`comments-container-${videos.id}`}>
                            {comments[videos.id] && comments[videos.id].length > 0 ? (
                                comments[videos.id].map((comment, commentIndex) => (
                                    <div key={commentIndex} className="comment" style={{ borderBottom: "5px solid #111111" }}>
                                        <div className="comment-user-info">
                                            {comment.utilisateur_image_com && (
                                                <img src={comment.utilisateur_image_com} alt="Profil de l'utilisateur"
                                                     className="user-profile"/>
                                            )}
                                            <span style={{marginLeft: 10, color: "blue"}}>Suivre</span>
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
                            submitComment(videos.id, commentTexts[videos.id]);
                        }}>
                            <input type="text" className="commentaire-input" name="texte"
                                   placeholder="Écrivez un commentaire..."
                                   value={commentTexts[videos.id] || ''}
                                   onChange={(e) => handleCommentChange(e.target.value, videos.id)}/>
                            <button type="submit"><IoSendOutline/></button>
                        </form>
                    </div>
                </div>
            ))}
        </div>
    </div>

  )
      ;
}

export default Videos;
