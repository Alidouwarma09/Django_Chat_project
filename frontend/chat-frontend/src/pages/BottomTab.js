import React, {useEffect, useState} from 'react';
import './css/BottomTab.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import {IoMdHome} from "react-icons/io";
import {TbMessageCircle2Filled} from "react-icons/tb";
import {IoSearch} from "react-icons/io5";

function BottomTab() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('acceuil');
    const [totalMessages, setTotalMessages] = useState(
        parseInt(localStorage.getItem('totalMessages')) || 0
    );

  useEffect(() => {
    const currentPath = location.pathname.substring(1);
    setActiveTab(currentPath || 'acceuil');
  }, [location]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        const eventSource = new EventSource(`${process.env.REACT_APP_API_URL}/Utilisateur/api/message_total_sse?token=${token}`, { mode: 'cors' });

        eventSource.onmessage = (event) => {
            const { totalMessages: newTotalMessages } = JSON.parse(event.data);
            setTotalMessages(newTotalMessages);
            localStorage.setItem('totalMessages', newTotalMessages);
        };

        return () => {
            eventSource.close();
        };
    }, []);
  const handlePageChange = (tab) => {
    setActiveTab(tab);
    navigate(`/${tab}`);
  };
  const navItems = document.getElementsByClassName('nav-item');

  for (let i = 0; i < navItems.length; i++) {
    navItems[i].addEventListener('click', () => {
      for(let j = 0; j < navItems.length; j++)
        navItems[j].classList.remove('active');

      navItems[i].classList.add('active');
    });
  }

  return (
    <div className="bottom-tab">
      <div className={`nav-item ${activeTab === 'acceuil' ? 'active' : ''}`}  onClick={() => handlePageChange('acceuil')}>
        <IoMdHome className="material-icons" />
        <span className="nav-text">Acceuil</span>
      </div>
      <div className={`nav-item ${activeTab === 'utilisateurs' ? 'active' : ''}`}  onClick={() => handlePageChange('utilisateurs')}>
        <TbMessageCircle2Filled style={{fontSize: 30}} />
          <span style={{fontFamily: "monospace", fontSize: 10, color: "white" +
                  "", backgroundColor: "red", borderRadius:"50%"}}>{totalMessages > 5 ? '+5' : totalMessages > 0 ? `(${totalMessages})` : ''}</span>
          <span className="nav-text">Messages </span>
      </div>
      <div className={`nav-item ${activeTab === 'recherche' ? 'active' : ''}`}  onClick={() => handlePageChange('recherche')}>
        <IoSearch className="material-icons"  />
        <span className="nav-text">recherche</span>
      </div>
      <div className={`nav-item ${activeTab === 'videos' ? 'active' : ''}`}  onClick={() => handlePageChange('videos')}>
        <MdOutlineSlowMotionVideo className="material-icons" />
        <span className="nav-text">Videos</span>
      </div>
    </div>
  );
}

export default BottomTab;
