import { useEffect, useState } from 'react';
import { getUserPhoto } from '../../API/static';
import './Comment.css';
import { CommentResponse } from '../../types';
import { likeComment } from '../../API/comments';

const formatDate = (date: Date) => {
  return new Date(date).toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const Comment = (props: { comment: CommentResponse }) => {
  const [comment, setComment] = useState(props.comment);
  const { createdAt, likeUsers, post, text, user, _id } = comment;

  const [photo, setPhoto] = useState('/user.svg');

  useEffect(() => {
    getUserPhoto(user.username).then((photo) => {
      if (photo) {
        setPhoto(photo);
      }
    });
  }, []);

  const likeCommentHandler = async () => {
    await likeComment(post, _id).then((comment) => {
      if (comment) {
        setComment((old) => {
          return { ...old, likeUsers: comment.likeUsers };
        });
      }
    });
  };

  const renderLogo = () => {
    const ids = likeUsers.map((user) => user._id);
    if (ids.includes(localStorage?.getItem('userId') as string)) {
      return '/nheart.svg';
    } else {
      return '/heart.svg';
    }
  };

  return (
    <div className="comment">
      <div className="comment__user">
        <div className="comment__photo">{<img src={photo} height={25} width={25} />}</div>
        <div className="comment__username">{user.username}</div>
      </div>
      <div className="comment__text">{text}</div>
      <div className="comment__bottom">
        <div className="comment__date">{formatDate(createdAt)}</div>
        <div className="comment__like" style={{ cursor: 'pointer' }}>
          <div className="comment__like_icon">
            <img src={renderLogo()} alt="heart logo" height={20} width={20} onClick={() => likeCommentHandler()} />
          </div>
          <div className="comment__like_count">{likeUsers.length}</div>
        </div>
      </div>
      <div className="comment__border_wrap">
        <div className="comment__border" />
      </div>
    </div>
  );
};
