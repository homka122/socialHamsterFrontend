import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { getFriendsAndSubscribers } from '../../API/friends';
import { UserMinimal } from '../../types';
import './FriendList.css';
import { TopPanel } from './TopPanel';

export const FriendList = () => {
  const state: { type: 'friends' | 'subscribers' } = useLocation().state;
  const [option, setOption] = useState<'friends' | 'subscribers'>(state.type || 'friends');
  const [friends, setFriends] = useState<UserMinimal[]>([]);
  const [subscribers, setSubscribers] = useState<UserMinimal[]>([]);
  const { id } = useParams();

  useEffect(() => {
    const main = async () => {
      const { friends, subscribers } = await getFriendsAndSubscribers(id as string);

      setFriends(friends);
      setSubscribers(subscribers);
    };

    main();
  }, []);

  const render = () => {
    const config = { friends: { header: 'Друзья', array: friends }, subscribers: { header: 'Подписчики', array: subscribers } };

    const renderedSubscribers = [];

    renderedSubscribers.push(
      <div className="friends__header" style={{ marginBottom: 15 }}>
        {config[option].header}:{' '}
      </div>
    );

    config[option].array.forEach((user) => {
      renderedSubscribers.push(
        <div className="friends__user">
          <TopPanel username={user.username} />
          <div className="friends__bottom_panel"></div>
        </div>
      );
    });

    return renderedSubscribers;
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
