import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import './css/message.css';
import {IoReloadSharp} from "react-icons/io5";

function Message() {
  const { utilisateurId } = useParams();
  const [utilisateur, setUtilisateur] = useState(null);
  const [messageTexte, setMessageTexte] = useState('');
  const [messageImage, setMessageImage] = useState(null);
  const [messageAudio, setMessageAudio] = useState(null);
   const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
     const navigate = useNavigate();
      const [messagesLoaded, setMessagesLoaded] = useState(false); // État pour suivre si les messages ont déjà été chargés



  useEffect(() => {
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
        setUtilisateur(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      }
    };

    fetchUtilisateur();
  }, [utilisateurId]);

  useEffect(() => {
    const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/Utilisateur/api/message_sse`);
    eventSource.onmessage = (event) => {
      const { message: newMessage } = JSON.parse(event.data);
      setMessages(prevMessages => [...prevMessages, ...newMessage]);
    };
    return () => {
      eventSource.close();
    };
  }, []);
const handleMessageSend = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
    formData.append('utilisateur_id', utilisateurId);
    formData.append('contenu_message', messageTexte);

    setLoading(true);

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/Utilisateur/api/envoyer_message_text/`,
      formData,
      {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );

      if (response.data.status === 'success') {
        setMessageTexte('');
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleImageSend = async (e) => {
    e.preventDefault();
    if (!messageImage) return;
    const formData = new FormData();
    formData.append('utilisateur_id', utilisateurId);
    formData.append('images', messageImage);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/envoyer_message_images/`, formData, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status === 'success') {
        setMessageImage(null);
        // Handle successful image message send
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'image:', error);
    }
  };
  const handleAudioSend = async (e) => {
    e.preventDefault();
    if (!messageAudio) return;
    const formData = new FormData();
    formData.append('utilisateur_id', utilisateurId);
    formData.append('audio', messageAudio);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/envoyer_message_audio/`, formData, {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      if (response.data.status === 'success') {
        setMessageAudio(null);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'audio:', error);
    }
  };
  if (!utilisateur) {
    return <div>Chargement...</div>;
  }
   const handleBack = () => {
    navigate(-1);
  };
  return (
      <div>
          <div className="chat-container">
            <div className="chat-content">
              <div className="conversation active" id="conversation-1">
                <div className="conversation-top">
                  <button type="button" className="conversation-back" onClick={handleBack}><i className="ri-arrow-left-line"></i></button>
                  <div className="conversation-user">
                    <img className="conversation-user-image"
                         src={utilisateur.image_utilisateur}
                         alt={`${utilisateur.nom_utilisateur} ${utilisateur.prenom_utilisateur}`}
                    />
                    <div>
                      <div
                          className="conversation-user-name">{utilisateur.nom_utilisateur} {utilisateur.prenom_utilisateur}</div>
                      <div className="conversation-user-status online">En ligne</div>
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
                    <div className="coversation-divider"><span>Aujourd'hui</span></div>
                    {messages.map((message, index) => (
                      <li key={index} className="conversation-item me">
                        <div className="conversation-item-content">
                          <div className="conversation-item-wrapper">
                            <div className="conversation-item-box">
                              <div className="conversation-item-text">
                                <p>{message.contenu_message}</p>
                                <div className="conversation-item-time">{message.timestamp}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                   {loading && <IoReloadSharp className="loading rotate" />}
                  </ul>
                </div>
                <form className="conversation-form" onSubmit={handleMessageSend}>
                  <button type="button" className="conversation-form-button"><i className="ri-emotion-line"></i>
                  </button>

                  <div className="conversation-form-group">
                    <textarea className="conversation-form-input" rows="1" placeholder="Votre message ici..."
                              value={messageTexte} onChange={(e) => setMessageTexte(e.target.value)}></textarea>
                    <button type="button" className="conversation-form-record"><i className="ri-mic-line"></i>
                    </button>
                  </div>

                  <button type="submit" className="conversation-form-button conversation-form-submit"><i
                      className="ri-send-plane-2-line"></i></button>
                </form>
              </div>
            </div>
          </div>
      </div>
  );
}

export default Message;
