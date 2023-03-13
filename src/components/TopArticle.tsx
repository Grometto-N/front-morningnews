import react from 'react';
import styles from '../styles/TopArticle.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';

import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import { UserState } from '@/reducers/user';



type ArticleProps = {
	title: string;
	author: string;
	description : string;
  urlToImage : string;
  isBookmarked : boolean;
  inBookmarks : boolean;
};

export default function TopArticle({title, author, description,  urlToImage,  isBookmarked}: ArticleProps) {
  const dispatch = useDispatch();
  const user = useSelector((state:{user:UserState}) => state.user.value);
  const theArticle = {title, author, description,  urlToImage}

  const handleBookmarkClick = () => {
    if (!user.token) {
      return;
    }

    fetch(`http://localhost:3000/users/canBookmark/${user.token}`)
      .then(response => response.json())
      .then(data => {
        if (data.result && data.canBookmark) {
          if (isBookmarked) {
            dispatch(removeBookmark(theArticle));
          } else {
            dispatch(addBookmark(theArticle));
          }
        }
      });
  }

  let iconStyle = {};
  if (isBookmarked) {
    iconStyle = { 'color': '#E9BE59' };
  }

  return (
    <div className={styles.topContainer}>
      <img src={urlToImage} className={styles.image} alt={title} />
      <div className={styles.topText}>
        <h2 className={styles.topTitle}>{title}</h2>
        <FontAwesomeIcon onClick={() => handleBookmarkClick()} icon={faBookmark} style={iconStyle} className={styles.bookmarkIcon} />
        <h4>{author}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
}
