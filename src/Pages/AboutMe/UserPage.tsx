import './UserPage.css';
import MyInput from '../../Components/MyInput/MyInput';
import Posts from '../../Components/Posts/Posts';
import React, { useEffect, useState } from 'react';
import { axiosService } from '../../API/axiosService';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadPhoto, getUserNickname } from '../../API/users';
import { getFriendsAndSubscribers, getFriendshipStatusWithUser } from '../../API/friends';
import { getUserPhoto } from '../../API/static';
import { getPosts, createPost } from '../../API/posts';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { SpinnerCircular } from 'spinners-react';
import { PostResponse } from '../../types';
import { CurrentStatus } from '../../types/friendshipResponse';

function UserPage(props: { me?: boolean }) {
  const [inputText, setInputText] = useState('');
  const [nickname, setNickname] = useState('');
  const [friendsCount, setFriendsCount] = useState(0);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [friendshipStatus, setFriendshipStatus] = useState<CurrentStatus | undefined>();
  const [loadingButton, setLoadingButton] = useState(true);
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingUserPhoto, setLoadingUserPhoto] = useState(true);
  const [loadingUserNickname, setLoadingUserNickname] = useState(true);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [photo, setPhoto] = useState('/user.svg');

  const navigate = useNavigate();

  const obj = useParams<{ id: string }>();
  let id: string;
  if (props.me) {
    id = localStorage.getItem('userId') as string;
  } else {
    id = obj.id as string;
    if (id === localStorage.getItem('userId')) {
      navigate('/me');
    }
  }

  useEffect(() => {
    const main = async () => {
      if (props.me) {
        setNickname(localStorage.getItem('username') as string);
        setLoadingUserNickname(false);

        getUserPhoto(localStorage.getItem('username') as string).then((photo) => {
          if (photo) {
            setPhoto(photo);
          }

          setLoadingUserPhoto(false);
        });
      } else {
        getUserNickname(id).then((nickname) => {
          setNickname(nickname);
          setLoadingUserNickname(false);

          getUserPhoto(nickname).then((photo) => {
            if (photo) {
              setPhoto(photo);
            } else {
              setPhoto('/user.svg');
            }
            setLoadingUserPhoto(false);
          });
        });
      }

      getFriendsAndSubscribers(id).then(({ friends, subscribers }) => {
        setFriendsCount(friends.length);
        setSubscribersCount(subscribers.length);
      });

      if (!props.me) {
        getFriendshipStatusWithUser(id).then((friendship) => {
          if (friendship) {
            setFriendshipStatus(friendship.currentStatus);
          }
          setLoadingButton(false);
        });
      }

      getPosts(id).then((posts) => {
        setPosts(posts);
        setLoadingPost(false);
      });
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

  const addFriendHandler = async () => {
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

    setLoadingButton(true);
    const result = await axiosService.post('/friendship', { username: nickname, type });
    result.data.friendship.reciever = result.data.friendship.reciever._id;
    result.data.friendship.sender = result.data.friendship.sender._id;

    const res = await axiosService.get('/friendship/' + id);
    setFriendsCount(res.data.friends.length);
    setSubscribersCount(res.data.subscribers.length);

    setFriendshipStatus(result.data.friendship);
    setLoadingButton(false);
  };

  const sendPost = async () => {
    setLoadingPost(true);

    await createPost(inputText);
    setInputText('');

    const posts = await getPosts(id);
    setPosts(posts);

    setLoadingPost(false);
  };

  const navigateToFriends = (id: string, type: 'friends' | 'subscribers') => {
    if (props.me) {
      navigate('/friends');
    } else {
      navigate('/friends/' + id, { state: { type } });
    }
  };

  const uploadPhotoHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const formData = new FormData();
    if (e.target.files) {
      const file = e.target.files[0];
      formData.append('avatar', file);
      await uploadPhoto(formData);
      const photo = await getUserPhoto(nickname);
      if (photo) {
        setPhoto(photo);
      } else {
        setPhoto('/user.svg');
      }
    }
  };

  return (
    <div className="content">
      <div className="aboutme__wrapper_page ">
        <div className="aboutme nicescroll">
          <div className="aboutme__info">
            <div className="aboutme__userphoto">
              {loadingUserPhoto ? <Skeleton height={100} width={100} /> : <img className="aboutme__userphoto_img" src={photo} alt="user photo" />}
            </div>
            <div className="aboutme__nickname">{loadingUserNickname ? <Skeleton /> : nickname}</div>
            <div className="aboutme__friends" onClick={() => navigateToFriends(id, 'friends')}>{`${friendsCount} друзей`}</div>
            <div className="aboutme__subscribers" onClick={() => navigateToFriends(id, 'subscribers')}>{`${subscribersCount} подписчиков`}</div>
            {props.me ? (
              <>
                <form id="form">
                  <label htmlFor="upload-photo" className="aboutme__addToFriends" style={{ cursor: 'pointer' }}>
                    <div className="aboutme__wrapper">
                      Изменить фото профиля
                      <input type="file" id="upload-photo" onChange={uploadPhotoHandler} />
                    </div>
                  </label>
                </form>
              </>
            ) : (
              <div className="aboutme__addToFriends" style={{ cursor: 'pointer' }} onClick={() => addFriendHandler()}>
                <div className="aboutme__wrapper">
                  <span>{loadingButton ? <SpinnerCircular size={20} /> : nameOfButton()}</span>
                </div>
              </div>
            )}
          </div>
          {props.me ? (
            <>
              <div className="aboutme__header">Написать пост:</div>
              <div className="aboutme__input">
                <MyInput minHeight={50} maxHeight={200} setInputText={setInputText} inputText={inputText} onClickHandler={sendPost} />
              </div>
              <div className="aboutme__header">Мои посты:</div>
              <div className="aboutme__posts">{loadingPost ? <SpinnerCircular size={20} /> : <Posts posts={posts} />}</div>
            </>
          ) : (
            <>
              <div className="aboutme__header">Посты пользователя:</div>
              <div className="aboutme__posts">{loadingPost ? <SpinnerCircular size={20} /> : <Posts posts={posts} />}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserPage;
