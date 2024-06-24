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
import Reponse from "../compoment/Réponse";
import {MdSaveAlt} from "react-icons/md";
import domtoimage from 'dom-to-image';



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
  const [replyingToCommentId, setReplyingToCommentId] = useState(null);
  const [isReplying, setIsReplying] = useState(false);
  const [showCommentOverlay, setShowCommentOverlay] = useState(false);
  const [replies, setReplies] = useState({});
  const [replyingToComments, setReplyingToComments] = useState({});






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
          await fetchCommentsAndReplies(publication.id);
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
    const fetchAllReplies = async () => {
      try {
        for (let publication of publications) {
          for (let comment of comments[publication.id] || []) {
            await fetchReponseCommentaire(comment.id);
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des réponses aux commentaires:', error);
      }
    };

    fetchAllReplies();
  }, [publications, comments]);

  const fetchCommentsAndReplies = async (publicationId) => {
    await fetchComments(publicationId);
    await fetchReponseCommentaire(publicationId);
  };
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


  const handleClickOutsideComment = (event) => {
    if (!event.target.closest('.comment-section')) {
      setShowCommentOverlay(false);
      setIsCommentFormOpenList(Array(isCommentFormOpenList.length).fill(false));
    }
  };




  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideComment);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideComment);
    };
  }, [isCommentFormOpenList]);

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
    setCommentTexts(prev => ({ ...prev, [publicationId]: '' }));
    try {
      const token = localStorage.getItem('token');
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

      await fetchComments(publicationId);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du commentaire:', error);
    }
  };
  const fetchReponseCommentaire = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/get_reponse_commentaire/${commentId}`);
      setReplies(prevReplies => ({
        ...prevReplies,
        [commentId]: response.data
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des réponses:', error);
    }
  };

  const submitReplyToComment = async ( commentId, texte) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/Utilisateur/api/post_reponse_commentaire/${commentId}`,
          JSON.stringify({ texte }),
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${token}`
            }
          }
      );
      await fetchReponseCommentaire(commentId);
      setReplyingToCommentId(null);
      setIsReplying(false);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la réponse au commentaire :', error);
    }
  };
  const handleReplyToComment = (commentId) => {
    setReplyingToComments((prevComments) => ({
      ...prevComments,
      [commentId]: !prevComments[commentId],
    }));
  };
  const handleCloseReponse = (commentId) => {
    setReplyingToComments((prevComments) => ({ ...prevComments, [commentId]: false }));
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
    setShowCommentOverlay(true);
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
    if (!event.target.closest('.popup-container')) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsidePopup);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsidePopup);
    };
  }, []);


  const handleLongPress2 = (publicationId) => {
    setSelectedPublicationId(publicationId);
    setShowPopup(true);
  };



  const handleSave = async () => {
    setShowPopup(false);
    try {
      const publicationElement = document.getElementById(`publication-${selectedPublicationId}`);
      if (publicationElement) {
        const canvas = await html2canvas(publicationElement);
        canvas.toBlob(blob => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `publication_${selectedPublicationId}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        });
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement de la capture d\'écran:', error);
    }
  };






  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutsideComment);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideComment);
    };
  }, [isCommentFormOpenList]);


  const closeCommentForm = (index) => {
    setShowCommentOverlay(false);
    setIsCommentFormOpenList(prevState => {
      const newState = [...prevState];
      newState[index] = false;
      return newState;
    });
  };

  const longPressEvent = useLongPress(handleLongPress, { delay: 8000 });

  const handleUserDetailClick = (utilisateurId) => {
    navigate(`/userdetails/${utilisateurId}`);
    console.log(utilisateurId);
  };
  return (
      <div>
        {showPopup && <div className="dark-overlay2"></div>}
        {showCommentOverlay && <div className="overlay-reponse" onClick={() => setShowCommentOverlay(false)}></div>}
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
                      >
                        {publication.photo_file && <img src={publication.photo_file} alt="Publication" />}
                        <div className="publication-header" >
                          <img src={`${publication.utilisateur_image}`} alt="Profil de l'utilisateur" className="user-profile" />
                          <div className="user-info" onClick={() => handleUserDetailClick(publication.utillisateur_id)}>
                            <p style={{display: "flex", fontFamily: "revert-layer"}} className="user-name">{publication.utilisateur_nom} {publication.utilisateur_prenom} <RiVerifiedBadgeFill style={{color: "blue", fontSize: 20, marginLeft: 10}} /></p>
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
                               background: publication.photo_file ? '' : publication.couleur_fond
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
                        <div style={{fontFamily: "cursive"}}>1 like et 3,12k commentaires</div>
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
                            <button className="action-button"
                                    onClick={() => toggleCommentForm(index)}><i
                                className="bi bi-chat"></i>
                              <span className="comment-count" id="comment-count- photo.id" style={{ fontSize: 15 }}>{comments[publication.id] ? comments[publication.id].length : 0}</span>
                            </button>

                          </div>
                          <div className="col-4 comment-count-container"
                               style={{ fontSize: 10 }}
                               onClick={()=> handleLongPress2(publication.id)}
                          >
                            <span style={{ borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}><MdSaveAlt  /></span>

                          </div>
                        </div>
                        <div className="comment-section" style={{ display: isCommentFormOpenList[index] ? 'block' : 'none' }}>
                          <div className="comments-header">
                            <span>{comments[publication.id] ? comments[publication.id].length : 0} commentaires</span>
                            <button className="close-button" onClick={() => closeCommentForm(index)}><IoMdClose /></button>
                          </div>
                          <div className="commentaire-container">
                            {comments[publication.id] && comments[publication.id].length > 0 && comments[publication.id].map((comment) => (
                                <div className="comment">
                                  <div className="comment-header">
                            <span style={{ display:"flex"}} >
                              <img  className="utilisateur_image_com" src={comment.utilisateur_image_com} alt="image"/>
                              <span style={{marginTop: "10%", marginLeft: 10, fontFamily: "fantasy"}}>
                                {comment.utilisateur_nom} {comment.utilisateur_prenom}
                              </span>
                            </span>
                                    <span className="username"></span>
                                    <span className="date">{comment.date_comment}</span>
                                  </div>
                                  <p className="comment-text">{comment.texte}</p>
                                  {replies[comment.id] && showReplies && (
                                      <div className="reply-list">
                                        {replies[comment.id].map(reply => (
                                            <div key={reply.id} className="reply-item">
                                              <div className="reply-header">
                                                <img src={reply.utilisateur_image_rep} alt="Profil de l'utilisateur" className="user-profile" />
                                                <div className="user-info">
                                                  <p className="user-name">{reply.utilisateur_nom} {reply.utilisateur_prenom}</p>
                                                  <p className="reply-time">{moment(reply.date_reponse).fromNow()}</p>
                                                </div>
                                              </div>
                                              <p className="reply-text">{reply.texte}</p>
                                            </div>
                                        ))}
                                      </div>
                                  )}
                                  <div className="comment-footer">

                                    <span className="likes">❤️ 10</span>
                                    <button className="reply-button" onClick={() => handleReplyToComment(comment.id)}>Répondre</button>
                                    {replyingToComments[comment.id] && (
                                        <Reponse
                                            key={`reply-${comment.id}`}
                                            onSubmit={(texte) => submitReplyToComment(comment.id, texte)}
                                            onClose={() => handleReplyToComment(comment.id)}
                                        />
                                    )}

                                    <span className="replies" onClick={() => setShowReplies(!showReplies)}>
                              {showReplies
                                  ? 'Masquer les réponses'
                                  : replies[comment.id] && replies[comment.id].length > 0
                                      ? 'Afficher les réponses'
                                      : ''}
                          </span>
                                  </div>

                                </div>
                            ))}
                            {comments[publication.id] && comments[publication.id].length === 0 && (
                                <p style={{textAlign: "center", fontSize: 12, fontFamily: "cursive"}}> Commenter en premier 😊</p>
                            )}
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
          {showPopup && <Popup ref={popupRef} onSave={handleSave}  />}
          {!isStorySelected && <BottomTab />}
        </div>
      </div>
  );
}

export default Acceuil;
