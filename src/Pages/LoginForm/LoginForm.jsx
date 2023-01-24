import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosService } from '../../API/axiosService';
import Navbar from '../../Components/Navbar/Navbar';
import './LoginForm.css';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const navigate = useNavigate();

  const loginHandler = async () => {
    const responseData = await axiosService.post('/auth/login', { username, password });

    if (responseData.status === 'success') {
      localStorage.setItem('token', responseData.data.accessToken);
      localStorage.setItem('username', responseData.data.user.username);
      localStorage.setItem('userId', responseData.data.user._id);

      navigate('/conversations');
    }

    setErrors(responseData.message.split('\n'));
  };

  const signupHandler = async () => {
    const responseData = await axiosService.post('/auth/signup', { username, password });

    if (responseData.status === 'success') {
      localStorage.setItem('token', responseData.data.accessToken);
      localStorage.setItem('username', responseData.data.user.username);
      localStorage.setItem('userId', responseData.data.user._id);

      navigate('/conversations');
    }

    setErrors(responseData.message.split('\n'));
  };

  const renderErrors = (errors) => {
    let renderedErrors = [];
    errors.forEach((error, i) => {
      renderedErrors.push(<li key={i}>{error}</li>);
    });
    return renderedErrors;
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
          <button className="loginform__button" onClick={loginHandler}>
            Login
          </button>
          <button className="loginform__button" onClick={signupHandler}>
            Signup
          </button>
        </div>
        <ul className="errors">{renderErrors(errors)}</ul>
      </div>
    </>
  );
}

export default LoginForm;
