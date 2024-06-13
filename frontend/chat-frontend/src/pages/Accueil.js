import React, {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import BottomTab from "./BottomTab";
import NavBar from "./NavBar";
import './css/acceuil.css';
import likeSon from './son/likesSon.mp3';
import moment from "moment";
import "moment/locale/fr";
import {IoEyeSharp, IoSendSharp} from "react-icons/io5";
import Stories from "../compoment/Stories";
import { useLongPress } from '@uidotdev/usehooks';
import {RiVerifiedBadgeFill} from "react-icons/ri";
import {useNavigate} from "react-router-dom";
import Popup from '../compoment/Popup';
import html2canvas from 'html2canvas';
import {BsEmojiSmile} from "react-icons/bs";
import {IoMdClose} from "react-icons/io";

function Lorem(props: { count: number }) {
  return null;
}

function Acceuil() {
  const [publications, setPublications] = useState([]);
  const [comments, setComments] = useState({});
  const [isCommentFormOpenList, setIsCommentFormOpenList] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});
  const [isStorySelected, setIsStorySelected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedPublicationId, setSelectedPublicationId] = useState(null);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef(null);
  const [showReplies, setShowReplies] = useState(false);




  const cacheDuration = 1000 * 60 * 5; // 5 minutes
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/connexion');
    }
  }, [navigate]);

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
      const cachedPublications = JSON.parse(cachedData);
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
  const handleClickOutsidePopup = (event) => {
    if (popupRef.current && !popupRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsidePopup);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsidePopup);
    };
  }, []);

  let pressTimer;

  const handleLongPress2 = (publicationId) => {
    setSelectedPublicationId(publicationId);
    setShowPopup(true);
  };

  const startPress = (publicationId) => {
    pressTimer = window.setTimeout(() => handleLongPress2(publicationId), 400); // Réduire la durée à 100ms
  };


  const cancelPress = () => {
    window.clearTimeout(pressTimer);
  };

  const handleSave = async () => {
    const publicationElement = document.getElementById(`publication-${selectedPublicationId}`);
    if (publicationElement) {
      const canvas = await html2canvas(publicationElement);
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = `publication_${selectedPublicationId}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setShowPopup(false);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  const closeCommentForm = (index) => {
    setIsCommentFormOpenList(prevState => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };

  const longPressEvent = useLongPress(handleLongPress, { delay: 8000 });

  return (
<div>
  {showPopup && <div className="dark-overlay2"></div>}
  <div className={`${isStorySelected ? 'no-background' : ''}`} onMouseDown={handleLongPress}
       {...longPressEvent}
       style={{ userSelect: 'none', overflow: "hidden" }}
  >
    {!isStorySelected && <NavBar />}
    <div className="conversation active"  style={{height: "100vh", overflow: "auto", paddingBottom: 250}}>
      <Stories onStorySelect={handleStorySelect} />
      {loading && (!publications || publications.length === 0) ? (
          <>
            <Skeleton count={5} baseColor="#030f1e" height={200} />
          </>
      ) : (
          publications.map((publication, index) => (
              <>
              <div
                  key={publication.id}
                  className="publication"
                  style={{ borderTop: '2px solid gray' }}
                  onTouchStart={() => startPress(publication.id)}
                  onTouchEnd={cancelPress}
                  onTouchMove={cancelPress}
              >
                {publication.photo_file && <img src={publication.photo_file} alt="Publication" />}
                <div className="publication-header" >
                  <img src={`${publication.utilisateur_image}`} alt="Profil de l'utilisateur" className="user-profile" />
                  <div className="user-info">
                    <p style={{display: "flex"}} className="user-name">{publication.utilisateur_nom} {publication.utilisateur_prenom} <RiVerifiedBadgeFill style={{color: "blue", fontSize: 20, marginLeft: 10}} /></p>
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
                <div className="publication-content"
                     id={`publication-${publication.id}`}
                     style={{
                  minHeight: 400,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  whiteSpace: 'pre-wrap',
                  color: "white",
                  fontSize: 20,
                  background: publication.photo_file ? '' : publication.couleur_fond,
                  textShadow: `1px 1px 1px #919191,
                                1px 18px 6px rgba(16,16,16,0.4),
                                1px 30px 60px rgba(16,16,16,0.4)`
                }}>
                  {publication.contenu ? (
                      <>
                        <div style={{ whiteSpace: "pre-wrap"}}> {publication.contenu}</div>
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
                <div className="comment-section" style={{ display: isCommentFormOpenList[index] ? 'block' : 'none' }}>
                  <div className="comments-header">
                    <span>14 267 commentaires</span>
                    <button className="close-button" onClick={() => closeCommentForm(index)}><IoMdClose /></button>
                  </div>
                  <div className="commentaire-container" >
                    {comments[publication.id] && comments[publication.id].map((comment, commentIndex) => (
                        <div className="comment">
                          <div className="comment-header">
                            <span className="username">{comment.utilisateur_nom} {comment.utilisateur_prenom}</span>
                            <span className="date">{comment.date_comment}</span>
                          </div>
                          <p className="comment-text">: {comment.texte}</p>
                          <div className="comment-footer">
                            <span className="likes">❤️ 10</span>
                            <span className="replies" onClick={() => setShowReplies(!showReplies)}>
                          {showReplies ? 'Masquer les réponses' : `Afficher replies.length réponses`}
                        </span>
                          </div>
                          {showReplies &&
                              <div className="reply">
                                <div className="reply-header">
                                  <span className="username"></span>
                                  <span className="date"></span>
                                </div>
                                <p className="reply-text"></p>
                              </div>
                          }
                        </div>
                    ))}
                  </div>
                  <form className="commentaire-section-footer"
                      onSubmit={(e) => {
                        e.preventDefault();
                        submitComment(publication.id, commentTexts[publication.id]);
                      }}
                  >
                    <button className="emoji"><BsEmojiSmile /></button>
                    <input
                        name="texte"
                        type="text"
                        className="comment-input"
                        placeholder="Ajouter un commentaire..."
                        value={commentTexts[publication.id] || ''}
                        onChange={(e) => handleCommentChange(e.target.value, publication.id)}
                    />
                    <button className="submit-button" ><IoSendSharp /></button>
                  </form>

                </div>
              </div>
              </>
          ))
      )}
    </div>
    {showPopup && <Popup ref={popupRef} onSave={handleSave} onClose={handleClosePopup} />}
    {!isStorySelected && <BottomTab />}
  </div>
</div>
  );
}

export default Acceuil;
