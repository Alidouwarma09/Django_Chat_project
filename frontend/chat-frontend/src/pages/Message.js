import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './css/message.css';
import { IoReloadSharp, IoSendSharp } from 'react-icons/io5';
import { Spinner } from '@chakra-ui/react';
import { Box } from '@mui/material';
import Icon from 'antd/es/icon';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { RiHeartLine } from 'react-icons/ri';

function Message() {
  const { utilisateurId } = useParams();
  const [utilisateur, setUtilisateur] = useState(null);
  const [messageTexte, setMessageTexte] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [heartClicked, setHeartClicked] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/connexion');
    }
  }, [navigate]);


  useEffect(() => {
    const utilisateurs = JSON.parse(localStorage.getItem('utilisateurs'));
    if (utilisateurs) {

      const foundUser = utilisateurs.find(user => user.id === parseInt(utilisateurId));
      if (foundUser) {
        setUtilisateur(foundUser);
        setTimeout(() => {
          setInitialLoading(false);
        }, 500);
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

  useEffect(() => {
    if (!initialLoading) {
      scrollToBottom();
    }
  }, [messages, initialLoading]);

  const handleMessageSend = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('utilisateur_id', utilisateurId);

      if (heartClicked) {
        formData.append('contenu_message', '❤️');
        setHeartClicked(false);
      } else {
        formData.append('contenu_message', messageTexte);
      }

      setLoading(true);
      setMessageTexte('');
      scrollToBottom();
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
        console.log("succes");
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
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
  const handleUserDetailClick1 = (utilisateurId) => {
    navigate(`/userdetails/${utilisateurId}`);
    console.log(utilisateurId);
  };
  return (
      <div className="chat-container">
        <div className="conversation-top">
          <IoMdArrowRoundBack size={30} onClick={handleBack} />
          <div className="conversation-user">
            <img className="conversation-user-image" src={utilisateur?.image} alt="User" onClick={() => handleUserDetailClick1(utilisateur.id)} />
            <span className="conversation-user-name">{utilisateur?.nom}</span>
          </div>
        </div>
        <div className="conversation-main">
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
          <div ref={messagesEndRef} />
          {loading && <IoReloadSharp className="loading rotate" />}
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

          {messageTexte ? (
              <button type="submit" className="conversation-form-button conversation-form-submit"><IoSendSharp /></button>
          ) : (
              <button type="submit" className="conversation-form-button conversation-form-submit" onClick={() => setHeartClicked(true)}>
                <RiHeartLine />
              </button>
          )}
        </form>
      </div>
  );
}

export default Message;
