import { useEffect, useState } from 'react';
import { getUserPhoto } from '../../API/static';

export const TopPanel = (props: { username: string }) => {
  const { username } = props;
  const [photo, setPhoto] = useState('/user.svg');

  useEffect(() => {
    const main = async () => {
      const photo = await getUserPhoto(username);
      if (photo) setPhoto(photo);
    };

    main();
  }, []);

  return (
    <div className="friends__top_panel">
      <div className="friends__icon">
        <img src={photo} alt="user logo" height={30} width={30} />
      </div>
      <div className="friends__username">{username}</div>
    </div>
  );
};
