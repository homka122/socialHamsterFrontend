import { useEffect, useState } from 'react';
import './Conversations.css';
import { axiosService } from '../../API/axiosService';
import { useNavigate } from 'react-router-dom';
import { getUserConversation } from '../../API/getUserConversation';

function Conversations() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState([]);
  const [display, setDisplay] = useState('none');
  const [modalNickname, setModalNickname] = useState('');
  const [modalText, setModalText] = useState('');

  useEffect(() => {
    const main = async () => {
      const conversations = await axiosService.getConversations();

      setConversations(conversations);
    };

    main();
    //eslint-disable-next-line
  }, []);

  const renderConversations = () => {
    let renderedConversations = [];

    conversations.forEach((conversation) => {
      const companion = conversation.peer.username;

      renderedConversations.push(
        <div
          className="conversations__conversation"
          key={conversation._id}
          onClick={handleClickOnConversation(conversation)}
        >
          <div className="conversations__icon">
            <img src="/user.svg" alt="user logo" height={50} width={50} />
          </div>
          <div className="conversations__panels_wrapper">
            <div className="conversations__top_panel">
              <div className="conversations__companion">{companion}</div>
              <div className="conversations__time">
                {new Date(conversation.lastMessage.createdAt).toLocaleString('ru-RU', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <div className="conversations__bottom_panel">
              {/* <div className="conversations__sender">
                {`${conversation.lastMessage.sender.username}: `}
              </div> */}
              <div className="conversations__text">
                {(() => {
                  if (conversation.lastMessage.text.length > 50) {
                    return conversation.lastMessage.text.slice(0, 50) + '...';
                  } else {
                    return conversation.lastMessage.text;
                  }
                })()}
              </div>
            </div>
          </div>
        </div>
      );
    });

    return renderedConversations;
  };

  const handleClickOnConversation = (conversation) => {
    return (e) => {
      navigate('/conversations/' + conversation._id, { state: { conversation } });
    };
  };

  const createChat = async () => {
    const res = await axiosService.post('/messages', {
      text: modalText,
      username: modalNickname,
    });

    if (res.status === 'error') {
      console.log(res.data);
    }
    const conversation = await getUserConversation(res.data.message.conversation);
    navigate('/conversations/' + conversation._id, {
      state: { conversation },
    });
  };

  return (
    <div className="content">
      <div className="container">
        <div className="modal" style={{ display }}>
          <div className="modal__content">
            <div className="modal__text">Nickname:</div>
            <input className="modal__input" value={modalNickname} onChange={(e) => setModalNickname(e.target.value)} />
            <div className="modal__text">Сообщение:</div>
            <input className="modal__input" value={modalText} onChange={(e) => setModalText(e.target.value)} />
            <button className="modal__button" onClick={createChat}>
              Создать чат
            </button>
            <button className="modal__button" onClick={() => setDisplay('none')}>
              Назад
            </button>
          </div>
        </div>
        <div className="top_panel">
          <div className="top_panel__input_field">
            <img src="search.svg" alt="search logo" height={20} width={20} />
            <input type="text" className="top_panel__input" />
          </div>
          <img
            src="/chat.svg"
            alt="chat logo"
            height={20}
            width={20}
            onClick={() => setDisplay((display) => !display)}
            style={{ cursor: 'pointer' }}
          />
        </div>
        <div className="conversations nicescroll">
          {/* <div className="conversations__button_wrapper">
          <button className="conversations__button" onClick={() => setDisplay('flex')}>
            Написать сообщение
          </button>
        </div> */}
          {renderConversations()}
        </div>
      </div>
    </div>
  );
}

export default Conversations;
