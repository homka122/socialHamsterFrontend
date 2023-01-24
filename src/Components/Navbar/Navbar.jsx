import { useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar(props) {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const clickHandler = () => {
    localStorage.clear();
    navigate('/auth');
  };

  return (
    <div className="navbar">
      <div>Social Hamster</div>
      <div className="navbar__username" onClick={clickHandler} style={{ cursor: 'pointer' }}>
        {username}
      </div>
    </div>
  );
}

export default Navbar;
