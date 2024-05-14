
import { useNavigate } from 'react-router-dom';
import './css/navbar.css';
import { CiMenuBurger } from "react-icons/ci";

function Navbar() {
  const navigate = useNavigate();

  const handleMenuClick = () => {
    navigate('/parametre/');
  };

  return (
    <nav className="navbar">
      <i id="publication-action-icon" className="bi bi-fonts"></i>
      <i id="video-icon" className="bi bi-camera-video"></i>
      <i id="photo-icon" className="bi bi-patch-plus"></i>

      <div className="profile-dropdown" style={{ marginLeft: 'auto' }}>
        <div className="profile-dropdown-btn">
          <div className="menu" onClick={handleMenuClick}>
            <CiMenuBurger />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
