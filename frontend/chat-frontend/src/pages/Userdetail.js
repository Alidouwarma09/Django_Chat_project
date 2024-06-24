import React, {useEffect, useState} from 'react';
import './css/solde.css'
import './css/userdetails.css'
import axios from "axios";
import {useParams} from "react-router-dom";
import {Box} from "@mui/material";
import {Spinner} from "@chakra-ui/react";
import Icon from "antd/es/icon";
import {IoReloadSharp} from "react-icons/io5";
import {RiVerifiedBadgeFill} from "react-icons/ri";
function Userdetail( ) {
    const { utilisateurId } = useParams();
    const [utilisateurs, setUtilisateurs] = useState(null);
    useEffect(() => {
        const fetchUtilisateurs = async () => {
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
                setUtilisateurs(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération de l\'utilisateur:', error);
            }
        };

        fetchUtilisateurs();
    }, [utilisateurId]);
    if (!utilisateurs) {
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
    return (
        <div className="deatils-container" >
            <div className="profile">
                <header className="profile__header">
                    <div className="profile__highlight__wrapper">
                        <div className="profile__highlight">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-school"
                                 width="24"
                                 height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M22 9l-10 -4l-10 4l10 4l10 -4v6"/>
                                <path d="M6 10.6v5.4a6 3 0 0 0 12 0v-5.4"/>
                            </svg>
                            1760
                        </div>
                        Students
                    </div>
                    <div className="profile__avatar">
                        <img src={utilisateurs.image_utilisateur} loading="lazy" alt={`${utilisateurs.nom_utilisateur} ${utilisateurs.prenom_utilisateur}`} />
                    </div>
                    <div className="profile__highlight__wrapper">
                        <div className="profile__highlight">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-coin"
                                 width="24"
                                 height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"/>
                                <path
                                    d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1"/>
                                <path d="M12 7v10"/>
                            </svg>
                            149$ss
                        </div>
                        Hourly Rate
                    </div>
                </header>
                <div className="profile__name">
                    <h2>{utilisateurs.nom_utilisateur} {utilisateurs.prenom_utilisateur}<RiVerifiedBadgeFill style={{color: "blue", fontSize: 20, marginLeft: 10}} /></h2>
                    <p>Frontend/Fullstack Developer </p>
                </div>
                <ul className="social-links">
                    <li>
                        <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="icon icon-tabler icon-tabler-brand-github" width="24"
                                 height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path
                                    d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"/>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="icon icon-tabler icon-tabler-brand-linkedin"
                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                 fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path
                                    d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"/>
                                <path d="M8 11l0 5"/>
                                <path d="M8 8l0 .01"/>
                                <path d="M12 16l0 -5"/>
                                <path d="M16 16v-3a2 2 0 0 0 -4 0"/>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-x"
                                 width="24"
                                 height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M4 4l11.733 16h4.267l-11.733 -16z"/>
                                <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="icon icon-tabler icon-tabler-brand-instagram"
                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                 fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M4 4m0 4a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z"/>
                                <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0"/>
                                <path d="M16.5 7.5l0 .01"/>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 className="icon icon-tabler icon-tabler-brand-youtube"
                                 width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                 fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path
                                    d="M2 8a4 4 0 0 1 4 -4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12a4 4 0 0 1 -4 -4v-8z"/>
                                <path d="M10 9l5 3l-5 3z"/>
                            </svg>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-link"
                                 width="24"
                                 height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none"
                                 stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M9 15l6 -6"/>
                                <path d="M11 6l.463 -.536a5 5 0 0 1 7.071 7.072l-.534 .464"/>
                                <path
                                    d="M13 18l-.397 .534a5.068 5.068 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463"/>
                            </svg>
                        </a>
                    </li>
                </ul>
                <main>
                    <div className="tabs-wrapper">
                        <ul className="tabs">
                            <li className="active">
                                <a id="tab1" href="#about">About me</a>
                            </li>
                            <li>
                                <a id="tab2" href="#skills">Skills</a>
                            </li>
                            <li>
                                <a id="tab3" href="#reviews">Reviews</a>
                            </li>
                            <li id="active-bg"></li>
                        </ul>
                    </div>
                    <div id="tab1-content" className="tab-content tab-content--active">
                        <p>
                            I am a full-stack developer with 10 years of experience at Google. For the past 5 yeas, I
                            have been posting educational content on my blog and YouTube channel. I have a passion for
                            modern
                            web technologies and love to share my knowledge with others.
                        </p>
                        <h3>I can help with &#128588;
                        </h3>
                        <ul className="content-links">
                            <li>
                                <a href="#career">Career roadmap and advice

                                </a>
                            </li>
                            <li><a href="#interview">Interview preparation</a></li>
                            <li><a href="#web-development">Web development</a></li>
                        </ul>
                    </div>
                    <div id="tab2-content" className="tab-content">
                        <p>
                            My content is focused on the latest web development technologies and tools. Here is the
                            overview
                            👨‍💻
                        </p>
                        <ul className="content-links">
                            <li>
                                <a href="#html-css">
                                    HTML, CSS
                                </a>
                            </li>
                            <li>
                                <a href="#javascript">
                                    JavaScript
                                </a>
                            </li>
                            <li>
                                <a href="#react-and-nextjs">
                                    React and Next.js
                                </a>
                            </li>
                            <li>
                                <a href="#nodejs">
                                    Node.js (REST, GraphQL)
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div id="tab3-content" className="tab-content">
                        <p>
                            Here are some of the reviews from my students 📚
                        </p>
                        <ul className="reviews">
                            <li>
                                <article className="review">
                                    <div className="review__avatar">
                                        <img src="assets/joe.jpg" alt="Avatar" />
                                    </div>
                                    <div className="review__content">
                                        <h4>Joe Doe</h4>
                                        <p>
                                            Melissa is a great mentor. She helped me to prepare for the interview and
                                            provided me with valuable feedback on my projects. I would highly recommend
                                            her
                                            to anyone who is looking for a mentor.
                                        </p>
                                    </div>
                                </article>
                            </li>
                            <li>
                                <article className="review">
                                    <div className="review__avatar">
                                        <img src="assets/jane.jpg" alt="Avatar" />
                                    </div>
                                    <div className="review__content">
                                        <h4>Jane Doe</h4>
                                        <p>
                                            Melissa is awesome at explaining complex topics in a simple way. I have
                                            learned a lot from her and would recommend her to anyone who is looking for
                                            a
                                            mentor.
                                        </p>
                                    </div>
                                </article>
                            </li>
                        </ul>
                    </div>
                </main>
            </div>
        </div>

    );
}

export default Userdetail;