import { useEffect, useState } from 'react';
import { createPost, getPosts } from '../../API/posts';
import MyInput from '../../Components/MyInput/MyInput';
import Posts from '../../Components/Posts/Posts';
import { PostResponse } from '../../types/PostResponse';
import './Feed.css';

function Feed() {
  const [inputText, setInputText] = useState('');
  const [posts, setPosts] = useState<PostResponse[]>([]);

  useEffect(() => {
    const main = async () => {
      const posts = await getPosts();
      setPosts(posts);
    };

    main();
  }, []);

  const sendPost = async () => {
    await createPost(inputText);
    setInputText('');

    const posts = await getPosts();
    setPosts(posts);
  };

  return (
    <div className="content">
      <div className="feed__wrapper">
        <div className="feed nicescroll">
          <div className="feed__header">Написать пост:</div>
          <div className="feed__input">
            <MyInput minHeight={50} maxHeight={200} setInputText={setInputText} inputText={inputText} onClickHandler={sendPost} />
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
