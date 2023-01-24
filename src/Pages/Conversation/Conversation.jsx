import './Conversation.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { axiosService } from '../../API/axiosService';
import MyInput from '../../Components/MyInput/MyInput';
import { wsContext } from '../Layout/Layout';

function Conversation() {
  const { id } = useParams();
  const [conversation, setConversation] = useState({});
  const [companion, setCompanion] = useState('');
  const [messages, setMessages] = useState([]);
  const [nicknames, setNicknames] = useState({});
  const myUsername = localStorage.getItem('username');
  const myId = localStorage.getItem('userId');

  const [inputText, setInputText] = useState('');
  // eslint-disable-next-line
  const websocket = useContext(wsContext);
  const { state } = useLocation();

  const navigate = useNavigate();

  const myRef = useRef(null);

  useEffect(() => {
    const main = async () => {
      const res = await axiosService.get(`/messages/?id=${id}`);

      if (res.status === 'error') {
        navigate('/auth');
      }

      setConversation(state.conversation);
      console.log(state);
      setNicknames({
        [state.conversation.peer._id]: state.conversation.peer.username,
        [myId]: myUsername,
      });
      setCompanion(state.conversation.peer.username);
      setMessages(res.data.messages);

      websocket.send(JSON.stringify({ hello: 'kek' }));
      websocket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.event === 'newMessage') {
          if (
            data.reciever.username === state.conversation.peer.username ||
            data.sender.username === state.conversation.peer.username
          )
            setMessages((old) => [...old, data.message]);
        }
      };

      return () => {};
    };

    main();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const messages = document.querySelector('.conversation__messages');
    messages.scrollTop = messages.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const messages = document.querySelector('.conversation__messages');
    if (messages.scrollTop > messages.scrollHeight - 70) {
      messages.scrollTop = messages.scrollHeight;
    }
  }, [inputText]);

  const renderMessages = () => {
    let renderedMessages = [];
    messages.forEach((message) => {
      renderedMessages.push(
        <div className="conversation__message">
          <div className="conversation__sender_date">
            <div className="conversation__sender">{nicknames[message.sender]}</div>
            <div className="conversation__date">
              {new Date(message.createdAt).toLocaleString('ru-RU', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
          <div className="conversation__text" style={{ whiteSpace: 'pre-wrap' }}>
            {message.text}
          </div>
        </div>
      );
    });

    renderedMessages.push(<div ref={myRef}></div>);

    return renderedMessages;
  };

  const sendMessage = async () => {
    setInputText('');
    const res = await axiosService.post('/messages', {
      text: inputText,
      username: conversation.peer.username,
    });

    if (res.status === 'error') {
      console.log(res.data);
    }

    console.log(res.data);
  };

  return (
    <div className="content">
      <div className="conversation">
        <div className="conversation__wrapper">
          <div className="conversation__nickname_field">
            <div
              className="conversation__back"
              onClick={() => {
                navigate(-1);
                websocket.close();
              }}
            >
              <img src="/back.svg" height={20} width={20} alt="back logo" className="conversation__back_button" />
              <span>Назад</span>
            </div>
            <div
              className="conversation__nickname"
              onClick={() => navigate('/users/' + state.conversation.peer._id)}
              style={{ cursor: 'pointer' }}
            >
              {companion}
            </div>
            <div className="conversation__icon">
              <img src="/user.svg" alt="user logo" height={30} width={30} />
            </div>
          </div>
          <div className="conversation__messages nicescroll">{renderMessages()}</div>
          <div className="conversation__inputarea">
            <MyInput
              minHeight={50}
              maxHeight={150}
              onClickHandler={() => sendMessage()}
              inputText={inputText}
              setInputText={setInputText}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
