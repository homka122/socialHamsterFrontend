import { PostResponse } from '../../types/PostResponse';
import { Post } from './Post';
import './Posts.css';

function Posts(props: { posts: PostResponse[] }) {
  const { posts } = props;

  const renderPosts = () => {
    return posts.map((post) => <Post post={post} key={post._id} />);
  };

  return <div className="posts nicescroll">{renderPosts()}</div>;
}

export default Posts;
