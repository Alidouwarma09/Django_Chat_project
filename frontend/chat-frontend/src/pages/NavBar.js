import { useNavigate } from 'react-router-dom';
import './css/navbar.css';
import { CiMenuBurger } from "react-icons/ci";
import { useState, useRef, useEffect, useCallback } from "react";
import { Progress, notification } from 'antd';
import { BsPlusSquareDotted } from "react-icons/bs";

function Navbar() {
    const [publicationSectionVisible, setPublicationSectionVisible] = useState(false);
    const [VideoSectionVisible, setVideoSectionVisible] = useState(false);
    const navigate = useNavigate();
    const [selectedBackground, setSelectedBackground] = useState('');
    const [textPreview, setTextPreview] = useState('');
    const [videoPreview, setVideoPreview] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [navbarBublicationVisible, setNavbarBublicationVisible] = useState(false);
    const navbarBublicationRef = useRef(null);

    const handleMenuClick = () => {
        navigate('/parametre/');
    };

    const handleClickOutside = useCallback((event) => {
        if (navbarBublicationRef.current && !navbarBublicationRef.current.contains(event.target)) {
            setNavbarBublicationVisible(false);
        }
    }, []);

    useEffect(() => {
        if (navbarBublicationVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [navbarBublicationVisible, handleClickOutside]);

    const handlePublicationClick = () => {
        setPublicationSectionVisible(true);
    };

    const handleVideoClick = () => {
        setVideoSectionVisible(true);
        document.getElementById('videoFileInput').click();
    };

    const handleBackgroundClick = (background) => {
        setSelectedBackground(background);
    };

    const handleTextChange = (event) => {
        setTextPreview(event.target.value);
    };

    const handleVideoChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const videoURL = URL.createObjectURL(selectedFile);
            setVideoPreview(videoURL);
        }
    };

    const handlePublication = () => {
        setIsPublishing(true);
        const interval = setInterval(() => {
            setProgressPercent(prevPercent => {
                const newPercent = prevPercent + 10;
                if (newPercent >= 100) {
                    clearInterval(interval);
                }
                return newPercent;
            });
        }, 1000);
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

    const handleVideo = () => {
        setIsPublishing(true);
        const interval = setInterval(() => {
            setProgressPercent(prevPercent => {
                const newPercent = prevPercent + 10;
                if (newPercent >= 100) {
                    clearInterval(interval);
                }
                return newPercent;
            });
        }, 1000);
        const token = localStorage.getItem('token');
        const titre = document.getElementById('texteInput1').value;

        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('video_file', document.getElementById('videoFileInput').files[0]);

        fetch(`${process.env.REACT_APP_API_URL}/Utilisateur/api/creer_publication_video/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'X-CSRFToken': '{{ csrf_token }}',
            },
            body: formData,
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Data:', data);
            if (data) {
                setTimeout(() => {
                    setIsPublishing(false);
                    setProgressPercent(100);
                    notification.success({ message: 'Votre contenu a été publié avec succès' });
                    setVideoSectionVisible(false);
                }, 3000);
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
        });
    };

    const handlePublishSectionClose = () => {
        setPublicationSectionVisible(false);
    };

    const handleVidishSectionClose = () => {
        setVideoSectionVisible(false);
    };

    const handleNavbarBublicationClick = () => {
        setNavbarBublicationVisible(!navbarBublicationVisible);
    };

    return (
        <div>
            <div id="publicationSection" style={{ display: publicationSectionVisible ? 'block' : 'none' }}>
                <i onClick={handlePublishSectionClose} style={{ fontSize: 30 }} className="bi bi-x-circle-fill"></i>
                <form className="publier_text_form" id="publicationForm" method="post">
                    <textarea id="texteInput" name="texte" placeholder="Écrivez votre publication ici"
                        onChange={handleTextChange}></textarea>
                    <input type="hidden" id="couleurFondHidden" name="couleur_fond" value="" />
                    <div id="backgroundOptions" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
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
                    <div id="preview" style={{ background: selectedBackground }}>
                        <div id="textePreview">{textPreview}</div>
                    </div>
                    <button id="publicationButton" type="button" onClick={() => {
                        handlePublication();
                        setPublicationSectionVisible(false);
                    }}>Publier
                    </button>
                </form>
            </div>
            <div id="publicationSection" style={{ display: VideoSectionVisible ? 'block' : 'none' }}>
                <i onClick={handleVidishSectionClose} style={{ fontSize: 30 }} className="bi bi-x-circle-fill"></i>
                <form className="publier_text_form" id="videoForm" method="post">
                    <textarea id="texteInput1" name="titre" placeholder="Éntrer un titre"></textarea>
                    <input id="videoFileInput" type="file" name="video_file" accept="video/*" style={{ display: 'none' }}
                        onChange={handleVideoChange} />
                    <h3>Aperçu</h3>
                    <div id="preview">
                        {videoPreview && (
                            <video id="videoPreview" controls>
                                <source src={videoPreview} type="video/mp4" />
                                Votre navigateur ne supporte pas la lecture de vidéos HTML5.
                            </video>
                        )}
                    </div>
                    <button id="publicationButton" type="button" onClick={() => {
                        handleVideo();
                        setPublicationSectionVisible(false);
                    }}>Publier
                    </button>
                </form>
            </div>
            {isPublishing && (
                <Progress
                    percent={progressPercent}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        zIndex: 9999,
                        fontSize: '40px',
                        strokeColor: "red",
                    }}
                    status="active" />)}
            <nav className="navbar">
                <BsPlusSquareDotted onClick={handleNavbarBublicationClick} />
                <div className="profile-dropdown" style={{ marginLeft: 'auto' }}>
                    <div className="profile-dropdown-btn">
                        <div className="menu" onClick={handleMenuClick}>
                            <CiMenuBurger />
                        </div>
                    </div>
                </div>
            </nav>
            {navbarBublicationVisible && (
                <nav className="navbarBublication" ref={navbarBublicationRef}>
                    <p onClick={handlePublicationClick}><i id="publication-action-icon" className="bi bi-fonts"></i> Publication</p>
                    <p onClick={handleVideoClick}><i id="video-icon" className="bi bi-camera-video"></i>Mettre en ligne une video </p>
                    <p><i id="photo-icon" className="bi bi-patch-plus"></i> Partager une image</p>
                </nav>
            )}
        </div>
    );
}

export default Navbar;
