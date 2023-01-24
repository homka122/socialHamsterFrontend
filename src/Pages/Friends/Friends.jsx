import { useEffect, useState } from 'react';
import { addRemoveFriend } from '../../API/addRemoveFriend';
import { getAllFriendships } from '../../API/getAllFriendships';
import { getFriendsAndSubscribers } from '../../API/getFriendsAndSubscribers';
import './Friends.css';

export const Friends = () => {
  const [option, setOption] = useState('friends');
  const [friends, setFriends] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [input, setInput] = useState([]);
  const [output, setOutput] = useState([]);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    const main = async () => {
      const { friends, subscribers } = await getFriendsAndSubscribers(localStorage.getItem('userId'));

      setFriends(friends);
      setSubscribers(subscribers);

      const friendships = await getAllFriendships();
      let input = [];
      let output = [];
      friendships.forEach((friendship) => {
        let user = {};
        const currentStatus = friendship.currentStatus;
        const companion = friendship.user1._id === localStorage.getItem('userId') ? friendship.user2 : friendship.user1;

        if (currentStatus.status === 'Requested' && currentStatus.reciever === localStorage.getItem('userId')) {
          user.status = 'Requested';
          user.username = companion.username;
          user.id = companion._id;
          input.push(user);
        }

        if (currentStatus.status === 'Requested' && currentStatus.sender === localStorage.getItem('userId')) {
          user.status = 'Requested';
          user.username = companion.username;
          user.id = companion._id;
          output.push(user);
        }
      });

      setInput(input);
      setOutput(output);
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
          <div className="friends__bottom_panel">
            <div
              className="friends__button"
              onClick={async () => {
                await addRemoveFriend(sub.username, 'delete');
                setUpdate((old) => old + 1);
              }}
            >
              Удалить из друзей
            </div>
          </div>
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
          <div className="friends__bottom_panel">
            <div
              className="friends__button"
              onClick={async () => {
                await addRemoveFriend(sub.username, 'add');
                setUpdate((old) => old + 1);
              }}
            >
              Добавить в друзья
            </div>
          </div>
        </div>
      );
    });

    return renderedSubscribers;
  };

  const renderInput = () => {
    let renderedSubscribers = [];
    renderedSubscribers.push(
      <div className="friends__header" style={{ marginBottom: 15 }}>
        Входящие заявки:{' '}
      </div>
    );
    input.forEach((sub) => {
      renderedSubscribers.push(
        <div className="friends__user">
          <div className="friends__top_panel">
            <div className="friends__icon">
              <img src="/user.svg" alt="user logo" height={30} width={30} />
            </div>
            <div className="friends__username">{sub.username}</div>
          </div>
          <div className="friends__bottom_panel">
            <div
              className="friends__button"
              onClick={async () => {
                await addRemoveFriend(sub.username, 'add');
                setUpdate((old) => old + 1);
              }}
            >
              Добавить в друзья
            </div>
            <div
              className="friends__button"
              onClick={async () => {
                await addRemoveFriend(sub.username, 'delete');
                setUpdate((old) => old + 1);
              }}
            >
              Отклонить заявку
            </div>
          </div>
        </div>
      );
    });

    return renderedSubscribers;
  };

  const renderOutput = () => {
    let renderedSubscribers = [];
    renderedSubscribers.push(
      <div className="friends__header" style={{ marginBottom: 15 }}>
        Отпраленные заявки:{' '}
      </div>
    );
    output.forEach((sub) => {
      renderedSubscribers.push(
        <div className="friends__user">
          <div className="friends__top_panel">
            <div className="friends__icon">
              <img src="/user.svg" alt="user logo" height={30} width={30} />
            </div>
            <div className="friends__username">{sub.username}</div>
          </div>
          <div className="friends__bottom_panel">
            <div
              className="friends__button"
              onClick={async () => {
                await addRemoveFriend(sub.username, 'delete');
                setUpdate((old) => old + 1);
              }}
            >
              Отменить заявку
            </div>
          </div>
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
    if (option === 'input') {
      return renderInput();
    }
    if (option === 'output') {
      return renderOutput();
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
            <div className="friendsRight__element" onClick={() => setOption('input')}>
              Входящие заявки ({input.length})
            </div>
            <div className="friendsRight__element" onClick={() => setOption('output')}>
              Отправленные заявки ({output.length})
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
