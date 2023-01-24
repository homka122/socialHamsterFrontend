import { useNavigate } from 'react-router-dom';
import './Posts.css';

function Posts(props) {
  const { posts } = props;
  const navigate = useNavigate();

  const renderPosts = () => {
    let renderedPosts = [];

    posts.forEach((post) => {
      console.log(post);
      renderedPosts.push(
        <div className="posts__post" key={post._id}>
          <div className="posts__user" onClick={() => navigate('/users/' + post.author._id)}>
            <div className="posts__icon">
              <img src="/user.svg" alt="user logo" height={25} width={25} />
            </div>
            <div className="posts__nickname">{post.author.username}</div>
            <div className="posts__date">
              {new Date(post.createdAt).toLocaleString('ru-RU', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
          <div className="posts__text">{post.text}</div>
        </div>
      );
    });

    return renderedPosts;
  };

  return <div className="posts nicescroll">{renderPosts()}</div>;
}

export default Posts;
