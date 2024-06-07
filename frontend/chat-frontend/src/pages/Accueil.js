import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import BottomTab from "./BottomTab";
import NavBar from "./NavBar";
import './css/acceuil.css';
import likeSon from './son/likesSon.mp3';
import moment from "moment";
import "moment/locale/fr";
import { IoEyeSharp } from "react-icons/io5";
import Stories from "../compoment/Stories";
import { useLongPress } from '@uidotdev/usehooks';
import {CiMenuKebab} from "react-icons/ci";

function Acceuil() {
  const [publications, setPublications] = useState([]);
  const [comments, setComments] = useState({});
  const [isCommentFormOpenList, setIsCommentFormOpenList] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});
  const [isStorySelected, setIsStorySelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPublicationId, setSelectedPublicationId] = useState(null);
  const [copiedText, setCopiedText] = useState(false);

  const cacheDuration = 1000 * 60 * 5; // 5 minutes

  const getPublicationsFromLocalStorage = () => {
    const cachedData = localStorage.getItem('publications');
    const cacheTimestamp = localStorage.getItem('publicationsTimestamp');
    if (cachedData && cacheTimestamp) {
      const age = Date.now() - cacheTimestamp;
      if (age < cacheDuration) {
        return JSON.parse(cachedData);
      }
    }
    return [];
  };
  useEffect(() => {
    async function fetchData() {
      moment.locale('fr');
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      let cachedPublications = getPublicationsFromLocalStorage();
      setPublications(cachedPublications);
      for (let publication of cachedPublications) {
        await fetchComments(publication.id);
      }
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/get_publications/`);
        const newPublications = response.data;
        for (let publication of newPublications) {
          await fetchComments(publication.id);
        }
        setLoading(false);
        setPublications(newPublications);
        localStorage.setItem('publications', JSON.stringify(newPublications));
        localStorage.setItem('publicationsTimestamp', Date.now().toString());
      } catch (error) {
        console.error('Erreur lors du chargement des publications depuis l\'API:', error);
      }
    }

    fetchData();
  }, []);
  useEffect(() => {
    const cachedData = localStorage.getItem('publications');
    if (cachedData) {
      const cachedPublications = JSON.parse(cachedData); // Convertir en tableau
      setPublications(cachedPublications);
      cachedPublications.forEach(publication => {
        fetchComments(publication.id);
      });
    }
  }, []);

  useEffect(() => {

    const handleSessionEnd = () => {
      localStorage.removeItem('publications');
      localStorage.removeItem('publicationsTimestamp');
      setPublications([]);
    };
    window.addEventListener('beforeunload', handleSessionEnd);
    return () => {
      window.removeEventListener('beforeunload', handleSessionEnd);
    };
  }, []);

  async function fetchComments(publicationId) {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/get_comments/${publicationId}`);
      setComments(prevComments => ({
        ...prevComments,
        [publicationId]: response.data
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
    }
  }

  const submitComment = async (publicationId, texte) => {
    try {
      const token = localStorage.getItem('token');
      console.log(token);
      const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/Utilisateur/api/post_comment/${publicationId}`,
          JSON.stringify({ texte }),
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`
            }
          }
      );
      console.log(response.data.message);
      await fetchComments(publicationId);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du commentaire:', error);
    }
  };

  const getLikedPublicationsFromLocalStorage = () => {
    const likedPublications = localStorage.getItem('likedPublications');
    return likedPublications ? JSON.parse(likedPublications) : {};
  };

  const saveLikedPublicationsToLocalStorage = (likedPublications) => {
    localStorage.setItem('likedPublications', JSON.stringify(likedPublications));
  };

  const initialLikedPublications = getLikedPublicationsFromLocalStorage();

  const updateLikedPublications = (publicationId, liked) => {
    const updatedLikedPublications = { ...initialLikedPublications, [publicationId]: liked };
    console.log(liked);
    saveLikedPublicationsToLocalStorage(updatedLikedPublications);
  };

  const isPublicationLiked = (publicationId) => {
    return initialLikedPublications.hasOwnProperty(publicationId) && initialLikedPublications[publicationId];
  };

  const audio = new Audio(likeSon);

  const likePublication = async (publicationId) => {
    audio.play();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/Utilisateur/api/liker_publication/`,
          JSON.stringify({ publication_id: publicationId }),
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`
            }
          }
      );
      updateLikedPublications(publicationId, response.data.liked);
      setPublications(prevPublications =>
          prevPublications.map(publication =>
              publication.id === publicationId ? { ...publication, count_likes: response.data.count_likes, liked: response.data.liked } : publication
          )
      );
    } catch (error) {
      console.error('Erreur lors du like de la publication:', error);
    }
  };

  function handleCommentChange(text, publicationId) {
    setCommentTexts(prev => ({ ...prev, [publicationId]: text }));
  }

  function toggleCommentForm(index) {
    setIsCommentFormOpenList(prevState => {
      const newState = [...prevState];
      newState[index] = !newState[index];
      return newState;
    });
  }

  const handleStorySelect = (isSelected) => {
    setIsStorySelected(isSelected);
  };

  const handleLongPress = () => {
    console.log("Long press detected");
  };

  const handleOpenPopup = (publicationId) => {
    setSelectedPublicationId(publicationId);
  };

  const copyTextToClipboard = (text) => {
    navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedText(true);
          setTimeout(() => {
            setCopiedText(false);
            handleClosePopup();
          }, 2000); // 2 secondes
        });
  };

  const downloadImage = async (url) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `image_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      handleClosePopup();
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
    }
  };

  const handleClosePopup = () => {
    setSelectedPublicationId(null);
  };

  const longPressEvent = useLongPress(handleLongPress, { delay: 800 });

  return (
      <div className={isStorySelected ? 'no-background' : ''} onMouseDown={handleLongPress}
           {...longPressEvent}
           style={{ userSelect: 'none' }}
      >
        {!isStorySelected && <NavBar />}
        <div className="conversation active"  style={{height: "100vh", overflow: "auto", paddingBottom: 250}}>
          <Stories onStorySelect={handleStorySelect} />
          {loading && (!publications || publications.length === 0) ? (
              <>
                <Skeleton baseColor="#030f1e" height={200} />
                <Skeleton baseColor="#030f1e" height={200} />
                <Skeleton baseColor="#030f1e" height={200} />
              </>
          ) : (
              publications.map((publication, index) => (
                  <div key={publication.id} className="publication" style={{ borderTop: '2px solid gray' }}>
                    {publication.photo_file && <img src={publication.photo_file} alt="Publication" />}
                    <div className="publication-header">
                      <img src={`${publication.utilisateur_image}`} alt="Profil de l'utilisateur" className="user-profile" />
                      <div className="user-info">
                        <p className="user-name">{publication.utilisateur_nom} {publication.utilisateur_prenom}</p>
                        <p className="publication-time">
                    <span style={{ fontSize: 10 }}>
                      {moment(publication.date_publication).diff(moment(), 'days') < -7
                          ? moment(publication.date_publication).format('DD/MM/YYYY')
                          : moment(publication.date_publication).fromNow(true)
                              .replace('minutes', 'min')
                              .replace('jours', 'j')
                              .replace('quelques secondes', '1s')
                              .replace('une minute', '1 min')
                              .replace('une heure', '1h')
                              .replace('heures', 'h')}{" "}
                      <i className="bi bi-globe-americas"></i>
                    </span>
                        </p>
                      </div>
                      <div style={{ position: 'absolute', right: 0, padding: 30, fontSize: 20 }}>
                        <CiMenuKebab onClick={() => handleOpenPopup(publication.id)} />
                      </div>
                      {selectedPublicationId === publication.id && (
                          <div key={publication.id} className="popup-wrapper" style={{ position: 'absolute', right: 0, marginTop: 150, width: 300 }}>
                            <div className="popup-content" id="popup-content">
                              {publication.contenu ? (
                                  <p onClick={() => copyTextToClipboard(publication.contenu)}> {copiedText ? "Texte copié" : "Copier le texte"}</p>
                              ) : (
                                  <p onClick={() => downloadImage(publication.photo_file_url)}>Télécharger l'image</p>
                              )}
                            </div>
                          </div>
                      )}

                    </div>

                    {!publication.contenu && (
                        <>
                          <p style={{
                            fontFamily: "verdana",
                            textShadow: `1px 1px 1px #919191,
                                1px 18px 6px rgba(16,16,16,0.4),
                                1px 30px 60px rgba(16,16,16,0.4)`,
                            fontSize: 15
                          }}>{publication.titre}</p>
                        </>
                    )}
                    <div className="publication-content" style={{
                      minHeight: 400,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      color: "white",
                      fontSize: 20,
                      backgroundImage: publication.photo_file ? '' : publication.couleur_fond,
                      textShadow: `1px 1px 1px #919191,
                                1px 18px 6px rgba(16,16,16,0.4),
                                1px 30px 60px rgba(16,16,16,0.4)`
                    }}>
                      {publication.contenu ? (
                          <>
                            {publication.contenu}
                          </>
                      ) : (
                          <>
                            <img src={`${publication.photo_file_url}`} className="publication-image"
                                 alt="Publication" />
                          </>
                      )}
                    </div>
                    <div className="row publication-actions">
                      <div className="col-4 comment-count-container" style={{ fontSize: 11 }}>
                        <button className="action-button" id="comment-button"
                                onClick={() => likePublication(publication.id)}>
                          <i className={`bi ${isPublicationLiked(publication.id) ? 'bi-heart-fill liked' : 'bi-heart'}`}></i>
                          <span className="likes-count" style={{ fontSize: 15 }}>
                      {publication.count_likes}
                    </span>
                        </button>
                      </div>
                      <div className="col-4 comment-count-container" style={{ fontSize: 11 }}>
                        <button className="action-button" id="comment-button"
                                onClick={() => toggleCommentForm(index)}><i
                            className="bi bi-chat"></i>
                          <span className="comment-count" id="comment-count- photo.id" style={{ fontSize: 15 }}>1</span>
                        </button>

                      </div>
                      <div className="col-4 comment-count-container"
                           style={{ fontSize: 10 }}>
                        <span className="comment-count">15,42k</span> <IoEyeSharp />
                      </div>
                    </div>
                    <div className="comments-section" id="comments-section- photo.id "
                         data-url="" style={{
                      overflowY: "auto",
                      overflowX: "hidden",
                      maxHeight: 300,
                      display: isCommentFormOpenList[index] ? 'block' : 'none'
                    }}>
                      <div className="comments-container" id="comments-container- photo.id ">
                        {comments[publication.id] && comments[publication.id].map((comment, commentIndex) => (
                            <div key={commentIndex} className="comment">
                              <p className="comment-user">{comment.utilisateur_nom} {comment.utilisateur_prenom}</p>
                              <p className="comment-text">{comment.texte}</p>
                              <p className="comment-time">{comment.date_comment}</p>
                            </div>
                        ))}
                      </div>
                      <form className="commentaire-form" onSubmit={(e) => {
                        e.preventDefault();
                        submitComment(publication.id, commentTexts[publication.id]);
                      }}>
                        <input type="text" className="commentaire-input" name="texte"
                               placeholder="Écrivez un commentaire..."
                               value={commentTexts[publication.id] || ''}
                               onChange={(e) => handleCommentChange(e.target.value, publication.id)} />

                        <button type="submit">▶️</button>
                      </form>
                    </div>
                  </div>
              ))
          )}

          {!isStorySelected && <BottomTab />}
        </div>
      </div>
  );
}

export default Acceuil;
