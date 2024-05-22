import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BottomTab from "./BottomTab";
import NavBar from "./NavBar";
import './css/acceuil.css'
import likeSon from './son/likesSon.mp3'
import ReactPlayer from "react-player";
import {IoIosPlayCircle} from "react-icons/io";
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
        localStorage.removeItem('videos');

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
  return (
    <div>
         <NavBar />
        <div className="conversation active">
{videos.map((videos, index) => (
    <div key={videos.id} className="publication">
        {videos.photo_file && <img src={videos.photo_file} alt="Publication"/>}

        <div className="publication-header">
            <img src={`${videos.utilisateur_image}`} alt="Profil de l'utilisateur"
                 className="user-profile"/>
            <div className="user-info">
                <p className="user-name">{videos.utilisateur_nom} {videos.utilisateur_prenom}</p>
                <p className="publication-time"> Il y a {videos.date_publication} <i className="bi bi-globe-americas"></i></p>
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
                <ReactPlayer
                    key={videos.id}
                    url={`${videos.videos_file}`}
                    id={videos.id}
                    width="100%"
                    height="100%"
                    playing={activeVideo === videos.id}
                />
                {/*<video width="600" controls autoPlay={true}>*/}
                {/*    <source src={videos.videos_file} type="video/mp4"/>*/}
                {/*    Votre navigateur ne supporte pas la balise vidéo.*/}
                {/*</video>*/}
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
                <span className="comment-count" id="comment-count- photo.id"></span> commentaires
            </div>
            <div className="col-4 comment-count-container"
                 style={{fontSize: 10, paddinRight: 30, marginRight: 10}}>
                <span className="comment-count">15,42k</span> Vues
            </div>
        </div>
        <div className="comments-section" id={`comments-section-${videos.id}`} data-url="" style={{
            overflowY: "auto",
            overflowX: "hidden",
            maxHeight: 300,
            display: isCommentFormOpenList[index] ? 'block' : 'none'
        }}>
            <div className="comments-container" id={`comments-container-${videos.id}`}>
                {comments[videos.id] && comments[videos.id].map((comment, commentIndex) => (
                    <div key={commentIndex} className="comment">
                        <p className="comment-user">{comment.utilisateur_nom} {comment.utilisateur_prenom}</p>
                        <p className="comment-text">{comment.texte}</p>
                        <p className="comment-time">{comment.date_comment}</p>
                    </div>
                ))}
            </div>
            <form className="commentaire-form" onSubmit={(e) => {
                e.preventDefault();
                submitComment(videos.id, commentTexts[videos.id]);
            }}>
                <input type="text" className="commentaire-input" name="texte"
                       placeholder="Écrivez un commentaire..."
                       value={commentTexts[videos.id] || ''}
                       onChange={(e) => handleCommentChange(e.target.value, videos.id)}/>

                <button type="submit">▶️</button>
            </form>
        </div>
    </div>
))}


            <BottomTab/>
        </div>
    </div>

)
    ;
}

export default Videos;
