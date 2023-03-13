import react from 'react';

import Image from 'next/image';
import styles from '../styles/Article.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { useDispatch, useSelector } from 'react-redux';
import { addBookmark, removeBookmark } from '../reducers/bookmarks';
import { hideArticle } from '../reducers/hiddenArticles';
import {UserState} from '../reducers/user';

// Composant permettant l'affichage d'un article

type ArticleProps = {
	title: string;
	author: string;
	description : string;
  urlToImage : string;
  isBookmarked : boolean;
  inBookmarks : boolean;
};

export default function Article({title, author, description, urlToImage,isBookmarked,inBookmarks}: ArticleProps){

  const dispatch = useDispatch();

  // récupération des données sur l'utilisateur : servira pour les autorisations pour les favoris
	const user = useSelector((state : {user : UserState}) => state.user.value);

  // récupération des données de l'articles via les props
  const theArticle = {title, author, description, urlToImage};

  // fonction gérant l'ajout ou la suppression des favoris
	const handleBookmarkClick = () => {
    // si pas d'utilisateur pas de favoris possible
		if (!user.token) {
			return;
		}

    // récupération de l'autorisation, puis ajout ou suppression des favoris
		fetch(`http://localhost:3000/users/canBookmark/${user.token}`)
			.then(response => response.json())
			.then(data => {
				if (data.result && data.canBookmark) {
					if(isBookmarked) {
						dispatch(removeBookmark(theArticle));
					} else {
						dispatch(addBookmark(theArticle));
					}
				}
			});
	}


  // fonction gérant le cache ou l'affichage d'un article
	const handleHiddenClick = () => {
    dispatch(hideArticle(title));	
	}


  // couleur de l'icône selon si l'article appartient ou non aux favoris 
  let iconStyle = {};
  if (isBookmarked) {
    iconStyle = { 'color': '#E9BE59' };
  }

  // Affichage du composant
	return (	
		<div className={styles.articles}>
      <div className={styles.articleHeader}>
        <h3>{title}</h3>
        <FontAwesomeIcon onClick={() => handleBookmarkClick()} icon={faBookmark} style={iconStyle} className={styles.bookmarkIcon} />
        {inBookmarks || <FontAwesomeIcon icon={faEyeSlash} onClick={() => handleHiddenClick()} className={styles.hideIcon} />}
      </div>
      <h4 style={{ textAlign: "right" }}>- {author}</h4>
      <div className={styles.divider}></div>
      <Image src={urlToImage} alt={title} width={400} height={200} />
      <p>{description}</p>
    </div>
	);
}