
import { useNavigate } from 'react-router-dom';
import './css/navbar.css';
import { CiMenuBurger } from "react-icons/ci";
import {useState} from "react";
import { Progress } from 'antd';
import { notification } from 'antd';

function Navbar() {
    const [publicationSectionVisible, setPublicationSectionVisible] = useState(false);
  const navigate = useNavigate();
  const [selectedBackground, setSelectedBackground] = useState('');
  const [textPreview, setTextPreview] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
    const [publishSuccess, setPublishSuccess] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);

  const handleMenuClick = () => {
    navigate('/parametre/');
  };
 const handlePublicationClick = () => {
        setPublicationSectionVisible(true);
    };
 const handleBackgroundClick = (background) => {
        setSelectedBackground(background);
    };
 const handleTextChange = (event) => {
        setTextPreview(event.target.value);
    };
const handlePublication = () => {
    setIsPublishing(true); // Commencer la publication
     const token = localStorage.getItem('token');
        fetch(`${process.env.REACT_APP_API_URL}/Utilisateur/api/creer_publication/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': '{{ csrf_token }}',
                'Authorization': `Token ${token}`
            },
            body: JSON.stringify({
                texte: textPreview,
                couleur_fond: selectedBackground
            })
        })
        .then(response => {
            if (response.ok) {
               setTimeout(() => {
            setIsPublishing(false);
            setProgressPercent(100);
            notification.success({ message: 'Votre contenu a été publié avec succès' });
            setTextPreview('');
            setSelectedBackground('');
            setPublicationSectionVisible(false);
        }, 3000);
            }
        })
        .then(data => {
            console.log(data);
            setTextPreview('');
            setSelectedBackground('');
            setPublicationSectionVisible(false);
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    };
  const handlePublishSectionClose = () => {
      setPublicationSectionVisible(false)
    };
  return (
      <div>
          <div id="publicationSection" style={{display: publicationSectionVisible ? 'block' : 'none'}}>
              <i onClick={handlePublishSectionClose} style={{fontSize: 30}} className="bi bi-x-circle-fill"></i>
              <form className="publier_text_form" id="publicationForm" method="post">
                  <textarea id="texteInput" name="texte" placeholder="Écrivez votre publication ici"
                            onChange={handleTextChange}></textarea>
                  <input type="hidden" id="couleurFondHidden" name="couleur_fond" value=""/>
                  <div id="backgroundOptions" style={{overflowX: "auto", whiteSpace: "nowrap"}}>
                      <div className="backgroundOption"
                           data-value="linear-gradient(to bottom, rgba(255,128,255,0.5), rgba(0,0,128,0.5))" style={{
                          backgroundImage: "linear-gradient(to bottom, rgba(255,128,255,0.5), rgba(0,0,128,0.5))",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "inline-block",
                          marginRight: "10px"
                      }}
                           onClick={() => handleBackgroundClick("linear-gradient(to bottom, rgba(255,128,255,0.5), rgba(0,0,128,0.5))")}></div>
                      <div className="backgroundOption"
                           data-value="linear-gradient(to bottom, rgba(128,0,128,0.5), rgba(0,0,128,0.5))" style={{
                          backgroundImage: "linear-gradient(to bottom, rgba(128,0,128,0.5), rgba(0,0,128,0.5))",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "inline-block",
                          marginRight: "10px"
                      }}
                           onClick={() => handleBackgroundClick("linear-gradient(to bottom, rgba(128,0,128,0.5), rgba(0,0,128,0.5))")}></div>
                      <div className="backgroundOption"
                           data-value="linear-gradient(to bottom, rgba(0,128,0,0.5), rgba(0,0,128,0.5))" style={{
                          backgroundImage: "linear-gradient(to bottom, rgba(0,128,0,0.5), rgba(0,0,128,0.5))",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "inline-block",
                          marginRight: "10px"
                      }}
                           onClick={() => handleBackgroundClick("linear-gradient(to bottom, rgba(0,128,0,0.5), rgba(0,0,128,0.5))")}></div>
                      <div className="backgroundOption"
                           data-value="linear-gradient(to bottom, rgba(255,105,180,0.5), rgba(255,165,0,0.5))" style={{
                          backgroundImage: "linear-gradient(to bottom, rgba(255,105,180,0.5), rgba(255,165,0,0.5))",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "inline-block",
                          marginRight: "10px"
                      }}
                           onClick={() => handleBackgroundClick("linear-gradient(to bottom, rgba(255,105,180,0.5), rgba(255,165,0,0.5))")}></div>
                      <div className="backgroundOption"
                           data-value="linear-gradient(90deg, #020024 0%, #090979 35%, #00d4ff 100%)" style={{
                          backgroundImage: "linear-gradient(90deg, #020024 0%, #090979 35%, #00d4ff 100%)",
                          borderRadius: "50%",
                          width: "50px",
                          height: "50px",
                          display: "inline-block",
                          marginRight: "10px"
                      }}
                           onClick={() => handleBackgroundClick("linear-gradient(90deg, #020024 0%, #090979 35%, #00d4ff 100%)")}></div>
                  </div>
                  <h3>Aperçu</h3>
                  <div id="preview" style={{background: selectedBackground}}>
                      <div id="textePreview">{textPreview}</div>
                  </div>
                  <button id="publicationButton" type="button" onClick={handlePublication}>Publier</button>
              </form>
          </div>
          {isPublishing && <Progress percent={50} status="active" />} {/* Barre de progression */}
          <nav className="navbar">
              <i id="publication-action-icon" className="bi bi-fonts" onClick={handlePublicationClick}></i>
              <i id="video-icon" className="bi bi-camera-video"></i>
              <i id="photo-icon" className="bi bi-patch-plus"></i>

              <div className="profile-dropdown" style={{marginLeft: 'auto'}}>
                  <div className="profile-dropdown-btn">
                      <div className="menu" onClick={handleMenuClick}>
                          <CiMenuBurger/>
                      </div>
                  </div>
              </div>
          </nav>
      </div>

  )
      ;
}

export default Navbar;
