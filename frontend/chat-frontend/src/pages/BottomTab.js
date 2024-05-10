import React, { useState } from 'react';
import './css/BottomTab.css';
import { useNavigate } from 'react-router-dom';

import HomeIcon from './icons/home.png';
import SearchIcon from './icons/home.png';
import MessageIcon from './icons/home.png';
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
        className={activeTab === 'accueil' ? 'active' : ''}
        onClick={() => handlePageChange('accueil')}
      >
        <img src={HomeIcon} alt="Home"/>
      </button>
      <button
        className={activeTab === 'connexion' ? 'active' : ''}
        onClick={() => handlePageChange('connexion')}
      >
        <img src={SearchIcon} alt="Search"/>
      </button>
      <button
        className={activeTab === 'messages' ? 'active' : ''}
        onClick={() => handlePageChange('messages')}
      >
        <img src={MessageIcon} alt="Messages"/>
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
