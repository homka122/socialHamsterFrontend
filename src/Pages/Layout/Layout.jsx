import { createContext, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import './Layout.css';

export const wsContext = createContext(null);

function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      localStorage.setItem('username', '');
      navigate('/auth');
    }

    const tokenPayloadExp = JSON.parse(atob(token.split('.')[1])).exp;

    if (tokenPayloadExp * 1000 < new Date().getTime()) {
      localStorage.setItem('token', '');
      localStorage.setItem('username', '');
      navigate('/auth');
    }
    // eslint-disable-next-line
  }, []);
  return (
    <div className="App">
      <Navbar />
      <div className="main_container">
        <div className="wrap_nav">
          <div className="nav_column">
            <div className="nav_column__element" onClick={() => navigate('/me')}>
              <img className="nav_column__icon" src="/user.svg" alt="user logo" height={20} width={20} />
              <span>Моя страница</span>
            </div>
            <div className="nav_column__element" onClick={() => navigate('/conversations')}>
              <img className="nav_column__icon" src="/chat.svg" alt="chat logo" height={20} width={20} />
              <span>Сообщения</span>
            </div>
            <div className="nav_column__element" onClick={() => navigate('/feed')}>
              <img className="nav_column__icon" src="/feed.svg" alt="feed logo" height={20} width={20} />
              <span>Лента</span>
            </div>
            <div className="nav_column__element" onClick={() => navigate('/friends')}>
              <img className="nav_column__icon" src="/friends.svg" alt="friends logo" height={20} width={20} />
              <span>Друзья</span>
            </div>
          </div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
