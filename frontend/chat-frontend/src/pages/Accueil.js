import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BottomTab from "./BottomTab";
import NavBar from "./NavBar";
import './css/acceuil.css'
import likeSon from './son/likesSon.mp3'

function Acceuil() {
 const [publications, setPublications] = useState([]);
  const [comments, setComments] = useState({});
 const [isCommentFormOpenList, setIsCommentFormOpenList] = useState([]);
 const [commentTexts, setCommentTexts] = useState({});


  useEffect(() => {
    async function fetchPublications() {
      try {
          const token = localStorage.getItem('token');
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/inscription/`);
        setPublications(response.data);
         setIsCommentFormOpenList(new Array(response.data.length).fill(false));
         for (let publication of response.data) {
        await fetchComments(publication.id);
      }

      } catch (error) {
        console.error('Erreur lors du chargement des publications:', error);
      }
    }

    fetchPublications();

   const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}Utilisateur/api/comment_sse/`);
eventSource.onmessage = async (event) => {
  const data = JSON.parse(event.data);
  if (data.comments && data.comments.length > 0) { // Vérifiez d'abord si des commentaires sont présents
    const publicationId = data.comments[0].publication_id; // Accédez au premier commentaire pour obtenir publication_id
    await fetchComments(publicationId);
  } else {
    console.error('Aucun commentaire reçu dans les données de l\'événement');
  }
};

    return () => eventSource.close();
  }, []);

  async function fetchComments(publicationId) {
    try {
        const token = localStorage.getItem('token'); // Récupérer le token JWT du stockage local
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Ajouter le token aux en-têtes

      const response = await axios.get(`${process.env.REACT_APP_API_URL}Utilisateur/api/get_comments/${publicationId}`);
      setComments(prevComments => ({
        ...prevComments,
        [publicationId]: response.data
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
    }
  }


// Dans votre composant React
const submitComment = async (publicationId, texte) => {
    try {

const token = localStorage.getItem('token');
console.log(token)
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
        // Mettez à jour l'état pour afficher le nouveau commentaire
    } catch (error) {
        console.error('Erreur lors de l\'envoi du commentaire:', error);
    }
}



const getLikedPublicationsFromLocalStorage = () => {
    const likedPublications = localStorage.getItem('likedPublications');
    return likedPublications ? JSON.parse(likedPublications) : {};
};

// Fonction pour enregistrer les informations sur les likes dans le localStorage
const saveLikedPublicationsToLocalStorage = (likedPublications) => {
    localStorage.setItem('likedPublications', JSON.stringify(likedPublications));
};

// Initialisation de l'état des publications à partir du localStorage
const initialLikedPublications = getLikedPublicationsFromLocalStorage();

// Fonction pour mettre à jour l'état des likes et enregistrer dans le localStorage
const updateLikedPublications = (publicationId, liked) => {
    const updatedLikedPublications = { ...initialLikedPublications, [publicationId]: liked };
    console.log( liked)
    saveLikedPublicationsToLocalStorage(updatedLikedPublications);
};

// Fonction pour vérifier si une publication est aimée
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
                publication.id === publicationId ? { ...publication, liked: response.data.liked } : publication
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
  return (

    <div>
         <NavBar />
        <div className="conversation active">
            {publications.map((publication, index) => (
                <div key={publication.id} className="publication">
                    {publication.photo_file && <img src={publication.photo_file} alt="Publication"/>}

                    <div className="publication-header">
                        <img src={`${publication.utilisateur_image}`} alt="Profil de l'utilisateur"
                             className="user-profile"/>
                        <div className="user-info">
                            <p className="user-name">{publication.utilisateur_nom} {publication.utilisateur_prenom}</p>
                            <p className="publication-time"><i className="bi bi-globe-americas"></i> Il y a
                                photo.date_pub</p>
                        </div>
                    </div>
                    {!publication.contenu && (
                        <>
                            <p>{publication.titre}</p>
                        </>
                    )}

                    <div className="publication-content" style={{
                        minHeight: 400,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "white",
                        backgroundImage:
                        publication.couleur_fond
                    }}>
                        {publication.contenu ? (
                            <>
                                {publication.contenu}
                            </>
                        ) : (
                            <>
                                <img src={`${publication.photo_file_url}`} className="publication-image"
                                     alt="Publication"/>
                            </>
                        )}

                    </div>
                    <div className="row publication-actions">
                        <div className="col-4 likes-container" style={{fontSize: 11, paddingLeft: 20}}>
                            <button className="action-button" id="like-button"
                                    onClick={() => likePublication(publication.id)}>
                                <i className={`bi ${isPublicationLiked(publication.id) ? 'bi-heart-fill liked' : 'bi-heart'}`}></i>
                            </button>
                            <span className="likes-count">
                     nombre de like
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
                                   onChange={(e) => handleCommentChange(e.target.value, publication.id)}/>

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

export default Acceuil;
