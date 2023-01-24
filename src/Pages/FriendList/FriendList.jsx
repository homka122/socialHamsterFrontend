import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addRemoveFriend } from '../../API/addRemoveFriend';
import { getFriendsAndSubscribers } from '../../API/getFriendsAndSubscribers';
import './FriendList.css';

export const FriendList = (props) => {
  const [option, setOption] = useState(props.option || 'friends');
  const [friends, setFriends] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [update, setUpdate] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    const main = async () => {
      const { friends, subscribers } = await getFriendsAndSubscribers(id);

      setFriends(friends);
      setSubscribers(subscribers);
    };

    main();
  }, [update]);

  const renderFriends = () => {
    let renderedSubscribers = [];

    renderedSubscribers.push(
      <div className="friends__header" style={{ marginBottom: 15 }}>
        Друзья:
      </div>
    );

    friends.forEach((sub) => {
      console.log(friends);
      renderedSubscribers.push(
        <div className="friends__user">
          <div className="friends__top_panel">
            <div className="friends__icon">
              <img src="/user.svg" alt="user logo" height={30} width={30} />
            </div>
            <div className="friends__username">{sub.username}</div>
          </div>
          <div className="friends__bottom_panel"></div>
        </div>
      );
    });

    return renderedSubscribers;
  };

  const renderSubscribers = () => {
    let renderedSubscribers = [];
    renderedSubscribers.push(
      <div className="friends__header" style={{ marginBottom: 15 }}>
        Подписчики:{' '}
      </div>
    );
    subscribers.forEach((sub) => {
      renderedSubscribers.push(
        <div className="friends__user">
          <div className="friends__top_panel">
            <div className="friends__icon">
              <img src="/user.svg" alt="user logo" height={30} width={30} />
            </div>
            <div className="friends__username">{sub.username}</div>
          </div>
          <div className="friends__bottom_panel"></div>
        </div>
      );
    });

    return renderedSubscribers;
  };

  const render = () => {
    if (option === 'friends') {
      return renderFriends();
    }
    if (option === 'subscribers') {
      return renderSubscribers();
    }
  };

  return (
    <>
      <div className="content">
        <div className="friends">
          <div className="friends__container">{render()}</div>
        </div>
      </div>
      <div className="second_content">
        <div className="friendsRight">
          <div className="friendsRight__container">
            <div className="friendsRight__element" onClick={() => setOption('friends')}>
              Друзья ({friends.length})
            </div>
            <div className="friendsRight__element" onClick={() => setOption('subscribers')}>
              Подписчики ({subscribers.length})
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
