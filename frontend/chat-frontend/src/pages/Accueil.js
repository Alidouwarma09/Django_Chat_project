import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BottomTab from "./BottomTab";
import './css/acceuil.css'
function Acceuil() {
 const [publications, setPublications] = useState([]);
  const [comments, setComments] = useState({});

  useEffect(() => {
    async function fetchPublications() {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/get_publications/`);
        setPublications(response.data);
      } catch (error) {
        console.error('Erreur lors du chargement des publications:', error);
      }
    }

    fetchPublications();

    const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}Utilisateur/api/comment_sse/`);
    eventSource.onmessage = async (event) => {
      const { publication_id } = JSON.parse(event.data);
      await fetchComments(publication_id);
    };

    return () => eventSource.close();
  }, []);

  async function fetchComments(publicationId) {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}Utilisateur/api/get_comments/${publicationId}`);
      setComments(prevComments => ({
        ...prevComments,
        [publicationId]: response.data
      }));
    } catch (error) {
      console.error('Erreur lors de la récupération des commentaires:', error);
    }
  }
  return (
    <div className="conversation active">
      {publications.map(publication => (
          <div key={publication.id} className="publication">
            {publication.photo_file && <img src={publication.photo_file} alt="Publication"/>}

            <div className="publication-header">
              <img src={`${publication.utilisateur_image}`} alt="Profil de l'utilisateur" className="user-profile"/>
              <div className="user-info">
                <p className="user-name">{ publication.utilisateur_nom } { publication.utilisateur_prenom }</p>
                <p className="publication-time"><i className="bi bi-globe-americas"></i> Il y a photo.date_pub</p>
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
              justifContent: "center",
              alignItems: "center",
              color: "white",
              backgroundImage:
              publication.couleur_fond
            }}>
             {publication.contenu ? (
                <>

                </>
              ) : (
                 <>
                   <img src={`${publication.photo_file_url}`} className="publication-image" alt="Publication"/>
                 </>
             )}

            </div>
            <div className="row publication-actions">
              <div className="col-4 likes-container" style={{fontSize: 11, paddingLeft: 20}}>
                <button className="action-button" id="like-button" data-publication-id=" photo.id">
                  <i className="bi bi-heart-fill"></i>
                </button>
                <span className="likes-count">
                                </span> likes
              </div>
              <div className="col-4 comment-count-container" style={{ fontSize: 11, paddinRight: 20}}>
                <button className="action-button" id="comment-button" data-publicationafficher-id=" photo.id "><i
                    className="bi bi-chat"></i></button>
                <span className="comment-count" id="comment-count- photo.id"></span> commentaires
              </div>
              <div className="col-4 comment-count-container"
                   style={{ fontSize: 10,  paddinRight: 30, marginRight: 10 }}>
                <span className="comment-count">15,42k</span> Vues
              </div>
            </div>

            <div className="comments-section" id="comments-section- photo.id "
                 data-url="" style={{ overflowY: "auto",  overflowX: "hidden", maxHeight: 300 }} >
              <div className="comments-container" id="comments-container- photo.id ">
               {comments[publication.id] && comments[publication.id].map((comment, index) => (
                        <div key={index} className="comment">
                            <p className="comment-user">{comment.utilisateur_nom} {comment.utilisateur_prenom}</p>
                            <p className="comment-text">{comment.texte}</p>
                            <p className="comment-time">{comment.date_comment}</p>
                        </div>
                    ))}
              </div>
              <form className="commentaire-form" id="commentaire-form-photo.id ">
                <input type="text" className="commentaire-input" id="commentaire-input-photo.id "
                       placeholder="Écrivez un commentaire..."/>
                <button type="submit" data-publications-id=" photo.id ">▶️</button>
              </form>
            </div>

          </div>

      ))}
      <BottomTab />
    </div>
  );
}

export default Acceuil;
