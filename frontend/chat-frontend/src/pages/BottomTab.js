import React, { useState } from 'react';
import './css/BottomTab.css';
import { useNavigate } from 'react-router-dom';
import { MdOutlineSlowMotionVideo } from "react-icons/md";

import HomeIcon from './icons/home.png';
import MessageIcon from './icons/message.png';
import ProfileIcon from './icons/home.png';

function BottomTab() {
  const [activeTab, setActiveTab] = useState('home');
  const navigate = useNavigate();

  const handlePageChange = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };

  return (
    <div className="bottom-tab">
      <button
        className={activeTab === 'acceuil' ? 'active' : ''}
        onClick={() => handlePageChange('acceuil')}
      >
        <img src={HomeIcon} alt="Acceuil"/>
      </button>
      <button
        className={activeTab === 'connexion' ? 'active' : ''}
        onClick={() => handlePageChange('connexion')}
      >
        <img src={MessageIcon} alt="messages"/>
      </button>
        <button
            className={activeTab === 'messages' ? 'active' : ''}
            onClick={() => handlePageChange('videos')}
        >
          <span style={{fontSize: 30}}>
             <MdOutlineSlowMotionVideo/>
          </span>
        </button>
        <button
            className={activeTab === 'profile' ? 'active' : ''}
        onClick={() => handlePageChange('profile')}
      >
        <img src={ProfileIcon} alt="Profile"/>
      </button>
    </div>
  );
}

export default BottomTab;
