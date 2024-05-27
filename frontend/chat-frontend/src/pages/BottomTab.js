import React, {useEffect, useState} from 'react';
import './css/BottomTab.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import { GoHomeFill } from "react-icons/go";
import { BiMessageRoundedDots } from "react-icons/bi";

function BottomTab() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('acceuil');

  useEffect(() => {
    const currentPath = location.pathname.substring(1);
    setActiveTab(currentPath || 'acceuil');
  }, [location]);

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
        <GoHomeFill style={{ height: 25, width: 25 }} />
      </button>
      <button
        className={activeTab === 'utilisateurs' ? 'active' : ''}
        onClick={() => handlePageChange('utilisateurs')}
      >
        <BiMessageRoundedDots style={{ height: 25, width: 25 }} />
      </button>
      <button
        className={activeTab === 'videos' ? 'active' : ''}
        onClick={() => handlePageChange('videos')}
      >
        <span style={{ fontSize: 25 }}>
          <MdOutlineSlowMotionVideo />
        </span>
      </button>
    </div>
  );
}

export default BottomTab;
