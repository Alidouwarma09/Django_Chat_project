import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/parametre.css'
import { useNavigate } from 'react-router-dom';
import {IoMdLogOut} from "react-icons/io";
import {FaUserCog} from "react-icons/fa";
import {MdArrowBackIos, MdSettingsInputAntenna} from "react-icons/md";
import {RiListSettingsLine} from "react-icons/ri";
import Skeleton from "react-loading-skeleton";

const Parametres = () => {
      const navigate = useNavigate();
      const [userInfo, setUserInfo] = useState({});
        const [loading, setLoading] = useState(true);

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
          setLoading(false)
        } catch (error) {
          console.error('Erreur lors de la récupération des informations utilisateur:', error);
        }
      }
    };

    loadUserInfo();
  }, []);
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
 const handleBack = () => {
    navigate(-1);
  };

  return (
      <div className="container">
          <div className="fixed-header header">
              <MdArrowBackIos className="back-button"  onClick={handleBack} />
              {loading && userInfo.length === 0 ? (
                  <>
                    <Skeleton height={200} />
                    <Skeleton height={200} />
                  </>
                ) : (
                  <div>
                    <img src={`${userInfo.image_utilisateu}`} style={{borderRadius: "50%", width: 70, height: 70}}
                         alt="Trash Icon"/>
                    <p className="clean-status">{userInfo.nom_utilisateur} {userInfo.prenom_utilisateur}</p>
                  </div>
                )}
              <button className="clean-btn">Suivre</button>
          </div>
          <div className="grid">
              <div className="card" style={{
          background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(72,72,133,1) 35%, rgba(52,111,167,1) 53%, rgba(11,26,32,1) 77%, rgba(0,212,255,1) 100%)'
        }}>
                  <FaUserCog style={{ fontSize: 30}} />
                  <p>Profile</p>
                  <p>Modifier les informations du compte</p>
              </div>
              <div className="card" style={{
          background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(72,72,133,1) 35%, rgba(52,111,167,1) 53%, rgba(11,26,32,1) 77%, rgba(0,212,255,1) 100%)'
        }}>
                 <RiListSettingsLine style={{ fontSize: 30}} />
                  <p>Parametre</p>
                  <p>Modifier le comportement de l'application</p>
              </div>
              <div className="card" style={{
          background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(72,72,133,1) 35%, rgba(52,111,167,1) 53%, rgba(11,26,32,1) 77%, rgba(0,212,255,1) 100%)'
        }}>
                  <MdSettingsInputAntenna />
                  <p>Mise a jour</p>
                  <p>Metre a jour l'application</p>
              </div>
              <div className="card" style={{
          background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(72,72,133,1) 35%, rgba(52,111,167,1) 53%, rgba(11,26,32,1) 77%, rgba(0,212,255,1) 100%)'
        }}>
                 <MdSettingsInputAntenna />
                  <p>Mise a jour</p>
                  <p>Metre a jour l'application</p>
              </div>
              <div className="card" style={{
          background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(72,72,133,1) 35%, rgba(52,111,167,1) 53%, rgba(11,26,32,1) 77%, rgba(0,212,255,1) 100%)'
        }}>
                  <MdSettingsInputAntenna />
                  <p>Mise a jour</p>
                  <p>Metre a jour l'application</p>
              </div>
              <div className="card" style={{
          background: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(72,72,133,1) 35%, rgba(52,111,167,1) 53%, rgba(11,26,32,1) 77%, rgba(0,212,255,1) 100%)'
        }}>
                  <MdSettingsInputAntenna />
                  <p>Mise a jour</p>
                  <p>Metre a jour l'application</p>
              </div>
          </div>
          <div className="card" style={{marginTop: 10, fontSize: 20, color: "red"}} onClick={handleDeconnexion}>
              <IoMdLogOut />
              Deconnexion
          </div>
      </div>
  );
};

export default Parametres;
