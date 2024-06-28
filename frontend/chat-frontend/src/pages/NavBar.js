import { useNavigate } from 'react-router-dom';
import './css/navbar.css';
import {CiLogout, CiMenuBurger} from "react-icons/ci";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {  notification } from 'antd';
import {LuRefreshCcw} from "react-icons/lu";
import { CircularProgress, CircularProgressLabel } from "@chakra-ui/react";
import axios from "axios";
import ThemeButton from "../compoment/ThemeButton";
import {IoIosNotifications, IoMdArrowRoundBack} from "react-icons/io";
import {GrDownload} from "react-icons/gr";
import {FaBloggerB, FaPhotoVideo, FaUserCog} from "react-icons/fa";
import {VscActivateBreakpoints} from "react-icons/vsc";
import {MdOutlineSystemUpdate} from "react-icons/md";
import {RiMoneyDollarCircleFill} from "react-icons/ri";
import {BsFillBarChartLineFill, BsFillPatchPlusFill} from "react-icons/bs";
import {ImVideoCamera} from "react-icons/im";
import {BiFontSize} from "react-icons/bi";
import {AiFillCloseCircle} from "react-icons/ai";



function Navbar() {
    const [publicationSectionVisible, setPublicationSectionVisible] = useState(false);
    const [VideoSectionVisible, setVideoSectionVisible] = useState(false);
    const [PhotoSectionVisible, setPhotoSectionVisible] = useState(false);
    const navigate = useNavigate();
    const [selectedBackground, setSelectedBackground] = useState('');
    const [textPreview, setTextPreview] = useState('');
    const [videoPreview, setVideoPreview] = useState('');
    const [photoPreview, setPhotoPreview] = useState('');
    const [isPublishing, setIsPublishing] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const [navbarBublicationVisible, setNavbarBublicationVisible] = useState(false);
    const navbarBublicationRef = useRef(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const sidebarRef = useRef(null);
    const [isRotating, setIsRotating] = useState(false);

    const handleMenuClick = () => {
        setSidebarVisible(!sidebarVisible);
    };
    const handleMenuClose = () => {
        setSidebarVisible(!sidebarVisible);
    };
    const handleOutsideClick = useCallback((event) => {
        if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
            setSidebarVisible(false);
        }
    }, []);

    useEffect(() => {
        if (sidebarVisible) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [sidebarVisible, handleOutsideClick]);

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
    useEffect(() => {
        const loadUserInfo = async () => {
            const storedUserInfo = localStorage.getItem('userInfo');
            if (storedUserInfo) {
                setUserInfo(JSON.parse(storedUserInfo));
            } else {
                try {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(`${process.env.REACT_APP_API_URL}/Utilisateur/api/user_info/`, {
                        headers: {
                            'Authorization': `Token ${token}`
                        }
                    });
                    setUserInfo(response.data);
                    localStorage.setItem('userInfo', JSON.stringify(response.data));
                } catch (error) {
                    console.error('Erreur lors de la récupération des informations utilisateur:', error);
                }
            }
        };

        loadUserInfo();
    }, []);

    const handlePublicationClick = () => {
        setPublicationSectionVisible(true);
        setNavbarBublicationVisible(false);
    };

    const handleVideoClick = () => {
        if (videoPreview) {
            setVideoPreview('');
        }
        setVideoSectionVisible(true);
        setNavbarBublicationVisible(false);
        document.getElementById('videoFileInput').click();
    };
    const handlePhotoClick = () => {
        if (photoPreview) {
            setPhotoPreview('');
        }
        setPhotoSectionVisible(true);
        setNavbarBublicationVisible(false);
        document.getElementById('photoFileInput').click();
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
    const handlePhotoChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const videoURL = URL.createObjectURL(selectedFile);
            setPhotoPreview(videoURL);
        }
    };

    const handlePublication = () => {
        handleVidishSectionClose()
        setIsPublishing(true);
        setNavbarBublicationVisible(false);
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
    const handleDeconnexion = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/Model/Deconnexion/`, {}, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            if (response.status === 200) {
                localStorage.removeItem('token');
                localStorage.removeItem('userInfo');
                navigate('/connexion')
            }
        } catch (error) {
            console.error('Erreur lors de la tentatidsdsve de déconnexion:', error);
        }
    };
    const handleVideo = () => {
        handleVidishSectionClose()
        setNavbarBublicationVisible(false);
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
    const handlePhoto = () => {
        handlePhotoishSectionClose()
        setNavbarBublicationVisible(false);
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
        const titre = document.getElementById('texteInput2').value;

        const formData = new FormData();
        formData.append('titre', titre);
        formData.append('photo_file', document.getElementById('photoFileInput').files[0]);

        fetch(`${process.env.REACT_APP_API_URL}/Utilisateur/api/creer_publication_photo/`, {
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
                        setPhotoSectionVisible(false);
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
        setVideoPreview('');
        setVideoSectionVisible(false);
    };
    const handlePhotoishSectionClose = () => {
        setPhotoSectionVisible(false);
        setPhotoPreview('');
    };

    const handleNavbarBublicationClick = () => {
        setNavbarBublicationVisible(!navbarBublicationVisible);
    };
    const handleReload = () => {
        setIsRotating(true);
    window.location.reload();
  };
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsRotating(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    const hundleProfile = () =>{
        navigate('/profile')
    }
    const hundleSolde = () =>{
        navigate('/solde')
    }

    return (
        <div >
            {navbarBublicationVisible && <div className="dark-overlay"></div>}
            {publicationSectionVisible && <div className="dark-overlay"></div>}
            <div className="dark-overlay" style={{ display: sidebarVisible ? 'block' : 'none' }}></div>
            {VideoSectionVisible && <div className="dark-overlay"></div>}
            {PhotoSectionVisible && <div className="dark-overlay"></div>}
            <div id="publicationSection" style={{ display: publicationSectionVisible ? 'block' : 'none' }}>
                <span onClick={handlePublishSectionClose}  style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}><AiFillCloseCircle  style={{ fontSize: 30 }}    /></span>
                <form className="publier_text_form" id="publicationForm" method="post">
                    <textarea id="texteInput" name="texte" placeholder="Écrivez votre publication ici"
                        onChange={handleTextChange}></textarea>
                    <input type="hidden" id="couleurFondHidden" name="couleur_fond" value="" />
                    <div id="backgroundOptions" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>
                        <div className="backgroundOption"
                            data-value="black" style={{
                                backgroundColor: "black",
                                borderRadius: "50%",
                                width: "50px",
                                height: "50px",
                                display: "inline-block",
                                marginRight: "10px"
                            }}
                            onClick={() => handleBackgroundClick("black")}></div>
                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#f44336",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#f44336")}></div>
                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#e91e63",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#e91e63")}></div>


                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#9c27b0",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#9c27b0")}></div>

                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#673ab7",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#673ab7")}></div>

                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#3f51b5",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#3f51b5")}></div>



                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#2196f3",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#2196f3")}></div>

                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#00bcd4",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#00bcd4")}></div>


                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#009688",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#009688")}></div>



                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#4caf50",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#4caf50")}></div>




                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#8bc34a",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#8bc34a")}></div>





                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#cddc39",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#cddc39")}></div>






                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#ffc107",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#ffc107")}></div>





                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#ff9800",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#ff9800")}></div>




                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#ff5722",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#ff5722")}></div>



                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#795548",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#795548")}></div>



                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#9e9e9e",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#9e9e9e")}></div>



                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#607d8b",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#607d8b")}></div>

                        <div className="backgroundOption"
                             data-value="black" style={{
                            backgroundColor: "#190935",
                            borderRadius: "50%",
                            width: "50px",
                            height: "50px",
                            display: "inline-block",
                            marginRight: "10px"
                        }}
                             onClick={() => handleBackgroundClick("#190935")}></div>

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
                        <div style={{ whiteSpace: "pre-wrap"}} id="textePreview">{textPreview}</div>
                    </div>
                    <button id="publicationButton" type="button" onClick={() => {
                        handlePublication();
                        setPublicationSectionVisible(false);
                    }}>Publier
                    </button>
                </form>
            </div>
            <div id="publicationSection" style={{ display: VideoSectionVisible ? 'block' : 'none' }}>
                <span onClick={handleVidishSectionClose}  style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}><AiFillCloseCircle  style={{ fontSize: 30 }}    /></span>
                <span onClick={handleVideoClick}  style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "50%", marginBottom: 10}}><FaPhotoVideo  style={{ fontSize: 30 }}  /></span>

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
            <div id="publicationSection" style={{ display: PhotoSectionVisible ? 'block' : 'none' }}>
                <span onClick={handlePhotoishSectionClose}  style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}><AiFillCloseCircle  style={{ fontSize: 30 }}    /></span>
                <span onClick={handlePhotoClick}  style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "50%", marginBottom: 10}}><FaPhotoVideo  style={{ fontSize: 30 }}  /></span>
                <form className="publier_text_form" id="photoForm" method="post">
                    <textarea id="texteInput2" name="titre" placeholder="Éntrer un titre"></textarea>
                    <input id="photoFileInput" type="file" name="photo_file" accept="image/*" style={{ display: 'none' }}
                           onChange={handlePhotoChange} />
                    <h3>Aperçu</h3>
                    <div id="preview">
                        {photoPreview && (
                            <img  id="photoPreview" src={photoPreview}  alt="Aperçu"/>
                        )}
                    </div>
                    <button id="publicationButton" type="button" onClick={() => {
                        handlePhoto();
                        setPublicationSectionVisible(false);
                    }}>Publier
                    </button>
                </form>
            </div>
            {isPublishing && (
                <CircularProgress value={progressPercent} color='green.400' style={{ top: 0, left: "50%", zIndex: 9999,
                                  }} status="active">
                    <CircularProgressLabel>{progressPercent}%</CircularProgressLabel>
                </CircularProgress>)}
            <nav className="navbar">
                <div style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}  className={`navbar__refresh ${isRotating ? 'rotating' : ''}`} onClick={handleReload}>
                    <LuRefreshCcw />
                </div>
                <div style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}} className="menu">
                    <IoIosNotifications /><span style={{fontSize: 60, color: "red", marginBottom: 60}}>.</span>
                </div>
                <div style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}} className="menu">
                    <GrDownload />
                </div>
                <div style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}} className="menu" onClick={handleMenuClick}>
                    <CiMenuBurger />
                </div>
            </nav>

            <nav className="sidebar"  style={{ display: sidebarVisible ? 'block' : 'none' }} ref={sidebarRef}>
                <header>
                    <div className="image-text">
                        <div style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center", position: "fixed"}}  onClick={handleMenuClose}>
                            <IoMdArrowRoundBack style={{fontSize: 30}} />
                        </div>
                        <span className="image-user">
                             <span style={{ marginLeft: 0, marginRight: 0,  height: 150, borderRadius: 20}}>
                                 <img src={`${userInfo.image_utilisateu}`} style={{ marginLeft: 60,  height: 150, borderRadius: 20}}
                                        alt="Trash Icon"/>
                             </span>
                            <span className="name" style={{ marginLeft: 0, marginRight: 0}}>{userInfo.nom_utilisateur} {userInfo.prenom_utilisateur} </span>
                         </span>

                    </div>
                </header>

                <div className="menu-bar">
                    <div className="menu">

                        <ul className="menu-links">

                            <li className="nav-link" onClick={hundleProfile}>
                                    <i className='icon'><FaUserCog style={{fontSize: 30}} /></i>
                                    <span className="text">Compte</span>
                            </li>

                            <li className="nav-link">
                                    <i className='icon'><FaBloggerB /></i>
                                    <span className="text">Mes postes</span>
                            </li>

                            <li className="nav-link" onClick={hundleSolde}>
                                <i className='icon'> <RiMoneyDollarCircleFill style={{fontSize: 30}} /></i>
                                    <span className="text">Solde</span>
                            </li>

                            <li className="nav-link">
                                    <i className=' icon'><BsFillBarChartLineFill /></i>
                                    <span className="text">Analytics</span>
                            </li>

                            <li className="nav-link">
                                <i className='icon'><VscActivateBreakpoints /></i>
                                    <span className="text">Cache</span>
                            </li>

                            <li className="nav-link">
                                <i className='icon'><MdOutlineSystemUpdate /></i>
                                    <span className="text">Mise a jour</span>
                            </li>

                        </ul>
                        <li className="deconnexion-item"  onClick={handleDeconnexion} style={{ backgroundColor: "pink", borderRadius: "15px", width:"80%"}}>
                            <i style={{ backgroundColor: "pink"}} className="icon" ><CiLogout style={{fontSize: 30}} /></i>
                            <span className="text">Déconnexion</span>
                        </li>
                    </div>

                </div>

            </nav>

            {navbarBublicationVisible && (
                <nav className="navbarBublication" ref={navbarBublicationRef}>
                    <p onClick={handlePublicationClick}><span style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}><BiFontSize  /></span> Publication</p>
                    <p onClick={handleVideoClick}><span style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}><ImVideoCamera /></span> Mettre en ligne une video </p>
                    <p onClick={handlePhotoClick}><span style={{backgroundColor: "#e4e6eb", borderRadius: "50%", width: 40, height: 40, display: "flex", justifyContent: "center", alignItems: "center"}}><BsFillPatchPlusFill /></span> Partager une image</p>
                </nav>
            )}
            <button className="new-publication-button" onClick={handleNavbarBublicationClick}>+</button>
        </div>

    );
}

export default Navbar;
