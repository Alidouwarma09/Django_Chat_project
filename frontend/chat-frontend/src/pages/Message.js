import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './css/message.css'

function Message() {
  const { utilisateurId } = useParams();
  const [utilisateur, setUtilisateur] = useState(null);

  useEffect(() => {
    console.log('utilisateurId:', utilisateurId);
    const fetchUtilisateur = async () => {
      if (!utilisateurId) {
        console.error('ID d\'utilisateur manquant dans l\'URL');
        return;
      }

      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/utilisateurs_select/${utilisateurId}/`, {
          headers: {
            'Authorization': `Token ${token}`
          }
        });
        console.log('Réponse de l\'API:', response.data);
        setUtilisateur(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    };

    fetchUtilisateur();
  }, [utilisateurId]);

  if (!utilisateur) {
    return <div>Aucun utilisateur sélectionné</div>;
  }

  return (
      <div>
        <section className="chat-section">
          <div className="chat-container">
            <div className="chat-content">
              <div className="conversation active" id="conversation-1">
                <div className="conversation-top">
                  <button type="button" className="conversation-back"><i className="ri-arrow-left-line"></i></button>
                  <div className="conversation-user">
                    <img className="conversation-user-image"
                         src={utilisateur.image_utilisateur}
                         alt={`${utilisateur.nom_utilisateur} ${utilisateur.prenom_utilisateur}`}
                    />
                    <div>
                      <div
                          className="conversation-user-name">{utilisateur.nom_utilisateur} {utilisateur.prenom_utilisateur}</div>
                      <div className="conversation-user-status online">online</div>
                    </div>
                  </div>
                  <div className="conversation-buttons">
                    <button type="button"><i className="ri-phone-fill"></i></button>
                    <button type="button"><i className="ri-vidicon-line"></i></button>
                    <button type="button"><i className="ri-information-line"></i></button>
                  </div>
                </div>
                <div className="conversation-main">
                  <ul className="conversation-wrapper">
                    <div className="coversation-divider"><span>Today</span></div>
                    {/* Messages here */}
                  </ul>
                </div>
                <div className="conversation-form">
                  <button type="button" className="conversation-form-button"><i className="ri-emotion-line"></i>
                  </button>
                  <div className="conversation-form-group">
                    <textarea className="conversation-form-input" rows="1" placeholder="Type here..."></textarea>
                    <button type="button" className="conversation-form-record"><i className="ri-mic-line"></i></button>
                  </div>
                  <button type="button" className="conversation-form-button conversation-form-submit"><i
                      className="ri-send-plane-2-line"></i></button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  );
}

export default Message;
