import './UserPage.css';
import MyInput from '../../Components/MyInput/MyInput';
import Posts from '../../Components/Posts/Posts';
import { useEffect, useState } from 'react';
import { axiosService } from '../../API/axiosService';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserNickname } from '../../API/getUserNickname';
import { getFriendsAndSubscribers } from '../../API/getFriendsAndSubscribers';

function UserPage(props) {
  const [inputText, setInputText] = useState('');
  const [nickname, setNickname] = useState('');
  const [friendsCount, setFriendsCount] = useState(0);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [friendshipStatus, setFriendshipStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  const obj = useParams();
  let id;
  if (props.me) {
    id = localStorage.getItem('userId');
  } else {
    id = obj.id;
    if (id === localStorage.getItem('userId')) {
      navigate('/me');
    }
  }

  useEffect(() => {
    const main = async () => {
      setLoading(true);

      let nickname;

      if (props.me) {
        nickname = localStorage.getItem('username');
      } else {
        nickname = await getUserNickname(id);
      }

      setNickname(nickname);

      const { friends, subscribers } = await getFriendsAndSubscribers(id);
      setFriendsCount(friends.length);
      setSubscribersCount(subscribers.length);

      if (!props.me) {
        const res2 = await axiosService.get('/friendship/' + id + '/status');
        if (res2.data.status) {
          setFriendshipStatus(res2.data.status.currentStatus);
        }
      }

      const res3 = await axiosService.get('/posts/' + id);
      setPosts(res3.data.posts);

      setLoading(false);

      return () => {};
    };

    main();
    //eslint-disable-next-line
  }, [id]);

  const nameOfButton = () => {
    if (!friendshipStatus) {
      return 'Добавить в друзья';
    }

    const currentStatus = friendshipStatus.status;
    const reciever = friendshipStatus.reciever;
    const sender = friendshipStatus.sender;

    if ((currentStatus === 'Requested' && sender === id) || (currentStatus === 'Declined' && reciever === id)) {
      return 'Принять заявку в друзья';
    }

    if ((currentStatus === 'Requested' && reciever === id) || (currentStatus === 'Declined' && sender === id)) {
      return 'Заявка отправлена';
    }

    if (currentStatus === 'Accepted') {
      return 'Удалить из друзей';
    }

    return 'Добавить в друзья';
  };

  const addFriendHandler = async (e) => {
    const name = nameOfButton();
    let type;
    switch (name) {
      case 'Добавить в друзья':
        type = 'add';
        break;
      case 'Принять заявку в друзья':
        type = 'add';
        break;
      case 'Заявка отправлена':
        type = 'delete';
        break;
      case 'Удалить из друзей':
        type = 'delete';
        break;
      default:
        type = 'add';
        break;
    }

    setLoading(true);
    const result = await axiosService.post('/friendship', { username: nickname, type });
    result.data.friendship.reciever = result.data.friendship.reciever._id;
    result.data.friendship.sender = result.data.friendship.sender._id;

    const res = await axiosService.get('/friendship/' + id);
    setFriendsCount(res.data.friends.length);
    setSubscribersCount(res.data.subscribers.length);

    setFriendshipStatus(result.data.friendship);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="content">
        <div className="aboutme" style={{ overflow: 'hidden' }}>
          Загрузка...
        </div>
      </div>
    );
  }

  const sendPost = async (e) => {
    setLoading(true);
    await axiosService.post('/posts', { text: inputText });
    setInputText('');

    const res3 = await axiosService.get('/posts/' + id);
    setPosts(res3.data.posts);

    setLoading(false);
  };

  const navigateToFriends = (id) => {
    if (props.me) {
      navigate('/friends');
    } else {
      navigate('/friends/' + id);
    }
  };

  return (
    <div className="content">
      <div className="aboutme__wrapper_page ">
        <div className="aboutme nicescroll">
          <div className="aboutme__info">
            <div className="aboutme__nickname">{nickname}</div>
            <div className="aboutme__friends" onClick={() => navigateToFriends(id)}>{`${friendsCount} друзей`}</div>
            <div
              className="aboutme__subscribers"
              onClick={() => navigateToFriends(id)}
            >{`${subscribersCount} подписчиков`}</div>
            {props.me ? (
              <></>
            ) : (
              <div className="aboutme__addToFriends" style={{ cursor: 'pointer' }} onClick={addFriendHandler}>
                <div className="aboutme__wrapper">
                  <span>{nameOfButton()}</span>
                </div>
              </div>
            )}
          </div>
          {props.me ? (
            <>
              <div className="aboutme__header">Написать пост:</div>
              <div className="aboutme__input">
                <MyInput
                  minHeight={50}
                  maxHeight={200}
                  setInputText={setInputText}
                  inputText={inputText}
                  onClickHandler={sendPost}
                />
              </div>
              <div className="aboutme__header">Мои посты:</div>
              <div className="aboutme__posts">
                <Posts posts={posts} />
              </div>
            </>
          ) : (
            <>
              <div className="aboutme__header">Посты пользователя:</div>
              <div className="aboutme__posts">
                <Posts posts={posts} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPage;
