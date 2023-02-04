import { useEffect, useState } from 'react';
import './Conversations.css';
import { useNavigate } from 'react-router-dom';
import { getUserConversation } from '../../API/users';
import { getUserPhoto } from '../../API/static';
import { connectToWS } from '../../API/connectToWS';
import Skeleton from 'react-loading-skeleton';
import { getUserConversations } from '../../API/conversations';
import { sendMessage } from '../../API/messages';
import { ConversationResponse } from '../../types/Conversation';

function Conversations() {
  const navigate = useNavigate();

  const [conversations, setConversations] = useState<ConversationResponse[]>([]);
  const [display, setDisplay] = useState('none');
  const [modalNickname, setModalNickname] = useState('');
  const [modalText, setModalText] = useState('');
  const [photos, setPhotos] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const main = async () => {
      setLoading(true);
      const conversations = await getUserConversations();

      setConversations(conversations);

      for (const conversation of conversations) {
        const photo = await getUserPhoto(conversation.peer.username);

        if (photo) {
          setPhotos((old) => {
            return {
              ...old,
              [conversation.peer.username]: photo,
            };
          });
        } else {
          setPhotos((old) => {
            return { ...old, [conversation.peer.username]: '/user.svg' };
          });
        }
      }

      setLoading(false);

      const ws = await connectToWS();
      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if (data.event === 'newMessage') {
          const { message } = data;
          setConversations((conversations) =>
            conversations.map((conversation) => {
              if (conversation._id === message.conversation) {
                return {
                  ...conversation,
                  lastMessage: { ...conversation.lastMessage, text: message.text, createdAt: message.createdAt },
                };
              }

              return conversation;
            })
          );
        }
      };
    };

    main();
    //eslint-disable-next-line
  }, []);

  const renderConversations = () => {
    return conversations.map((conversation) => {
      const companion = conversation.peer.username;

      return (
        <div className="conversations__conversation" key={conversation._id} onClick={handleClickOnConversation(conversation)}>
          <div className="conversations__icon">
            <img src={photos[companion]} alt="user logo" height={50} width={50} style={{ objectFit: 'cover' }} />
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
  };

  const renderSkeletonConvnersation = () => {
    const result = [];
    for (let i = 0; i < 10; i++) {
      result.push(
        <div className="conversations__conversation" key={i}>
          <div className="conversations__icon">
            <Skeleton height={50} width={50} baseColor={'#bcbcbc'} />
          </div>
          <div className="conversations__panels_wrapper">
            <div className="conversations__top_panel">
              <div className="conversations__companion">
                <Skeleton width={100} baseColor={'#bcbcbc'} />
              </div>
              <div className="conversations__time">
                <Skeleton width={50} baseColor={'#bcbcbc'} />
              </div>
            </div>
            <div className="conversations__bottom_panel">
              <div className="conversations__text">
                <Skeleton width={300} baseColor={'#bcbcbc'} />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return result;
  };

  const handleClickOnConversation = (conversation: ConversationResponse) => {
    return () => {
      navigate('/conversations/' + conversation._id, { state: { conversation } });
    };
  };

  const createChat = async () => {
    const message = await sendMessage(modalNickname, modalText);
    if (!message) return;

    const conversation = await getUserConversation(message.conversation);

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
          <img src="/chat.svg" alt="chat logo" height={20} width={20} onClick={() => setDisplay('flex')} style={{ cursor: 'pointer' }} />
        </div>
        <div className="conversations nicescroll">{loading ? renderSkeletonConvnersation() : renderConversations()}</div>
      </div>
    </div>
  );
}

export default Conversations;
