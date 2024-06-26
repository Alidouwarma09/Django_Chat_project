import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './css/message.css';
import { IoReloadSharp, IoSendSharp } from 'react-icons/io5';
import { Spinner } from '@chakra-ui/react';
import { Box } from '@mui/material';
import Icon from 'antd/es/icon';
import { IoMdArrowRoundBack } from 'react-icons/io';

function Message() {
  const { utilisateurId } = useParams();
  const [utilisateur, setUtilisateur] = useState(null);
  const [messageTexte, setMessageTexte] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const utilisateurs = JSON.parse(localStorage.getItem('utilisateurs'));
    if (utilisateurs) {
      const foundUser = utilisateurs.find(user => user.id === parseInt(utilisateurId));
      if (foundUser) {
        setUtilisateur(foundUser);
      } else {
        console.error('Utilisateur non trouvé');
      }
    } else {
      console.error('Utilisateurs non trouvés dans le localStorage');
    }
  }, [utilisateurId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || !utilisateurId) {
      return;
    }

    const storedMessages = JSON.parse(localStorage.getItem(`messages_${utilisateurId}`));
    if (storedMessages) {
      setMessages(storedMessages);
    }

    const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/Utilisateur/api/message_sse?token=${token}&utilisateur_id=${utilisateurId}`, { mode: 'cors' });
    eventSource.onmessage = (event) => {
      const { message: newMessages } = JSON.parse(event.data);
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        newMessages.forEach(newMsg => {
          if (!prevMessages.find(msg => msg.id === newMsg.id)) {
            updatedMessages.push(newMsg);
          }
        });

        localStorage.setItem(`messages_${utilisateurId}`, JSON.stringify(updatedMessages));

        return updatedMessages;
      });
    };

    return () => {
      eventSource.close();
    };
  }, [utilisateurId]);

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

  if (!utilisateur) {
    return (
        <div className="loading-container">
          <Box textAlign="center" mt="10" className="conversation-wrapper">
            <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="blue.500"
                size="xl"
                className="loading-container"
            />
            <Icon as={IoReloadSharp} className="loading-icon" />
          </Box>
        </div>
    );
  }

  const handleBack = () => {
    navigate(-1);
  };

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const currentUserId = userInfo?.id;

  function formatDate(timestamp) {
    const messageDate = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Aujourd\'hui';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Hier';
    } else {
      return messageDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
  }

  return (
      <div className="chat-container">
        <div className="conversation-top">
          <button type="button" className="conversation-back" onClick={handleBack}><IoMdArrowRoundBack /></button>
          <div className="conversation-user">
            <img className="conversation-user-image"
                 src={utilisateur.image}
                 alt={`${utilisateur.nom} ${utilisateur.prenom}`}
            />
            <div>
              <div className="conversation-user-name">{utilisateur.nom_utilisateur} {utilisateur.prenom_utilisateur}</div>
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
            {messages.map((message, index) => (
                <div key={index}>
                  <div className="coversation-divider">
                    <span>{formatDate(message.timestamp)}</span>
                  </div>
                  <li className={`conversation-item ${message.utilisateur_envoi !== currentUserId ? 'mon-message' : ''}`}>
                    <div className="conversation-item-content">
                      <div className="conversation-item-wrapper">
                        <div className="conversation-item-box">
                          <div className="conversation-item-text">
                            <p>{message.contenu_message}</p>
                            <div className="conversation-item-time">{new Date(message.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </div>
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

          <button type="submit" className="conversation-form-button conversation-form-submit"><IoSendSharp /></button>
        </form>
      </div>
  );
}

export default Message;
