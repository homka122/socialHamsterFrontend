import './Conversation.css';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import MyInput from '../../Components/MyInput/MyInput';
import { connectToWS } from '../../API/connectToWS';
import { MessageResponse } from '../../types/MessageResponse';
import { ConversationResponse } from '../../types/Conversation';
import { getMessagesFromConversation, sendMessage } from '../../API/messages';

type Nicknames = {
  [key: string]: string;
};

function Conversation() {
  const id = useParams().id as string;
  const [conversation, setConversation] = useState<ConversationResponse>();
  const [companion, setCompanion] = useState('');
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [nicknames, setNicknames] = useState<Nicknames>({});
  const myUsername = localStorage.getItem('username') as string;
  const myId = localStorage.getItem('userId') as string;

  const [inputText, setInputText] = useState('');
  // eslint-disable-next-line
  const [websocket, setWebsocket] = useState();
  const state: { conversation: ConversationResponse } = useLocation().state;

  const navigate = useNavigate();

  const myRef = useRef(null);

  useEffect(() => {
    const main = async () => {
      const messages = await getMessagesFromConversation(id);

      if (!messages) {
        navigate('/auth');
        return;
      }

      setConversation(state.conversation);
      setNicknames({
        [state.conversation.peer._id]: state.conversation.peer.username,
        [myId]: myUsername,
      });
      setCompanion(state.conversation.peer.username);
      setMessages(messages);

      const ws = await connectToWS();

      ws.onmessage = (msg) => {
        const data = JSON.parse(msg.data);
        if (data.event === 'newMessage') {
          if (data.reciever.username === state.conversation.peer.username || data.sender.username === state.conversation.peer.username)
            setMessages((old) => [...old, data.message]);
        }
      };
    };

    main();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const messages = document.querySelector('.conversation__messages');
    if (!messages) return;

    messages.scrollTop = messages.scrollHeight;
  }, [messages]);

  useEffect(() => {
    const messages = document.querySelector('.conversation__messages');
    if (!messages) return;

    if (messages.scrollTop > messages.scrollHeight - 70) {
      messages.scrollTop = messages.scrollHeight;
    }
  }, [inputText]);

  const renderMessages = () => {
    const renderedMessages = messages.map((message) => (
      <div className="conversation__message" key={message._id}>
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
    ));

    renderedMessages.push(<div ref={myRef}></div>);

    return renderedMessages;
  };

  const sendMessageHandler = async () => {
    setInputText('');
    if (!conversation) return;

    await sendMessage(conversation.peer.username, inputText);
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
              }}
            >
              <img src="/back.svg" height={20} width={20} alt="back logo" className="conversation__back_button" />
              <span>Назад</span>
            </div>
            <div className="conversation__nickname" onClick={() => navigate('/users/' + state.conversation.peer._id)} style={{ cursor: 'pointer' }}>
              {companion}
            </div>
            <div className="conversation__icon">
              <img src="/user.svg" alt="user logo" height={30} width={30} />
            </div>
          </div>
          <div className="conversation__messages nicescroll">{renderMessages()}</div>
          <div className="conversation__inputarea">
            <MyInput minHeight={50} maxHeight={150} onClickHandler={() => sendMessageHandler()} inputText={inputText} setInputText={setInputText} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Conversation;
