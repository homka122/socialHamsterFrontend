import { createContext, useEffect } from 'react';
import { NavigateFunction, Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../../Components/Navbar/Navbar';
import './Layout.css';

export const wsContext = createContext(null);
export let ws: WebSocket;

type Options = {
  name: string;
  url: string;
  icon: string;
};

const options: Options[] = [
  { name: 'Моя страница', url: '/me', icon: '/user.svg' },
  { name: 'Сообщения', url: '/conversations', icon: '/chat.svg' },
  { name: 'Лента', url: '/feed', icon: '/feed.svg' },
  { name: 'Друзья', url: '/friends', icon: './friends.svg' },
];

const renderNavColumnItems = (options: Options[], navigate: NavigateFunction) => {
  return options.map((option) => {
    return (
      <div className="nav_column__element" onClick={() => navigate(option.url)} key={option.name}>
        <img className="nav_column__icon" src={option.icon} alt="user logo" height={20} width={20} />
        <span>{option.name}</span>
      </div>
    );
  });
};

function Layout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      localStorage.setItem('username', '');
      navigate('/auth');
      return;
    }

    const tokenPayloadExp = JSON.parse(atob(token.split('.')[1])).exp;

    if (tokenPayloadExp * 1000 < new Date().getTime()) {
      localStorage.setItem('token', '');
      localStorage.setItem('username', '');
      navigate('/auth');
      return;
    }

    ws = new WebSocket('wss://wsssocialhamsterapi.homka122.ru/' + token);
  }, []);

  return (
    <div className="App">
      <Navbar />
      <div className="main_container">
        <div className="wrap_nav">
          <div className="nav_column">{renderNavColumnItems(options, navigate)}</div>
        </div>

        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
