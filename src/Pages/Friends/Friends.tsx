import { useEffect, useState } from 'react';
import { getFriendsAndSubscribers, addRemoveFriend, getAllFriendships } from '../../API/friends';
import { UserMinimal } from '../../types';
import './Friends.css';
import { TopPanel } from './TopPanel';

type Button = {
  type: 'add' | 'delete';
  name: string;
};

type Option = {
  header: string;
  array: UserMinimal[];
  buttons: Button[];
};

type Options = {
  friends: Option;
  subscribers: Option;
  input: Option;
  output: Option;
};

export const Friends = () => {
  const [option, setOption] = useState<'friends' | 'subscribers' | 'input' | 'output'>('friends');
  const [friends, setFriends] = useState<UserMinimal[]>([]);
  const [subscribers, setSubscribers] = useState<UserMinimal[]>([]);
  const [input, setInput] = useState<UserMinimal[]>([]);
  const [output, setOutput] = useState<UserMinimal[]>([]);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    const main = async () => {
      const { friends, subscribers } = await getFriendsAndSubscribers(localStorage.getItem('userId') as string);

      setFriends(friends);
      setSubscribers(subscribers);

      const friendships = await getAllFriendships();
      const input: UserMinimal[] = [];
      const output: UserMinimal[] = [];
      friendships.forEach((friendship) => {
        const currentStatus = friendship.currentStatus;
        const companion = friendship.user1._id === localStorage.getItem('userId') ? friendship.user2 : friendship.user1;

        if (currentStatus.status === 'Requested' && currentStatus.reciever === localStorage.getItem('userId')) {
          input.push({ username: companion.username, _id: companion._id });
        }

        if (currentStatus.status === 'Requested' && currentStatus.sender === localStorage.getItem('userId')) {
          output.push({ username: companion.username, _id: companion._id });
        }
      });

      setInput(input);
      setOutput(output);
    };

    main();
  }, [update]);

  const createButton = (button: Button, username: string) => {
    return (
      <div
        className="friends__button"
        onClick={async () => {
          await addRemoveFriend(username, button.type);
          setUpdate((old) => old + 1);
        }}
      >
        {button.name}
      </div>
    );
  };

  const render = () => {
    const options: Options = {
      friends: { header: 'Друзья', array: friends, buttons: [{ type: 'delete', name: 'Удалить из друзей' }] },
      subscribers: { header: 'Подписчики', array: subscribers, buttons: [{ type: 'add', name: 'Добавить в друзья' }] },
      input: {
        header: 'Входящие заявки',
        array: input,
        buttons: [
          { type: 'add', name: 'Добавить в друзья' },
          { type: 'delete', name: 'Отменить заявку' },
        ],
      },
      output: { header: 'Исходящие заявки', array: output, buttons: [{ type: 'delete', name: 'Отменить заявку' }] },
    };

    const currentOption = options[option];

    const result = [];

    result.push(
      <div className="friends__header" style={{ marginBottom: 15 }}>
        {currentOption.header}:{' '}
      </div>
    );

    currentOption.array.forEach((user) => {
      result.push(
        <div className="friends__user">
          <TopPanel username={user.username} />
          <div className="friends__bottom_panel">{currentOption.buttons.map((button) => createButton(button, user.username))}</div>
        </div>
      );
    });

    return result;
  };

  return (
    <>
      <div className="content">
        <div className="friends__border">
          <div className="friends nicescroll">
            <div className="friends__container">{render()}</div>
          </div>
        </div>
      </div>
      <div className="second_content">
        <div className="friends__border">
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
      </div>
    </>
  );
};
