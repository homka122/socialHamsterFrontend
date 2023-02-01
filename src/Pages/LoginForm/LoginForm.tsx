import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosService } from '../../API/axiosService';
import Navbar from '../../Components/Navbar/Navbar';
import './LoginForm.css';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const buttonHandler = async (type: 'login' | 'signup') => {
    const url = type === 'login' ? '/auth/login' : '/auth/signup';

    const response = await axiosService.post(url, {
      username,
      password,
    });

    if (response.status === 'error') {
      setErrors(response.message.split('\n'));
      return;
    }

    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('username', response.data.user.username);
    localStorage.setItem('userId', response.data.user._id);

    navigate('/conversations');
  };

  const renderErrors = (errors: string[]) => {
    return errors.map((error, i) => <li key={i}>{error}</li>);
  };

  return (
    <>
      <Navbar />
      <div className="loginform">
        <div className="loginform__username">
          <div>Username</div>
          <input
            type="text"
            className="loginform__input"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </div>
        <div className="loginform__password">
          <div>Password</div>
          <input
            type="password"
            className="loginform__input"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <div className="loginform__buttons">
          <button className="loginform__button" onClick={() => buttonHandler('login')}>
            Login
          </button>
          <button className="loginform__button" onClick={() => buttonHandler('signup')}>
            Signup
          </button>
        </div>
        <ul className="errors">{renderErrors(errors)}</ul>
      </div>
    </>
  );
}

export default LoginForm;
