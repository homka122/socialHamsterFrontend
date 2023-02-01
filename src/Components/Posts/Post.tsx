import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserPhoto } from '../../API/static';
import { likePost } from '../../API/likes';
import { Comment } from '../Comment/Comment';
import MyInput from '../MyInput/MyInput';
import { PostResponse, CommentResponse } from '../../types';
import { addComment, getComments } from '../../API/comments';

export const Post = (props: { post: PostResponse }) => {
  const { post } = props;
  const navigate = useNavigate();

  const [photo, setPhoto] = useState('/user.svg');
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [isCommentsHide, setIsCommentsHide] = useState(true);
  const [inputText, setInputText] = useState('');
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);

  useEffect(() => {
    getUserPhoto(post.author.username).then((photo) => {
      if (photo) {
        setPhoto(photo);
      }
    });
  }, [post.author.username]);

  const renderLogo = () => {
    return post.isLiked ? '/nheart.svg' : '/heart.svg';
  };

  const like = async (postId: string) => {
    if (isLikeProcessing) {
      return;
    }

    setIsLikeProcessing(true);

    const type = await likePost(postId);
    if (type === 'like') {
      post.isLiked = true;
      post.likesCount += 1;
    }
    if (type === 'dislike') {
      post.isLiked = false;
      post.likesCount -= 1;
    }

    setIsLikeProcessing(false);
  };

  const renderComments = () => {
    return comments.map((comment) => <Comment comment={comment} key={comment._id} />);
  };

  const sendComment = async () => {
    setInputText('');

    const comment = await addComment(post._id, inputText);
    if (comment) {
      setComments((old) => [...old, comment]);
      post.commentsCount += 1;
    }

    const comments = await getComments(post._id);
    setComments(comments);
  };

  const openCommentsHandler = async () => {
    if (comments.length === 0) {
      await getComments(post._id).then(setComments);
    }
    setIsCommentsHide((old) => !old);
  };

  return (
    <div className="posts__post">
      <div className="posts__user" onClick={() => navigate('/users/' + post.author._id)}>
        <div className="posts__icon">
          <img src={photo} alt="user logo" height={25} width={25} style={{ objectFit: 'cover' }} />
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
      <div className="posts__bottom">
        <img className="posts__like" src={renderLogo()} alt="heart logo" onClick={() => like(post._id)} />
        <div className="posts__likes">{post.likesCount}</div>
        <img className="posts__comment" src="/comments.svg" alt="comments logo" onClick={openCommentsHandler} />
        <div className="posts__comments">{post.commentsCount}</div>
      </div>
      <div className="posts__comments_wrap" style={{ display: isCommentsHide ? 'none' : '' }}>
        <div className="post__comments">{renderComments()}</div>
        <div className="post__comments_input">
          <MyInput minHeight={50} maxHeight={200} setInputText={setInputText} inputText={inputText} onClickHandler={sendComment} />
        </div>
      </div>
    </div>
  );
};
