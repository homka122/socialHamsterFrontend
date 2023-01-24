import { useEffect, useState } from 'react';
import { axiosService } from '../../API/axiosService';
import MyInput from '../../Components/MyInput/MyInput';
import Posts from '../../Components/Posts/Posts';
import './Feed.css';

function Feed(props) {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState('true');
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const main = async () => {
      setLoading(true);

      const res = await axiosService.get('/posts');
      setPosts(res.data.posts);

      setLoading(false);
    };

    main();
  }, []);

  const sendPost = async (e) => {
    setLoading(true);
    await axiosService.post('/posts', { text: inputText });
    setInputText('');

    const res3 = await axiosService.get('/posts');
    setPosts(res3.data.posts);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="content">
        <div className="feed" style={{ overflow: 'hidden' }}>
          Загрузка...
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      <div className="feed__wrapper">
        <div className="feed nicescroll">
          <div className="feed__header">Написать пост:</div>
          <div className="feed__input">
            <MyInput
              minHeight={50}
              maxHeight={200}
              setInputText={setInputText}
              inputText={inputText}
              onClickHandler={sendPost}
            />
          </div>
          <div className="feed__header">Посты пользователя:</div>
          <div className="feed__posts">
            <Posts posts={posts} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feed;
